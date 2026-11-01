const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function loadDataModule(file) {
  const module = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(js, { module, exports: module.exports });
  return module.exports;
}
const { buildQuizBank, countQuizTopics, drawQuizRound } = loadDataModule('src/data/quiz.ts');
const { educationalData } = loadDataModule('src/data/educationalData.ts');
const { cities } = JSON.parse(fs.readFileSync(path.join(root, 'public/data/india_cities.json'), 'utf8'));
const bank = buildQuizBank(educationalData, cities);
const topics = ['mixed', 'capitals', 'landmarks', 'city-state', 'facts'];
const normalize = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
function rng(seed = 42) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}
function ids(round) { return Array.from(round.questions, question => question.id); }

test('all categories expand verified source data, retaining useful fun facts', () => {
  const counts = countQuizTopics(bank);
  assert.equal(counts.capitals, 36);
  assert(counts.landmarks > 100, 'include all distinct attractions, not only the first per city');
  assert(counts['city-state'] > 6000);
  assert(counts.facts >= 30);
  assert.equal(counts.mixed, counts.capitals + counts.landmarks + counts['city-state'] + counts.facts);
  assert.equal(new Set(bank.map(question => question.id)).size, bank.length);
  assert(!bank.some(question => /Discover the unique history/i.test(question.question)));
  assert(bank.filter(question => question.category === 'facts').every(question => !question.question.includes(question.answer)));
});

test('5, 10, and 20 question rounds have four unique answers and one correct option', () => {
  for (const topic of topics) for (const length of [5, 10, 20]) {
    const round = drawQuizRound(bank, topic, length, [], rng(length));
    assert.equal(round.questions.length, length);
    assert.equal(new Set(ids(round)).size, length);
    for (const question of round.questions) {
      assert.equal(question.options.length, 4, question.id);
      assert.equal(new Set(question.options.map(normalize)).size, 4, question.id);
      assert.equal(question.options.filter(option => option === question.answer).length, 1, question.id);
      assert(topic === 'mixed' || question.category === topic);
    }
  }
});

test('mixed rounds give smaller categories space alongside the city directory', () => {
  const { questions } = drawQuizRound(bank, 'mixed', 20, [], rng());
  for (const topic of topics.slice(1)) assert.equal(questions.filter(question => question.category === topic).length, 5);
});

test('successive rounds use unseen questions and history survives switching topics', () => {
  for (const topic of topics) {
    const first = drawQuizRound(bank, topic, 10, [], rng(10));
    const second = drawQuizRound(bank, topic, 10, first.seenIds, rng(20));
    assert(ids(second).every(id => !new Set(ids(first)).has(id)), topic);
  }
  const mixed = drawQuizRound(bank, 'mixed', 20, [], rng(30));
  const capitals = drawQuizRound(bank, 'capitals', 20, mixed.seenIds, rng(31));
  assert(ids(capitals).every(id => !new Set(ids(mixed)).has(id)));
  for (const id of mixed.seenIds) assert(capitals.seenIds.includes(id));
});

test('a cycle consumes its last unseen questions before any repeat and never duplicates within the round', () => {
  const first = drawQuizRound(bank, 'capitals', 20, [], rng(40));
  const second = drawQuizRound(bank, 'capitals', 20, first.seenIds, rng(41));
  const remaining = bank.filter(question => question.category === 'capitals' && !first.seenIds.includes(question.id));
  assert.equal(remaining.length, 16);
  assert(remaining.every(question => ids(second).includes(question.id)));
  assert(ids(second).slice(0, 16).every(id => !first.seenIds.includes(id)));
  assert.equal(new Set(ids(second)).size, 20);
  const third = drawQuizRound(bank, 'capitals', 5, second.seenIds, rng(42));
  assert(ids(third).every(id => !ids(second).includes(id)));
});

test('shared city names, alias collisions, and ambiguous landmarks are excluded', () => {
  const data = Object.fromEntries(['Alpha', 'Beta', 'Gamma', 'Delta'].map((name, index) => [name, {
    name, capital: `Capital ${index}`, cities: [{ name: `City ${index}`, coordinates: [index, index],
      landmarks: [index < 2 ? 'Clock Tower' : `Unique attraction ${index}`] }],
    funFact: index === 0 ? 'Discover the unique history and culture of Alpha.' : `${name} has a distinctive educational fact numbered ${index}.`,
  }]));
  const directory = [
    { name: 'Shared', stateName: 'Alpha' }, { name: 'Shared', stateName: 'Beta' },
    { name: 'Alias clash', stateName: 'Gamma' }, { name: 'Other city', aliases: ['Alias clash'], stateName: 'Delta' },
    { name: 'Unique town', stateName: 'Alpha' }, { name: 'Unique town', stateName: 'Alpha' },
  ].map((city, index) => ({ ...city, id: String(index), coordinates: [0, 0], source: 'geonames' }));
  const questions = buildQuizBank(data, directory);
  assert(!questions.some(question => question.id === 'landmark:clock tower'));
  assert(!questions.some(question => question.id === 'city-state:shared' || question.id === 'city-state:alias clash'));
  assert.equal(questions.filter(question => question.id === 'city-state:unique town').length, 1);
  assert(!questions.some(question => question.category === 'facts' && question.answer === 'Alpha'));
});

test('small or unavailable pools cap safely and stale saved IDs are discarded', () => {
  const small = bank.filter(question => question.category === 'capitals').slice(0, 3);
  const round = drawQuizRound(small, 'capitals', 20, ['obsolete-question'], rng());
  assert.equal(round.questions.length, 3);
  assert.equal(new Set(ids(round)).size, 3);
  assert(!round.seenIds.includes('obsolete-question'));
  assert.equal(drawQuizRound([], 'mixed', 20).questions.length, 0);
  assert.equal(drawQuizRound(small, 'facts', 20).questions.length, 0);
  const fallback = buildQuizBank(educationalData);
  assert(fallback.some(question => question.category === 'city-state'));
  assert(fallback.length > 250, 'quiz remains usable before directory loading completes');
});

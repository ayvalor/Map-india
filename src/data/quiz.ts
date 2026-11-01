import type { StateData } from './educationalData';
import type { CityLocation } from './cities';

export type QuizCategory = 'capitals' | 'landmarks' | 'city-state' | 'facts';
export type QuizTopic = 'mixed' | QuizCategory;
export type QuizLength = 5 | 10 | 20;
export interface QuizTemplate {
  id: string;
  category: QuizCategory;
  question: string;
  answer: string;
  explanation: string;
  answerPool: readonly string[];
  source: 'atlas' | 'geonames';
}
export interface QuizQuestion extends Omit<QuizTemplate, 'answerPool'> { options: string[] }
export const QUIZ_TOPICS: readonly { id: QuizTopic; label: string; description: string }[] = [
  { id: 'mixed', label: 'Mixed', description: 'A variety of capitals, landmarks, city locations, and fun facts.' },
  { id: 'capitals', label: 'Capitals', description: 'Match states and union territories to their capitals.' },
  { id: 'landmarks', label: 'Landmarks', description: 'Connect memorable attractions with their associated cities.' },
  { id: 'city-state', label: 'City → State', description: 'Find the state or union territory of a city or town.' },
  { id: 'facts', label: 'Fun facts', description: 'Recognize states and territories from their atlas facts.' },
];
const categories: QuizCategory[] = ['capitals', 'landmarks', 'city-state', 'facts'];
const normalize = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en')
  .replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');

function uniqueAnswers(values: readonly string[]): string[] {
  const unique = new Map<string, string>();
  for (const raw of values) {
    const value = raw.trim();
    if (value && value !== 'N/A' && !unique.has(normalize(value))) unique.set(normalize(value), value);
  }
  return [...unique.values()];
}

/** Question text describes relationships in the existing source data, without adding new facts. */
export function buildQuizBank(data: Record<string, StateData>, directory: readonly CityLocation[] = []): QuizTemplate[] {
  const entries = Object.entries(data);
  const states = uniqueAnswers(entries.map(([name]) => name));
  const capitals = uniqueAnswers(entries.map(([, state]) => state.capital));
  const cityEntries = entries.flatMap(([stateName, state]) => state.cities.map(city => ({ city, stateName,
    label: `${city.name}, ${stateName}`,
  })));
  const cityAnswers = uniqueAnswers(cityEntries.map(entry => entry.label));
  const bank: QuizTemplate[] = [];
  if (capitals.length >= 4) for (const [name, state] of entries) {
    if (!state.capital?.trim() || state.capital.trim() === 'N/A') continue;
    bank.push({ id: `capital:${normalize(name)}`, category: 'capitals',
      question: `What is the capital of ${name}?`,
      answer: state.capital.trim(), answerPool: capitals,
      explanation: `The atlas lists ${state.capital} as the capital entry for ${name}.`, source: 'atlas' });
  }

  // Common attraction names can belong to several cities. Do not ask ambiguous questions.
  const landmarks = new Map<string, { landmark: string; answers: Set<string> }>();
  for (const { city, label } of cityEntries) for (const landmark of city.landmarks) {
    const key = normalize(landmark);
    if (!key) continue;
    const entry = landmarks.get(key) ?? { landmark: landmark.trim(), answers: new Set<string>() };
    entry.answers.add(label);
    landmarks.set(key, entry);
  }
  if (cityAnswers.length >= 4) for (const [key, entry] of landmarks) {
    if (entry.answers.size !== 1) continue;
    const answer = [...entry.answers][0];
    bank.push({ id: `landmark:${key}`, category: 'landmarks',
      question: `Which city is associated with “${entry.landmark}”?`, answer, answerPool: cityAnswers,
      explanation: `“${entry.landmark}” appears in the landmark list for ${answer}. Nearby attractions can also be included in a city entry.`, source: 'atlas' });
  }

  const facts = new Map<string, { prompt: string; original: string; states: Set<string> }>();
  for (const [stateName, state] of entries) {
    const fact = state.funFact?.trim();
    if (!fact || fact.length < 30 || /^Discover the unique history/i.test(fact)) continue;
    const statePattern = [stateName, state.name].map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const prompt = fact.replace(new RegExp(statePattern, 'gi'), 'this state or territory');
    const key = normalize(prompt);
    const entry = facts.get(key) ?? { prompt, original: fact, states: new Set<string>() };
    entry.states.add(stateName); facts.set(key, entry);
  }
  if (states.length >= 4) for (const [key, entry] of facts) {
    if (entry.states.size !== 1) continue;
    const answer = [...entry.states][0];
    bank.push({ id: `fact:${key}`, category: 'facts', question: `Which state or union territory does this fact describe? “${entry.prompt}”`,
      answer, answerPool: states, explanation: entry.original, source: 'atlas' });
  }

  const places: readonly CityLocation[] = directory.length ? directory : cityEntries.map(({ city, stateName }) => ({
    id: `curated:${stateName}:${city.name}`, name: city.name, coordinates: city.coordinates, stateName, source: 'curated' as const,
  }));
  const nameStates = new Map<string, Set<string>>();
  for (const place of places) {
    if (!data[place.stateName]) continue;
    for (const name of [place.name, ...(place.aliases ?? [])]) {
      const key = normalize(name);
      if (!key) continue;
      const owners = nameStates.get(key) ?? new Set<string>();
      owners.add(place.stateName); nameStates.set(key, owners);
    }
  }
  const includedCities = new Set<string>();
  if (states.length >= 4) for (const place of places) {
    const key = normalize(place.name);
    if (!key || !data[place.stateName] || nameStates.get(key)?.size !== 1 || includedCities.has(key)) continue;
    includedCities.add(key);
    bank.push({ id: `city-state:${key}`, category: 'city-state',
      question: `Which state or union territory is ${place.name} in?`, answer: place.stateName, answerPool: states,
      explanation: `${place.name} is listed in ${place.stateName} in ${place.source === 'geonames' ? 'the GeoNames city directory' : 'the atlas educational entries'}.`,
      source: place.source === 'geonames' ? 'geonames' : 'atlas' });
  }
  return bank;
}

export function countQuizTopics(bank: readonly QuizTemplate[]): Record<QuizTopic, number> {
  const counts = { mixed: bank.length, capitals: 0, landmarks: 0, 'city-state': 0, facts: 0 };
  for (const question of bank) counts[question.category]++;
  return counts;
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Mixed rounds draw from available categories in turn, instead of letting the
// much larger gazetteer crowd out capital and landmark questions.
function takeBalanced(pool: readonly QuizTemplate[], count: number, random: () => number): QuizTemplate[] {
  const order = shuffle(categories, random);
  const queues = new Map(order.map(category => [category, shuffle(pool.filter(item => item.category === category), random)]));
  const chosen: QuizTemplate[] = [];
  while (chosen.length < count) {
    let added = false;
    for (const category of order) {
      const next = queues.get(category)?.pop();
      if (next) { chosen.push(next); added = true; }
      if (chosen.length === count) break;
    }
    if (!added) break;
  }
  return chosen;
}

/** Consume unseen questions first. Recycle only after the selected pool is exhausted. */
export function drawQuizRound(bank: readonly QuizTemplate[], topic: QuizTopic, requestedLength: number,
  seenIds: readonly string[] = [], random: () => number = Math.random): { questions: QuizQuestion[]; seenIds: string[] } {
  const pool = bank.filter(item => topic === 'mixed' || item.category === topic);
  const length = Math.max(0, Math.min(Math.floor(requestedLength), pool.length));
  const knownIds = new Set(bank.map(item => item.id));
  const seen = new Set(seenIds.filter(id => knownIds.has(id)));
  const chosen = takeBalanced(pool.filter(item => !seen.has(item.id)), length, random);
  if (chosen.length < length) {
    for (const item of pool) seen.delete(item.id);
    const chosenIds = new Set(chosen.map(item => item.id));
    chosen.push(...takeBalanced(pool.filter(item => !chosenIds.has(item.id)), length - chosen.length, random));
  }
  for (const item of chosen) seen.add(item.id);
  const questions = chosen.map(({ answerPool, ...item }) => ({ ...item,
    options: shuffle([item.answer, ...shuffle(uniqueAnswers(answerPool).filter(answer => normalize(answer) !== normalize(item.answer)), random).slice(0, 3)], random),
  }));
  return { questions, seenIds: [...seen] };
}

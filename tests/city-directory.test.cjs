const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const root = path.resolve(__dirname, '..');
const { cities } = JSON.parse(fs.readFileSync(path.join(root, 'public/data/india_cities.json'), 'utf8'));
const boundaries = JSON.parse(fs.readFileSync(path.join(root, 'public/data/india_states.geojson'), 'utf8'));
const context = {};
vm.createContext(context);
vm.runInContext(stripTypeScriptTypes(fs.readFileSync(path.join(root, 'src/data/educationalData.ts'), 'utf8'))
  .replace('export const educationalData', 'const educationalData') + '\nglobalThis.data = educationalData;', context);

test('countrywide directory has unique IDs, valid points and all 36 map regions', () => {
  assert(cities.length > 7000);
  assert.equal(new Set(cities.map(city => city.id)).size, cities.length);
  const regions = new Set(boundaries.features.map(feature => feature.properties.ST_NM));
  assert.equal(regions.size, 36);
  assert.deepEqual(new Set(cities.map(city => city.stateName)), regions);
  for (const city of cities) {
    assert(city.name && city.id && regions.has(city.stateName));
    assert.equal(city.coordinates.length, 2);
    const [longitude, latitude] = city.coordinates;
    assert(Number.isFinite(longitude) && Math.abs(longitude) <= 180);
    assert(Number.isFinite(latitude) && Math.abs(latitude) <= 90);
    assert(city.population === undefined || (Number.isFinite(city.population) && city.population > 0));
  }
});

test('each original educational destination keeps exactly one explicit link', () => {
  for (const [stateName, state] of Object.entries(context.data)) {
    for (const article of state.cities) {
      assert.equal(cities.filter(city => city.stateName === stateName && city.educationalName === article.name).length, 1,
        `${stateName}/${article.name} must resolve unambiguously`);
    }
  }
});

test('historic Amaravati stays distinct from the modern capital point', () => {
  const historic = cities.find(city => city.id === 'curated-andhra-pradesh-amaravati');
  const capital = cities.find(city => city.id === 'geonames-12261477');
  assert(historic && capital);
  assert.equal(historic.educationalName, 'Amaravati');
  assert.equal(capital.educationalName, undefined);
  assert.notDeepEqual(historic.coordinates, capital.coordinates);
});

test('Sri Vijaya Puram retains the historical Port Blair search name', () => {
  const city = cities.find(city => city.id === 'geonames-1259385');
  assert.equal(city.name, 'Sri Vijaya Puram');
  assert(city.aliases.includes('Port Blair'));
});

test('GeoNames entries exclude neighborhoods and abandoned/locality records', () => {
  const allowed = new Set(['PPL', 'PPLC', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLA5']);
  for (const city of cities.filter(city => city.source === 'geonames')) assert(allowed.has(city.featureCode));
});

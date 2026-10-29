const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
// Node 24+; pass a directory containing the two official GeoNames downloads.
if (!process.argv[2]) throw new Error('Usage: node scripts/import-geonames.cjs <download-directory>');
const sourceDirectory = path.resolve(process.argv[2]);
const project = path.resolve(__dirname, '..');
const archivePath = path.join(sourceDirectory, 'cities500.zip');
const archive = fs.readFileSync(archivePath);
let end = archive.length - 22;
while (end >= 0 && archive.readUInt32LE(end) !== 0x06054b50) end--;
if (end < 0) throw new Error('Missing ZIP directory');
let position = archive.readUInt32LE(end + 16);
let contents;
for (let i = 0; i < archive.readUInt16LE(end + 10); i++) {
  const method = archive.readUInt16LE(position + 10);
  const length = archive.readUInt32LE(position + 20);
  const nameLength = archive.readUInt16LE(position + 28);
  const extraLength = archive.readUInt16LE(position + 30);
  const commentLength = archive.readUInt16LE(position + 32);
  const local = archive.readUInt32LE(position + 42);
  const name = archive.toString('utf8', position + 46, position + 46 + nameLength);
  if (name === 'cities500.txt') {
    if (method !== 8) throw new Error('Unexpected ZIP compression');
    const start = local + 30 + archive.readUInt16LE(local + 26) + archive.readUInt16LE(local + 28);
    contents = zlib.inflateRawSync(archive.subarray(start, start + length)).toString('utf8');
  }
  position += 46 + nameLength + extraLength + commentLength;
}
if (!contents) throw new Error('cities500.txt missing');
const js = stripTypeScriptTypes(fs.readFileSync(path.join(project, 'src/data/educationalData.ts'), 'utf8'))
  .replace('export const educationalData', 'const educationalData') + '\nglobalThis.data = educationalData;';
const context = {};
vm.createContext(context);
vm.runInContext(js, context);
const educationalData = context.data;
const stateAliases = { 'Jammu and Kashmir': 'Jammu & Kashmir', 'Andaman and Nicobar': 'Andaman & Nicobar' };
const admins = new Map(fs.readFileSync(path.join(sourceDirectory, 'admin1CodesASCII.txt'), 'utf8').trim().split('\n')
  .map(line => line.trim().split('\t')).filter(fields => fields[0].startsWith('IN.'))
  .map(fields => [fields[0].slice(3), stateAliases[fields[1]] || fields[1]]));
const normalize = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en')
  .replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
const km = (a, b) => Math.hypot((a[0] - b[0]) * Math.cos((a[1] + b[1]) * 0.5 * Math.PI / 180), a[1] - b[1]) * 111.195;
const sourceRows = contents.trim().split('\n').map(line => line.split('\t')).filter(fields => fields[8] === 'IN');
const allowed = new Set(['PPL', 'PPLC', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLA5']);
const excluded = {};
const cities = sourceRows.filter(fields => {
  if (allowed.has(fields[7])) return true;
  excluded[fields[7]] = (excluded[fields[7]] || 0) + 1;
  return false;
}).map(fields => {
  const stateName = admins.get(fields[10]);
  if (!stateName || !educationalData[stateName]) throw new Error(`Unmapped admin1 ${fields[10]}`);
  const name = fields[0] === '1259385' ? 'Sri Vijaya Puram' : fields[2] || fields[1];
  const aliases = [...new Set([fields[1], fields[2], ...fields[3].split(',')].filter(alias => alias && alias !== name))];
  const city = { id: `geonames-${fields[0]}`, name, coordinates: [+fields[5], +fields[4]], stateName,
    source: 'geonames', featureCode: fields[7] };
  if (+fields[14] > 0) city.population = +fields[14];
  if (aliases.length) city.aliases = aliases;
  return city;
});
const matched = [];
const supplements = [];
for (const [stateName, state] of Object.entries(educationalData)) {
  for (const article of state.cities) {
    const name = normalize(article.name);
    const candidates = cities.filter(city => city.stateName === stateName && !city.educationalName &&
      [city.name, ...(city.aliases || [])].some(alias => normalize(alias) === name) && km(city.coordinates, article.coordinates) <= 15)
      .sort((a, b) => km(a.coordinates, article.coordinates) - km(b.coordinates, article.coordinates));
    if (candidates.length) {
      candidates[0].educationalName = article.name;
      matched.push([stateName, article.name, candidates[0].id]);
    } else {
      const historicalAmaravati = stateName === 'Andhra Pradesh' && article.name === 'Amaravati';
      const city = { id: `curated-${normalize(stateName).replace(/ /g, '-')}-${name.replace(/ /g, '-')}`,
        name: historicalAmaravati ? 'Amaravati (historic town)' : article.name,
        coordinates: [...article.coordinates], stateName, source: 'curated', educationalName: article.name };
      if (historicalAmaravati) city.aliases = ['Amaravati', 'Amaravathi'];
      cities.push(city);
      supplements.push([stateName, article.name, city.id]);
    }
  }
}
cities.sort((a, b) => a.stateName.localeCompare(b.stateName, 'en') || (b.population || 0) - (a.population || 0) || a.name.localeCompare(b.name, 'en') || a.id.localeCompare(b.id));
const counts = {};
for (const city of cities) counts[city.stateName] = (counts[city.stateName] || 0) + 1;
if (Object.keys(counts).length !== 36) throw new Error('State/UT coverage incomplete');
if (new Set(cities.map(city => city.id)).size !== cities.length) throw new Error('Duplicate IDs');
const metadata = {
  schemaVersion: 1,
  retrievedAt: fs.statSync(archivePath).mtime.toISOString(),
  generatedAt: new Date().toISOString(),
  source: 'GeoNames cities500, country code IN',
  downloadUrl: 'https://download.geonames.org/export/dump/cities500.zip',
  admin1Url: 'https://download.geonames.org/export/dump/admin1CodesASCII.txt',
  documentationUrl: 'https://download.geonames.org/export/dump/readme.txt',
  license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  attribution: 'Contains information from GeoNames (https://www.geonames.org), available under CC BY 4.0. Filtered, renamed and combined with existing educational locations.',
  archiveSha256: crypto.createHash('sha256').update(archive).digest('hex'),
  countryRecordsInSource: sourceRows.length,
  acceptedFeatureCodes: [...allowed], excludedFeatureCodeCounts: excluded,
  geonamesCount: cities.filter(city => city.source === 'geonames').length,
  curatedSupplementCount: supplements.length, matchedEducationalCount: matched.length,
  totalCount: cities.length, stateCounts: counts,
  coverage: 'Current populated places and administrative seats from GeoNames cities500. Not an exhaustive list of all Indian settlements or all census towns. Population reference years are unspecified. State/UT assignment uses GeoNames admin1 codes, not a point-in-polygon inference.',
  nameCorrections: [{ id: 'geonames-1259385', sourceName: 'Port Blair', displayName: 'Sri Vijaya Puram', reference: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2054647' }],
};
fs.mkdirSync(path.join(project, 'public/data'), { recursive: true });
const target = path.join(project, 'public/data/india_cities.json');
fs.writeFileSync(target, JSON.stringify({ metadata, cities }) + '\n');
console.log(JSON.stringify({ ...metadata, supplements, bytes: fs.statSync(target).size }, null, 2));

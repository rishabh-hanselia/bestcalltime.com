import fs from 'fs';

const continentMap = {
  AF: 'Africa',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  SA: 'South America',
  OC: 'Oceania',
  AN: 'Antarctica'
};

async function main() {
  const countryInfoStr = fs.readFileSync('countryInfo.txt', 'utf8');
  const countryMap = {};
  const countryLines = countryInfoStr.split('\n');
  
  for (const line of countryLines) {
    if (!line || line.startsWith('#')) continue;
    const parts = line.split('\t');
    if (parts.length > 8) {
      const code = parts[0];
      const name = parts[4];
      const continent = continentMap[parts[8]] || parts[8];
      countryMap[code] = { name, continent };
    }
  }

  const citiesStr = fs.readFileSync('cities15000.txt', 'utf8');
  const citiesLines = citiesStr.split('\n');
  const locations = [];
  const seen = new Set();

  for (const line of citiesLines) {
    if (!line || line.trim() === '') continue;
    const parts = line.split('\t');
    
    // According to GeoNames fields:
    // 2: asciiname
    // 8: country code
    // 17: timezone
    const city = parts[2];
    const countryCode = parts[8];
    const timezone = parts[17]?.trim();

    if (!timezone || !city || !countryCode) continue;

    const cInfo = countryMap[countryCode];
    if (!cInfo) continue;

    const loc = {
      city: city,
      country: cInfo.name,
      continent: cInfo.continent,
      timezone: timezone
    };

    // Deduplicate by city and timezone combination
    const key = `${loc.city}|${loc.timezone}`;
    if (!seen.has(key)) {
      seen.add(key);
      locations.push(loc);
    }
  }

  // Sort locations alphabetically by City for better UX
  locations.sort((a, b) => a.city.localeCompare(b.city));

  const jsonOut = JSON.stringify(locations);
  fs.writeFileSync('src/lib/locations.json', jsonOut);
  
  console.log(`Successfully generated src/lib/locations.json with ${locations.length} entries.`);
  console.log(`File size: ${(jsonOut.length / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);

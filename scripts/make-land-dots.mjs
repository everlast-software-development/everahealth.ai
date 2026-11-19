// Generates client/src/assets/globe/land-dots.json: an even grid of [lon, lat] points that fall on land.
// Run once from the project root: node scripts/make-land-dots.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
const topo = JSON.parse(readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'));
const land = feature(topo, topo.objects.land);
const pts = [];
for (let lat = -58; lat <= 80; lat += 2.2) {
  const step = 2.2 / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
  for (let lon = -180; lon < 180; lon += step)
    if (geoContains(land, [lon, lat])) pts.push([+lon.toFixed(1), +lat.toFixed(1)]);
}
mkdirSync('client/src/assets/globe', { recursive: true });
writeFileSync('client/src/assets/globe/land-dots.json', JSON.stringify(pts));
console.log(pts.length, 'land dots');   // about 2,260 points, ~27 KB

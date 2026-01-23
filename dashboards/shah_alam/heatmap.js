// Init map
const map = L.map('map').setView([3.0738, 101.5183], 12);

// Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom: 19
}).addTo(map);

// Load parlimen boundary GeoJSON
fetch('../../P108_shah_alam.geojson')
.then(r => r.json())
.then(geo => {
  L.geoJSON(geo,{
    style:{
      color:'#0055ff',
      weight:2,
      fillOpacity:0.05
    }
  }).addTo(map);
});

// Heatmap plugin array
const heatPoints = [];

// CSV Google Sheet
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-iNN5TGHSaSlasflrE880zYmVBV2CjYbR_Wg8Nz5ERgsYlOp1sAJIBuzax8MFBSWr5frkDUQL7BL-/pub?output=csv";

fetch(csvUrl)
.then(r => r.text())
.then(text => {

  const rows = text.split('\n').slice(1); // buang header

  rows.forEach(row => {

    if(!row.trim()) return;

    const cols = row.split(',');

    const case_id   = cols[0];
    const kategori  = cols[3];
    const ringkasan = cols[4];
    const lat = parseFloat(cols[6]);
    const lng = parseFloat(cols[7]);

    if(isNaN(lat) || isNaN(lng)) return;

    // push heat point
    heatPoints.push([lat, lng, 1]);

    // create marker pin
    const marker = L.circleMarker([lat,lng],{
      radius:6,
      color:'#ff3b3b',
      fillOpacity:0.9
    }).addTo(map);

    // popup clickable link to details page
    marker.bindPopup(`
      <b>${case_id}</b><br>
      ${kategori}<br>
      <a href="details.html?case_id=${encodeURIComponent(case_id)}" target="_blank">
        Lihat Detail
      </a>
    `);

  });

  // add heatmap layer after loop
  L.heatLayer(heatPoints,{
    radius:25,
    blur:15,
    maxZoom:17
  }).addTo(map);

});

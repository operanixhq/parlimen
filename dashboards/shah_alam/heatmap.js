const map = L.map('map').setView([3.0738, 101.5183], 12);

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'© OpenStreetMap'
}).addTo(map);

// Load polygon Shah Alam
fetch('../../P108_shah_alam.geojson')
.then(r => r.json())
.then(data => {
  L.geoJSON(data,{
    style:{color:'#005eff',weight:2,fillOpacity:0.05}
  }).addTo(map);
});

// CSV data source
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXBgy7se3-U4mSHdnbZ6YiRYToQEVFtEKuZ_z_RRCby7nYGd-HViMSNexPxFHP2pENCUjkX3ofqqlE/pub?output=csv";

fetch(csvUrl)
.then(r => r.text())
.then(text => {
  const rows = text.split('\n').slice(1);
  rows.forEach(row => {
    const cols = row.split(',');

    const case_id = cols[0];
    const lat = parseFloat(cols[5]);
    const lng = parseFloat(cols[6]);
    const kategori = cols[2];
    const ringkasan = cols[3];

    if(!isNaN(lat) && !isNaN(lng)){
      const marker = L.circleMarker([lat,lng],{
        radius:6,
        color:'#ff3b3b',
        fillOpacity:0.8
      }).addTo(map);

      marker.bindPopup(`
        <b>${case_id}</b><br>
        ${kategori}<br>
        ${ringkasan}<br><br>
        <a href="details.html?case_id=${case_id}">Lihat Detail</a>
      `);
    }
  });
});


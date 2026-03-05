const map = L.map('map').setView([3.0738, 101.5183], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:18
}).addTo(map);

// boundary
fetch('../../N47_telupid.geojson')
.then(r=>r.json())
.then(data=>{
  L.geoJSON(data,{
    style:{color:'#0055ff',weight:2,fillOpacity:0}
  }).addTo(map);
});

// GOOGLE SCRIPT
const jsonUrl = "https://script.google.com/macros/s/AKfycbwsHQjrm7DXKY4ovunQCU1hPm5Iu2IYr2juCPpi-FwTm4P089B46h8FSWN-GyVWaFspcw/exec?pusat_khidmat=telupid&type=ADU"

fetch(jsonUrl)
.then(r=>r.json())
.then(results=>{

  let heatPoints = [];

  results.forEach(item => {

    const case_id = item.case_id;
    const kategori = item.kategori_aduan;
    const ringkasan = item.ringkasan_aduan;
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng);

    if(!isNaN(lat) && !isNaN(lng)){

      heatPoints.push([lat,lng,1]);

      const marker = L.circleMarker([lat,lng],{
        radius:6,
        color:'#ff3333',
        fillOpacity:0.9
      }).addTo(map);

      marker.bindPopup(`
        <b>${case_id}</b><br>
        ${kategori}<br>
        ${ringkasan}<br><br>
        <a href="details.html?case_id=${case_id}" target="_blank">
        Lihat detail kes
        </a>
      `);
    }

  });

  L.heatLayer(heatPoints,{
    radius:45,
    blur:30,
    maxZoom:17,
    minOpacity:0.6
  }).addTo(map);

});


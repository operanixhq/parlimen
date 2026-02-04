const map = L.map('map').setView([3.0738, 101.5183], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:18
}).addTo(map);

// boundary
fetch('../../N23_petagas.geojson')
.then(r=>r.json())
.then(data=>{
  L.geoJSON(data,{
    style:{color:'#0055ff',weight:2,fillOpacity:0}
  }).addTo(map);
});

// CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCswEWJqT5zhMu079LXYhppZvMbXwntOuMLRrl8P9ywfjjk_9TLF3-ENM-5QgaG-nCvI4tYG6lrb2q/pub?output=csv"

Papa.parse(csvUrl,{
  download:true,
  skipEmptyLines:true,
  complete: function(results){

    const rows = results.data.slice(1);
    let heatPoints = [];

    rows.forEach(cols => {

      const case_id = cols[0];
      const kategori = cols[3];
      const ringkasan = cols[4];
      const lat = parseFloat(cols[6]);
      const lng = parseFloat(cols[7]);

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
  }
});

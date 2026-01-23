const map = L.map('map').setView([3.0738, 101.5183], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:18
}).addTo(map);

// load boundary
fetch('../../P108_shah_alam.geojson')
.then(r=>r.json())
.then(data=>{
  L.geoJSON(data,{
    style:{color:'#0055ff',weight:2,fillOpacity:0.05}
  }).addTo(map);
});

// CSV publish link kau
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXBgy7se3-U4mSHdnbZ6YiRYToQEVFtEKuZ_z_RRCby7nYGd-HViMSNexPxFHP2pENCUjkX3ofqqlE/pub?output=csv';

Papa.parse(csvUrl,{
  download:true,
  header:true,
  complete: function(results){

    let heatPoints = [];

    results.data.forEach(row => {

      const case_id   = row.case_id;
      const kategori  = row.kategori_aduan;
      const ringkasan = row.ringkasan_aduan;
      const lat = parseFloat(row.lat);
      const lng = parseFloat(row.lng);

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
      radius:25,
      blur:15,
      maxZoom:17
    }).addTo(map);
  }
});

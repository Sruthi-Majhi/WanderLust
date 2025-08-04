document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");

  if (!mapElement) {
    console.warn("Map container not found.");
    return;
  }

  const location = mapElement.dataset.location;
  if (!location) {
    console.warn("No location provided.");
    return;
  }

  console.log("Geocoding location:", location);

  // Using Nominatim API to get coordinates
  fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        console.error("Location not found");
        return;
      }

      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);
      console.log("Coordinates:", lat, lon);

      const map = new ol.Map({
        target: "map",
        layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
          })],
        view: new ol.View({
          center: ol.proj.fromLonLat([lon, lat]),
          zoom: 9,
        }),
      });

      // Add marker
      const marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
      });

      // Defining custom marker style 
      const markerStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // marker icon URL
          scale: 0.09, // increase size here for better visibility
          opacity: 1, // fully visible
        }),
      });

      // Applying the style to the marker
      marker.setStyle(markerStyle);

      const vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [marker],
        }),
      });

      map.addLayer(vectorLayer);
    })
    .catch((err) => {
      console.error("Geocoding error:", err);
    });
});

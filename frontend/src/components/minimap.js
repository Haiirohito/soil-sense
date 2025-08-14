import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FitBounds = ({ geometry }) => {
  const map = useMap();

  useEffect(() => {
    if (geometry) {
      const geoJsonLayer = new L.GeoJSON(geometry);
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [10, 10] });
    }
  }, [geometry, map]);

  return null;
};

const MiniMap = ({ geometry }) => {
  return (
    <MapContainer
      style={{ height: "160px", width: "100%" }}
      center={[0, 0]}
      zoom={2}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=""
      />
      {geometry && <GeoJSON data={geometry} />}
      <FitBounds geometry={geometry} />
    </MapContainer>
  );
};

export default MiniMap;

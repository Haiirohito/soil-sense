import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const ZoomToGeometry = ({ geometry }) => {
  const map = useMap();

  useEffect(() => {
    if (!geometry) return;
    const geoJsonLayer = L.geoJSON(geometry);
    map.fitBounds(geoJsonLayer.getBounds());
  }, [geometry, map]);

  return null;
};

const DrawMap = ({ onShapeDrawn, preloadedGeometry, viewOnly }) => {
  const featureGroupRef = useRef(null);

  const handleCreated = (e) => {
    const layer = e.layer;
    const geoJson = layer.toGeoJSON();
    onShapeDrawn(geoJson);
  };

  return (
    <MapContainer
      center={[23.2599, 77.4126]}
      zoom={14}
      style={{ height: "95%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {preloadedGeometry && <ZoomToGeometry geometry={preloadedGeometry} />}

      <FeatureGroup ref={featureGroupRef}>
        {viewOnly ? (
          preloadedGeometry && <GeoJSON data={preloadedGeometry} />
        ) : (
          <EditControl
            position="topleft"
            onCreated={handleCreated}
            draw={{
              rectangle: true,
              polygon: true,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
            }}
          />
        )}
      </FeatureGroup>
    </MapContainer>
  );
};

export default DrawMap;

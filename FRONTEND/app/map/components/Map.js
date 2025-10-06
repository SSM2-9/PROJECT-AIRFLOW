"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This is a common fix to make Leaflet's default icons work correctly in React.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ data }) => {
  // If we have data, use the first point's location for the map center.
  // Otherwise, use a default location like Los Angeles.
  const mapCenter = data.length > 0 ? [data[0].latitude, data[0].longitude] : [34.0522, -118.2437];

  return (
    <div className="response">
      <h2>Map of NO2 Levels</h2>
      <MapContainer center={mapCenter} zoom={8} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* We loop through the 'data' array and create a Marker for each point */}
        {data.map((point, index) => (
          <Marker key={index} position={[point.latitude, point.longitude]}>
            <Popup>
              NO2 Level: {point.no2_total_column.toExponential(2)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
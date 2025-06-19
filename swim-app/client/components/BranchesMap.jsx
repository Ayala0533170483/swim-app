import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// תיקון לאייקונים של Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// אייקון כחול בולט לבריכות
const poolIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// אייקון אדום לסניף שנבחר
const selectedPoolIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49]
});

function BranchesMap({ branches, selectedBranch, onBranchSelect }) {
  const mapRef = useRef();
  const [hoveredBranch, setHoveredBranch] = useState(null);

  // מרכז ישראל כברירת מחדל
  const defaultCenter = [31.5, 34.75];
  const defaultZoom = 8;

  // כשבוחרים סניף - זום אליו עם אנימציה
  useEffect(() => {
    if (selectedBranch && mapRef.current) {
      const branch = branches.find(b => b.pool_id === selectedBranch);
      if (branch && branch.latitude && branch.longitude) {
        mapRef.current.flyTo([branch.latitude, branch.longitude], 15, {
          duration: 1.5
        });
      }
    }
  }, [selectedBranch, branches]);

  // סינון בריכות עם קואורדינטות
  const branchesWithCoords = branches.filter(
    branch => branch.latitude && branch.longitude
  );

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '500px', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {branchesWithCoords.map((branch) => {
          const isSelected = selectedBranch === branch.pool_id;
          const isHovered = hoveredBranch === branch.pool_id;
          
          return (
            <Marker
              key={branch.pool_id}
              position={[branch.latitude, branch.longitude]}
              icon={isSelected ? selectedPoolIcon : poolIcon}
              eventHandlers={{
                click: () => {
                  console.log('Marker clicked:', branch.name);
                  onBranchSelect(branch.pool_id);
                },
                mouseover: (e) => {
                  setHoveredBranch(branch.pool_id);
                  // פתח את הפופאפ
                  setTimeout(() => {
                    e.target.openPopup();
                  }, 100);
                },
                mouseout: (e) => {
                  // עיכוב קטן לפני סגירה - נותן זמן לעבור לפופאפ
                  setTimeout(() => {
                    if (hoveredBranch === branch.pool_id) {
                      setHoveredBranch(null);
                      e.target.closePopup();
                    }
                  }, 200);
                }
              }}
            >
              <Popup
                closeButton={false}
                autoClose={false}
                closeOnClick={false}
                closeOnEscapeKey={false}
                className="custom-popup"
              >
                <div 
                  className="map-popup"
                  onMouseEnter={() => setHoveredBranch(branch.pool_id)}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      setHoveredBranch(null);
                    }, 100);
                  }}
                >
                  <h4>🏊‍♂️ {branch.name}</h4>
                  <p><strong>📍</strong> {branch.city}</p>
                  {branch.phone && <p><strong>📞</strong> {branch.phone}</p>}
                  {branch.description && <p><strong>ℹ️</strong> {branch.description}</p>}
                  
                  <div className="popup-actions">
                    <button 
                      className="btn-small btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBranchSelect(branch.pool_id);
                      }}
                    >
                      📋 הקרבה 
                    </button>
                    <button 
                      className="btn-small btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`,
                          '_blank'
                        );
                      }}
                    >
                      🧭 מסלול
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="map-instructions">
        <p>💡 <strong>טיפים:</strong> עבור עם העכבר על סימן לפרטים מהירים | לחץ על הכפתורים בפופאפ | גלול כדי להתקרב/להתרחק</p>
      </div>
    </div>
  );
}

export default BranchesMap;

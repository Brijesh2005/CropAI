import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import { Info, X, Compass, MapPin } from 'lucide-react';
import MapSearchBar from './MapSearchBar';
import MapToolbar from './MapToolbar';
import FarmAreaConfirmBar from './FarmAreaConfirmBar';
import { toast } from './Toast';
import { useLang } from '../i18n/LanguageContext';

const TILE_LAYERS = {
  hybrid: {
    name: 'Satellite',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 21,
    attribution: 'Imagery & Roads &copy; Google Earth'
  },
  street: {
    name: 'Street',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: [],
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: 'Terrain &copy; Google'
  }
};

const DK_TALUKS = [
  { name: 'Puttur', knName: 'ಪುತ್ತೂರು', lat: 12.7667, lon: 75.2000 },
  { name: 'Mangaluru', knName: 'ಮಂಗಳೂರು', lat: 12.9141, lon: 74.8560 },
  { name: 'Belthangady', knName: 'ಬೆಳ್ತಂಗಡಿ', lat: 13.0000, lon: 75.2600 },
  { name: 'Bantwal', knName: 'ಬಂಟ್ವಾಳ', lat: 12.8900, lon: 75.0300 },
  { name: 'Sullia', knName: 'ಸುಳ್ಯ', lat: 12.5600, lon: 75.3900 },
  { name: 'Moodbidri', knName: 'ಮೂಡುಬಿದಿರೆ', lat: 13.0700, lon: 74.9900 },
  { name: 'Kadaba', knName: 'ಕಡಬ', lat: 12.7400, lon: 75.4300 }
];

export default function HighPrecisionFarmPicker({
  selectedCoords,
  onLocationPicked,
  onFieldConfirmed,
  onGeofenceError,
  farmArea,
  onAreaChange,
  isAnalyzing
}) {
  const { t } = useLang();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const polygonRef = useRef(null);
  const vertexMarkersRef = useRef([]);
  const targetPinRef = useRef(null);

  const [activeLayerKey, setActiveLayerKey] = useState('hybrid');
  const [isLiveLocationActive, setIsLiveLocationActive] = useState(false);
  const [drawMode, setDrawMode] = useState('idle');
  const [calculatedAreaAcres, setCalculatedAreaAcres] = useState(farmArea || 2.34);
  const [calculatedAreaSqm, setCalculatedAreaSqm] = useState(Math.round((farmArea || 2.34) * 4046.86));
  const [hasPolygon, setHasPolygon] = useState(true);
  const [showHowToBanner, setShowHowToBanner] = useState(true);

  const defaultLat = selectedCoords?.lat || 12.7667;
  const defaultLon = selectedCoords?.lon || 75.2000;

  const createOrUpdateTargetPin = (lat, lon) => {
    if (!mapRef.current) return;
    if (targetPinRef.current) {
      targetPinRef.current.setLatLng([lat, lon]);
    } else {
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: '<div class="custom-pin-red"><div class="halo"></div><div class="dot"></div></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      targetPinRef.current = L.marker([lat, lon], { icon }).addTo(mapRef.current);
    }
  };

  const computeAreaFromLatLngs = (latlngs) => {
    try {
      const turfCoords = latlngs.map((pt) => [
        pt.lng !== undefined ? pt.lng : pt[1],
        pt.lat !== undefined ? pt.lat : pt[0]
      ]);
      turfCoords.push(turfCoords[0]);
      const poly = turf.polygon([turfCoords]);
      const areaSqm = turf.area(poly);
      const acres = parseFloat((areaSqm * 0.000247105).toFixed(2));
      setCalculatedAreaSqm(Math.round(areaSqm));
      setCalculatedAreaAcres(acres);
      if (onAreaChange) onAreaChange(acres);
      return { areaSqm, acres };
    } catch (err) {
      console.error('Area calculation error:', err);
      return { areaSqm: 0, acres: 0 };
    }
  };

  const renderPolygonAndHandles = (coords) => {
    if (!mapRef.current) return;

    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
    }
    vertexMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    vertexMarkersRef.current = [];

    const poly = L.polygon(coords, {
      color: '#16a34a',
      weight: 3,
      fillColor: '#22c55e',
      fillOpacity: 0.25
    }).addTo(mapRef.current);
    polygonRef.current = poly;
    setHasPolygon(true);

    computeAreaFromLatLngs(coords);

    coords.forEach((pt, index) => {
      const ptLat = pt.lat !== undefined ? pt.lat : pt[0];
      const ptLng = pt.lng !== undefined ? pt.lng : pt[1];

      const handleIcon = L.divIcon({
        className: 'custom-handle',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:#ffffff;border:3px solid #16a34a;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:move;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([ptLat, ptLng], { icon: handleIcon, draggable: true }).addTo(mapRef.current);
      marker.on('drag', () => {
        const newLatLng = marker.getLatLng();
        const currentPoints = poly.getLatLngs()[0];
        currentPoints[index] = newLatLng;
        poly.setLatLngs([currentPoints]);
        computeAreaFromLatLngs(currentPoints);
      });
      vertexMarkersRef.current.push(marker);
    });
  };

  const createInitialFarmPolygon = (lat, lon) => {
    if (!mapRef.current) return;
    const offsetLat = 0.0009;
    const offsetLon = 0.0011;
    const points = [
      [lat - offsetLat, lon - offsetLon],
      [lat + offsetLat, lon - offsetLon],
      [lat + offsetLat, lon + offsetLon],
      [lat - offsetLat, lon + offsetLon]
    ];
    renderPolygonAndHandles(points);
  };

  const handleMapClick = async (lat, lon) => {
    createOrUpdateTargetPin(lat, lon);

    try {
      const res = await fetch(`/api/geofence-check?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        if (!data.is_inside_dk) {
          if (onGeofenceError) {
            onGeofenceError({
              error: 'OUTSIDE_DAKSHINA_KANNADA',
              message: data.message,
              nearest_taluk: data.nearest_taluk,
              distance_km: data.distance_km,
              lat,
              lon
            });
          }
          return;
        }
      }
    } catch {
      if (lat < 12.45 || lat > 13.25 || lon < 74.75 || lon > 75.68) {
        if (onGeofenceError) {
          onGeofenceError({
            error: 'OUTSIDE_DAKSHINA_KANNADA',
            message: `Selected coordinate (${lat.toFixed(4)}, ${lon.toFixed(4)}) is outside the Dakshina Kannada boundary.`,
            nearest_taluk: 'Puttur',
            distance_km: 15,
            lat,
            lon
          });
        }
        return;
      }
    }

    createInitialFarmPolygon(lat, lon);

    try {
      const revRes = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
      if (revRes.ok) {
        const revData = await revRes.json();
        onLocationPicked(lat, lon, revData.place_name, revData.taluk);
        return;
      }
    } catch {}

    onLocationPicked(lat, lon, 'Selected Farm Plot');
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLon],
      zoom: 16,
      minZoom: 9,
      maxZoom: 21,
      zoomControl: false
    });
    mapRef.current = map;

    map.createPane('boundaryPane');
    map.getPane('boundaryPane').style.zIndex = 450;
    map.getPane('boundaryPane').style.pointerEvents = 'none';

    const layerCfg = TILE_LAYERS.hybrid;
    const tileLayer = L.tileLayer(layerCfg.url, {
      subdomains: layerCfg.subdomains,
      maxZoom: layerCfg.maxZoom,
      attribution: layerCfg.attribution
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    const dkBounds = [
      [13.25, 74.75],
      [13.25, 75.68],
      [12.45, 75.68],
      [12.45, 74.75],
      [13.25, 74.75]
    ];

    L.polygon(dkBounds, {
      color: '#16a34a',
      weight: 3,
      dashArray: '8, 6',
      fillColor: '#16a34a',
      fillOpacity: 0.03,
      interactive: false,
      pane: 'boundaryPane'
    }).addTo(map);

    createOrUpdateTargetPin(defaultLat, defaultLon);
    createInitialFarmPolygon(defaultLat, defaultLon);

    map.on('click', (e) => {
      handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleLayerChange = (layerKey) => {
    setActiveLayerKey(layerKey);
    if (!mapRef.current || !tileLayerRef.current) return;

    mapRef.current.removeLayer(tileLayerRef.current);
    const cfg = TILE_LAYERS[layerKey] || TILE_LAYERS.hybrid;
    const newLayer = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
      attribution: cfg.attribution
    }).addTo(mapRef.current);
    tileLayerRef.current = newLayer;
  };

  const handleSelectPlace = (item) => {
    onLocationPicked(item.lat, item.lon, item.display_name || item.name, item.taluk);
    if (mapRef.current) {
      mapRef.current.flyTo([item.lat, item.lon], 16, { duration: 1.5 });
    }
    createOrUpdateTargetPin(item.lat, item.lon);
    createInitialFarmPolygon(item.lat, item.lon);
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.warning('GPS is not supported by your browser.');
      return;
    }

    setIsLiveLocationActive(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        onLocationPicked(lat, lon, 'My Live Farm Location');
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lon], 17, { duration: 1.5 });
        }
        createOrUpdateTargetPin(lat, lon);
        createInitialFarmPolygon(lat, lon);
        toast.success('Centered on your live GPS location.');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLiveLocationActive(false);
        toast.warning('Unable to read live GPS location. Centered on Dakshina Kannada.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleStartDraw = () => {
    if (!mapRef.current) return;
    setDrawMode('drawing');
    const center = mapRef.current.getCenter();
    createInitialFarmPolygon(center.lat, center.lng);
  };

  const handleDeleteBoundary = () => {
    if (!mapRef.current) return;
    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
    vertexMarkersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    vertexMarkersRef.current = [];
    setHasPolygon(false);
    setDrawMode('idle');
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[480px] rounded-2xl overflow-hidden border border-emerald-300 shadow-md card text-left">
      {/* 1. PERSISTENT HOW-TO BANNER */}
      {showHowToBanner && (
        <div className="absolute top-3 inset-x-3 sm:inset-x-6 z-[1100] flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-emerald-50/95 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-medium shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{t('map.how_to_banner', 'Tap the map to drop a pin, or draw your field boundary.')}</span>
          </div>
          <button
            onClick={() => setShowHowToBanner(false)}
            aria-label="Dismiss instructions"
            className="p-1 text-emerald-800 hover:text-emerald-950 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. TOP CONTROLS: SEARCH BAR & TOOLBAR */}
      <div className={`absolute left-3 right-3 sm:left-4 sm:right-4 z-[1000] flex flex-wrap items-center justify-between gap-2.5 transition-all ${
        showHowToBanner ? 'top-16 sm:top-16' : 'top-3 sm:top-4'
      }`}>
        <MapSearchBar
          onSelectPlace={handleSelectPlace}
          dkTaluks={DK_TALUKS}
        />

        <MapToolbar
          activeLayerKey={activeLayerKey}
          onLayerChange={handleLayerChange}
          onUseLiveLocation={handleUseLiveLocation}
          isLiveLocationActive={isLiveLocationActive}
          onStartDraw={handleStartDraw}
          drawMode={drawMode}
          onClearBoundary={handleDeleteBoundary}
          hasPolygon={hasPolygon}
        />
      </div>

      {/* 3. DAKSHINA KANNADA QUICK TALUK EXPLORATION CHIPS */}
      <div className={`hidden lg:flex absolute left-4 z-[900] items-center gap-1.5 p-1 rounded-xl bg-white/95 border border-slate-200 shadow-sm backdrop-blur-md transition-all ${
        showHowToBanner ? 'top-32' : 'top-20'
      }`}>
        <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('map.taluk_select', 'Taluk:')}</span>
        </span>
        {DK_TALUKS.map((tItem) => (
          <button
            key={tItem.name}
            onClick={() => {
              onLocationPicked(tItem.lat, tItem.lon, `${tItem.name} Agro Zone`, tItem.name);
              if (mapRef.current) {
                mapRef.current.flyTo([tItem.lat, tItem.lon], 16, { duration: 1.2 });
              }
              createOrUpdateTargetPin(tItem.lat, tItem.lon);
              createInitialFarmPolygon(tItem.lat, tItem.lon);
            }}
            className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCoords?.taluk === tItem.name
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tItem.knName} ({tItem.name})
          </button>
        ))}
      </div>

      {/* 4. CONFIRM BARS: DESKTOP FLOATING CARD & MOBILE STICKY BAR */}
      <FarmAreaConfirmBar
        calculatedAreaAcres={calculatedAreaAcres}
        calculatedAreaSqm={calculatedAreaSqm}
        isAnalyzing={isAnalyzing}
        onConfirm={onFieldConfirmed}
        t={t}
      />

      {/* 5. CURRENT TARGET PIN CHIP (BOTTOM LEFT) */}
      <div className="hidden sm:flex absolute bottom-4 left-4 z-[1000] items-center gap-2 px-3 py-2 rounded-xl bg-white/95 border border-slate-300 text-xs text-slate-700 shadow-md backdrop-blur-md">
        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <span className="font-semibold text-slate-900">{t('map.target', 'Target:')}</span>
        <span>
          {selectedCoords?.lat ? selectedCoords.lat.toFixed(4) : defaultLat.toFixed(4)}° N,{' '}
          {selectedCoords?.lon ? selectedCoords.lon.toFixed(4) : defaultLon.toFixed(4)}° E
        </span>
      </div>

      {/* 6. LEAFLET MAP DOM CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

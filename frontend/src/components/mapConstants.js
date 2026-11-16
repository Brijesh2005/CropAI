export const TILE_LAYERS = {
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

export const DK_TALUKS = [
  { name: 'Puttur', knName: 'ಪುತ್ತೂರು', lat: 12.7667, lon: 75.2000 },
  { name: 'Mangaluru', knName: 'ಮಂಗಳೂರು', lat: 12.9141, lon: 74.8560 },
  { name: 'Belthangady', knName: 'ಬೆಳ್ತಂಗಡಿ', lat: 13.0000, lon: 75.2600 },
  { name: 'Bantwal', knName: 'ಬಂಟ್ವಾಳ', lat: 12.8900, lon: 75.0300 },
  { name: 'Sullia', knName: 'ಸುಳ್ಯ', lat: 12.5600, lon: 75.3900 },
  { name: 'Moodbidri', knName: 'ಮೂಡುಬಿದಿರೆ', lat: 13.0700, lon: 74.9900 },
  { name: 'Kadaba', knName: 'ಕಡಬ', lat: 12.7400, lon: 75.4300 }
];

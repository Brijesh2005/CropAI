import React, { useState } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';

export default function MapSearchBar({ onSelectPlace, dkTaluks = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchInput = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val || val.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
      let items = [];
      if (res.ok) {
        const data = await res.json();
        items = data.results || [];
      }

      if (items.length < 3) {
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val + ' Dakshina Kannada')}&format=json&addressdetails=1&limit=5&countrycodes=in`;
          const nomRes = await fetch(nomUrl, { headers: { 'Accept-Language': 'en' } });
          if (nomRes.ok) {
            const nomData = await nomRes.json();
            for (const item of nomData) {
              const lat = parseFloat(item.lat);
              const lon = parseFloat(item.lon);
              if (lat >= 12.45 && lat <= 13.25 && lon >= 74.75 && lon <= 75.68) {
                const shortName = item.name || item.display_name.split(',')[0];
                const alreadyAdded = items.some(
                  (existing) => existing.name.toLowerCase().includes(shortName.toLowerCase())
                );
                if (!alreadyAdded) {
                  items.push({
                    display_name: `${shortName}, Dakshina Kannada`,
                    name: `${shortName}, Dakshina Kannada`,
                    lat,
                    lon,
                    taluk: 'Dakshina Kannada',
                    type: item.type || 'locality',
                    is_inside_dk: true
                  });
                }
              }
            }
          }
        } catch (nomErr) {
          console.warn('Nominatim fallback error:', nomErr);
        }
      }

      setSearchResults(items);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item) => {
    const label = item.display_name || item.name || 'Selected Location';
    setSearchQuery(label);
    setShowDropdown(false);
    onSelectPlace(item);
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md">
      {/* Light Search Bar Input (Min Touch Target 44px) */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 shadow-md text-sm transition-all focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <Search className="w-4 h-4 text-emerald-700 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (searchResults.length > 0) {
                handleSelect(searchResults[0]);
              }
            }
          }}
          placeholder="Search village, town, or taluk..."
          className="bg-transparent text-slate-800 placeholder:text-slate-400 outline-none w-full text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
              setShowDropdown(false);
            }}
            aria-label="Clear search"
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isSearching && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-white border border-emerald-200 shadow-xl overflow-hidden max-h-72 overflow-y-auto z-[1500] text-left">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-2.5 text-left text-xs hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors flex items-start gap-2.5 border-b border-slate-100 last:border-none cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">
                    {item.display_name || item.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.taluk ? `${item.taluk} Taluk` : 'Dakshina Kannada'}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-500 mb-2">
                Quick select Dakshina Kannada taluk:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dkTaluks.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleSelect({ display_name: `${t.name} Taluk Center`, name: t.name, lat: t.lat, lon: t.lon, taluk: t.name, type: 'taluk_hq' })}
                    className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

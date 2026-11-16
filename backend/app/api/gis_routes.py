from fastapi import APIRouter, Query, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import re

from ..core.config import settings
from ..services.geocoding_service import resolve_universal_dk_places, DK_MICRO_LOCALITIES
from ..services.geofence_service import check_dakshina_kannada_geofence

gis_router = APIRouter(prefix="/gis", tags=["GIS"])

class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 10

class AdminInfo(BaseModel):
    village: Optional[str] = None
    district: Optional[str] = "Dakshina Kannada"
    taluk: Optional[str] = None
    state: Optional[str] = "Karnataka"

class LocationResponse(BaseModel):
    id: str
    lon: float
    lat: float
    name: str
    admin: Dict[str, Any]
    distance_km: Optional[float] = None

class BoundaryResponse(BaseModel):
    name: str
    geometry_type: str = "Polygon"
    bbox: List[float]
    features: int

@gis_router.post("/search", response_model=List[LocationResponse])
async def search_locations(request: Request):
    try:
        data = await request.json()
        q = data.get("query", "").strip()
        limit = data.get("limit", 10)
    except Exception:
        q = ""
        limit = 10

    if not q:
        return []

    # Use comprehensive gazetteer + bounded geocoder
    results = resolve_universal_dk_places(q)
    
    locations: List[LocationResponse] = []
    seen = set()

    for i, r in enumerate(results[:limit]):
        loc_id = f"dk-{re.sub(r'[^a-zA-Z0-9]', '-', r.name.lower())}-{i}"
        key = (round(r.lat, 4), round(r.lon, 4))
        if key in seen:
            continue
        seen.add(key)

        locations.append(LocationResponse(
            id=loc_id,
            name=r.name,
            lat=r.lat,
            lon=r.lon,
            admin={
                "village": r.name,
                "district": settings.DISTRICT_NAME,
                "taluk": r.taluk,
                "state": settings.STATE,
                "zone": settings.TALUK_CENTERS.get(r.taluk, {}).get("zone", "Coastal Agriculture Zone")
            },
            distance_km=None
        ))

    return locations

@gis_router.get("/locations", response_model=List[LocationResponse])
async def list_locations(limit: int = Query(default=100, ge=1, le=500)):
    """Return agricultural hub locations across Dakshina Kannada."""
    locations: List[LocationResponse] = []
    
    # 1. Add 7 Taluk Centers
    for taluk_name, tinfo in settings.TALUK_CENTERS.items():
        locations.append(LocationResponse(
            id=f"taluk-{taluk_name.lower()}",
            name=f"{taluk_name} Agricultural Hub",
            lat=tinfo["lat"],
            lon=tinfo["lon"],
            admin={
                "village": taluk_name,
                "district": settings.DISTRICT_NAME,
                "taluk": taluk_name,
                "state": settings.STATE,
                "zone": tinfo.get("zone", "Agro-climatic Zone")
            }
        ))

    # 2. Add micro-localities
    for i, m in enumerate(DK_MICRO_LOCALITIES[:limit]):
        locations.append(LocationResponse(
            id=f"loc-{i}",
            name=m["name"],
            lat=m["lat"],
            lon=m["lon"],
            admin={
                "village": m["name"],
                "district": settings.DISTRICT_NAME,
                "taluk": m["taluk"],
                "state": settings.STATE
            }
        ))

    return locations[:limit]

@gis_router.get("/location/{location_id}", response_model=LocationResponse)
async def get_location(location_id: str):
    """Retrieve location details by id."""
    for taluk_name, tinfo in settings.TALUK_CENTERS.items():
        if taluk_name.lower() in location_id.lower():
            return LocationResponse(
                id=location_id,
                name=f"{taluk_name} Hub",
                lat=tinfo["lat"],
                lon=tinfo["lon"],
                admin={
                    "village": taluk_name,
                    "district": settings.DISTRICT_NAME,
                    "taluk": taluk_name,
                    "state": settings.STATE
                }
            )
    return LocationResponse(
        id=location_id,
        name="Puttur Farm Sector",
        lat=12.7663,
        lon=75.2033,
        admin={"village": "Puttur", "district": "Dakshina Kannada", "taluk": "Puttur", "state": "Karnataka"}
    )

@gis_router.get("/boundaries", response_model=List[BoundaryResponse])
async def get_boundaries():
    """Return boundary polygon and bounding box for Dakshina Kannada."""
    return [
        BoundaryResponse(
            name=f"{settings.DISTRICT_NAME} District",
            geometry_type="Polygon",
            bbox=[settings.DK_LON_MIN, settings.DK_LAT_MIN, settings.DK_LON_MAX, settings.DK_LAT_MAX],
            features=len(settings.TALUKS)
        )
    ]


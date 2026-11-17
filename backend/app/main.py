from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from .core.config import WORKSPACE_DIR, settings
from .api.routes import router
from .api.auth_routes import auth_router, users_router
from .api.gis_routes import gis_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Hybrid Crop Yield Forecasting & Recommendation System using Satellite Imagery and Numerical Data - Specialized for Dakshina Kannada, Karnataka"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    body = await request.body()
    print(f"[REQUEST] {request.method} {request.url.path} | Origin: {request.headers.get('origin')} | Referer: {request.headers.get('referer')} | Body: {body.decode('utf-8', errors='ignore')}")
    # Re-wrap receive so downstream handlers can read the body
    async def receive():
        return {"type": "http.request", "body": body}
    request = Request(request.scope, receive)
    response = await call_next(request)
    return response

# Mount API routes
app.include_router(router, prefix="/api/v1")
app.include_router(router, prefix="/api")

# Mount GIS routes
app.include_router(gis_router, prefix="/api/v1")
app.include_router(gis_router, prefix="/api")
app.include_router(gis_router, prefix="")

# Mount Auth routes at multiple common paths to ensure compatibility
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Mount Users routes
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(users_router, prefix="/users", tags=["Users"])

@app.get("/api/health")
async def health_check():
    return {
        "system": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "region": settings.DISTRICT_NAME,
        "status": "ONLINE"
    }

# Serve frontend static assets if built (unified full-stack deployment)
frontend_dist = WORKSPACE_DIR / "frontend" / "dist"
if frontend_dist.is_dir() and (frontend_dist / "index.html").is_file():
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith(("api", "docs", "redoc", "openapi.json")):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        resolved_dist = frontend_dist.resolve()
        target = (frontend_dist / full_path).resolve()
        if str(target).startswith(str(resolved_dist)) and target.is_file():
            return FileResponse(str(target))
        return FileResponse(str(frontend_dist / "index.html"))
else:
    @app.get("/")
    async def root():
        return {
            "system": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "region": settings.DISTRICT_NAME,
            "status": "ONLINE",
            "docs_url": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

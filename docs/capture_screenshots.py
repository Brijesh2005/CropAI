import os
import time
import subprocess
from pathlib import Path

CHROME_BIN = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT_DIR = Path(r"d:\TerravisionFarm\docs\screenshots")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# List of all views to capture
# (filename, url_query, window_size, virtual_time_budget_ms)
SHOTS = [
    ("01_dashboard_hero.png", "?tab=dashboard", "1440,900", 3000),
    ("02_taluk_sectors.png", "?tab=dashboard", "1440,1400", 4000),
    ("03_interactive_gis_map.png", "?tab=analyze&step=map", "1440,900", 4000),
    ("04_crop_yield_forecast.png", "?tab=analyze&step=results&resultTab=overview", "1440,960", 4000),
    ("05_spectral_telemetry_field.png", "?tab=analyze&step=results&resultTab=overview", "1440,1600", 4500),
    ("06_cultivation_guide.png", "?tab=analyze&step=results&resultTab=guide", "1440,1200", 4000),
    ("07_regional_landscape_matrix.png", "?tab=analyze&step=results&resultTab=landscape", "1440,1100", 4000),
    ("08_bhoomi_rtc_legal_guide.png", "?tab=analyze&step=results&resultTab=legal", "1440,1100", 4000),
    ("09_land_buying_workflow.png", "?tab=analyze&step=results&resultTab=buying", "1440,1200", 4000),
    ("10_ai_models_architecture.png", "?tab=models", "1440,1200", 3500),
    ("11_historical_predictions.png", "?tab=history", "1440,900", 3000),
    ("12_about_sentinel2_tech.png", "?tab=about", "1440,1100", 3000),
    ("13_farmer_auth_portal.png", "?tab=dashboard&auth=1", "1440,900", 3000)
]

for filename, query, size, budget in SHOTS:
    target_file = OUT_DIR / filename
    url = f"http://127.0.0.1:5173/{query}"
    
    cmd = [
        CHROME_BIN,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--window-size={size}",
        f"--virtual-time-budget={budget}",
        f"--screenshot={target_file}",
        url
    ]
    
    print(f"Capturing: {filename} -> {url} ({size})")
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=25)
        if target_file.exists():
            sz = target_file.stat().st_size
            print(f"  Saved: {filename} ({sz} bytes)")
        else:
            print(f"  FAILED to save {filename}: {res.stderr}")
    except Exception as e:
        print(f"  Error capturing {filename}: {e}")
    time.sleep(0.5)

print("\nAll screenshots processed!")

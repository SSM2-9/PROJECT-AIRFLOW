from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from geopy.geocoders import Nominatim
import earthaccess
import netCDF4 as nc
import numpy as np
import os
import json

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/tempo-no2")
def get_tempo_data(city: str, str_date: str, end_date: str):
    # --- Geocoding with Error Handling ---
    geolocator = Nominatim(user_agent="nasa_space_apps_project")
    location = geolocator.geocode(city)
    
    if not location:
        return {"error": f"Could not find coordinates for the city: {city}"}

    # --- Caching Logic ---
    safe_city_name = "".join(c for c in city if c.isalnum()).lower()
    cache_filename = f"{safe_city_name}_{str_date}_{end_date}.json"
    cache_filepath = os.path.join("data_cache", cache_filename)

    if os.path.exists(cache_filepath):
        print(f"Cache hit! Reading from {cache_filepath}")
        with open(cache_filepath, 'r') as f:
            data = json.load(f)
        return data

    print("Cache miss. Starting fresh data retrieval...")
    
    # --- NASA Data Search ---
    auth = earthaccess.login(persist=True)
    short_name = "TEMPO_NO2_L3"
    version = "V03"

    POI_lat = location.latitude
    POI_lon = location.longitude
    datetime_start = str_date + " 00:00:00"
    datetime_end = end_date + " 23:59:59"

    # Wrap the search call in a try/except block to catch the crash
    try:
        POI_results = earthaccess.search_data(
            short_name=short_name,
            version=version,
            temporal=(datetime_start, datetime_end),
            point=(POI_lon, POI_lat),
        )
    except IndexError:
        # This will run if the search crashes because no data was found
        POI_results = []

    if not POI_results:
        print(f"No NASA data found for {city} between {str_date} and {end_date}")
        return {"error": f"No TEMPO data is available for {city} in the selected date range."}

    files = earthaccess.download(POI_results, local_path=".")

    # --- Data Processing ---
    all_data_points = []

    def read_TEMPO_NO2_L3(fn):
        with nc.Dataset(fn) as ds:
            prod = ds.groups["product"]
            strat_NO2_column = prod.variables["vertical_column_stratosphere"][:]
            trop_NO2_column = prod.variables["vertical_column_troposphere"][:]
            QF = prod.variables["main_data_quality_flag"][:]
            lat = ds.variables["latitude"][:]
            lon = ds.variables["longitude"][:]
        return lat, lon, strat_NO2_column, trop_NO2_column, QF

    for granule_file in files:
        # This loop now correctly processes ALL files and adds them to the list.
        lat, lon, strat_NO2_column, trop_NO2_column, QF = read_TEMPO_NO2_L3(granule_file)

        dlat, dlon = 5, 6
        mask_lat = (lat > POI_lat - dlat) & (lat < POI_lat + dlat)
        mask_lon = (lon > POI_lon - dlon) & (lon < POI_lon + dlon)

        trop_NO2_column_loc = trop_NO2_column[0, mask_lat, :][:, mask_lon]
        strat_NO2_column_loc = strat_NO2_column[0, mask_lat, :][:, mask_lon]
        QF_loc = QF[0, mask_lat, :][:, mask_lon]
        best_data_mask_loc = (QF_loc == 0) & (trop_NO2_column_loc > 0.0) & (strat_NO2_column_loc > 0.0)

        nlat, nlon = trop_NO2_column_loc.shape
        if nlat == 0 or nlon == 0:
            continue

        lon_loc_2D = np.vstack([lon[mask_lon]] * nlat)
        lat_loc_2D = np.column_stack([lat[mask_lat]] * nlon)
        total_no2 = trop_NO2_column_loc + strat_NO2_column_loc

        filtered_lats = lat_loc_2D[best_data_mask_loc]
        filtered_lons = lon_loc_2D[best_data_mask_loc]
        filtered_no2 = total_no2[best_data_mask_loc]

        for i in range(len(filtered_lats)):
            all_data_points.append({
                "latitude": float(filtered_lats[i]),
                "longitude": float(filtered_lons[i]),
                "no2_total_column": float(filtered_no2[i])
            })

    # --- Save to Cache and Return ---
    # It runs only after all files have been processed.
    print(f"Saving complete result to {cache_filepath}")
    os.makedirs("data_cache", exist_ok=True)
    with open(cache_filepath, 'w') as f:
        json.dump(all_data_points, f)

    return all_data_points

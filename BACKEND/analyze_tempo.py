import earthaccess  # needed to discover and download TEMPO data
import netCDF4 as nc  # needed to read TEMPO data
import numpy as np
import os  # <-- Added to check for existing files

import matplotlib.pyplot as plt  # needed to plot the resulting time series
import cartopy.crs as ccrs
import cartopy.feature as cfeature
import datetime

# Point of interest: Houston, TX, USA
POI_lat = 29.76
POI_lon = -95.36
str_date = "2024-01-01 00:00:00"
end_date = "2024-01-01 23:59:59"

auth = earthaccess.login(persist=True)

short_name = "TEMPO_NO2_L3"  # collection name to search for in the EarthData
version = "V03"

POI_results = earthaccess.search_data(
    short_name=short_name,
    version=version,
    temporal=(str_date, end_date),
    point=(POI_lon, POI_lat),  # search by point of interest
)

for r in POI_results:
    granule_name = r.data_links()[0].split("/")[-1]
    print(granule_name)

# --- MODIFIED SECTION: CHECKS FOR FILES BEFORE DOWNLOADING ---
granules_to_process = POI_results[8:10]  # The granules we intend to use
granules_to_download = []
local_path = "."  # The local directory to save files

print("\n--- Checking for local files ---")
for granule in granules_to_process:
    # Extract the filename from the data link
    filename = granule.data_links()[0].split("/")[-1]
    # Check if the file already exists in the local path
    if not os.path.exists(os.path.join(local_path, filename)):
        print(f"'{filename}' not found. Queuing for download.")
        granules_to_download.append(granule)
    else:
        print(f"Found local file: '{filename}'. Skipping download.")

# Download only the files that are not found locally
if granules_to_download:
    print(f"\nDownloading {len(granules_to_download)} new file(s)...")
    files = earthaccess.download(granules_to_download, local_path=local_path)
else:
    print("\nAll necessary files are already available locally.")
# --- END MODIFIED SECTION ---

def read_TEMPO_NO2_L3(fn):
    with nc.Dataset(fn) as ds:  # open read access to file
        prod = ds.groups["product"]
        var = prod.variables["vertical_column_stratosphere"]
        strat_NO2_column = var[:]
        fv_strat_NO2 = var.getncattr("_FillValue")
        var = prod.variables["vertical_column_troposphere"]
        trop_NO2_column = var[:]
        fv_trop_NO2 = var.getncattr("_FillValue")
        NO2_unit = var.getncattr("units")
        QF = prod.variables["main_data_quality_flag"][:]
        lat = ds.variables["latitude"][:]
        lon = ds.variables["longitude"][:]
    return lat, lon, strat_NO2_column, fv_strat_NO2, trop_NO2_column, fv_trop_NO2, NO2_unit, QF

# Select the first granule to plot (index 8 from the original search)
granule_name = POI_results[8].data_links()[0].split("/")[-1]
print(f"\nReading data from: {granule_name}")

lat, lon, strat_NO2_column, fv_strat_NO2, trop_NO2_column, fv_trop_NO2, NO2_unit, QF = (
    read_TEMPO_NO2_L3(granule_name)
)

# Define a region of interest.
dlat = 5
dlon = 6
mask_lat = (lat > POI_lat - dlat) & (lat < POI_lat + dlat)
mask_lon = (lon > POI_lon - dlon) & (lon < POI_lon + dlon)

# Subset NO2 column arrays.
trop_NO2_column_loc = trop_NO2_column[0, mask_lat, :][:, mask_lon]
strat_NO2_column_loc = strat_NO2_column[0, mask_lat, :][:, mask_lon]
QF_loc = QF[0, mask_lat, :][:, mask_lon]
best_data_mask_loc = (QF_loc == 0) & (trop_NO2_column_loc > 0.0) & (strat_NO2_column_loc > 0.0)

# Create 2D arrays of latitudes and longitudes
nlat, nlon = trop_NO2_column_loc.shape
lon_loc_2D = np.vstack([lon[mask_lon]] * nlat)
lat_loc_2D = np.column_stack([lat[mask_lat]] * nlon)

# Create a Cartopy projection
proj = ccrs.PlateCarree()
transform = ccrs.PlateCarree()

# Create a figure and axis.
fig, ax = plt.subplots(
    1, 1, figsize=(5, 6), dpi=300, facecolor=None, subplot_kw={"projection": proj}
)

# Add coastlines and U.S. state borders
ax.coastlines(linewidth=0.5)
ax.add_feature(cfeature.STATES, linestyle=":", edgecolor="gray", linewidth=0.5)

im = ax.scatter(
    lon_loc_2D[best_data_mask_loc],
    lat_loc_2D[best_data_mask_loc],
    s=0.1,
    c=trop_NO2_column_loc[best_data_mask_loc] + strat_NO2_column_loc[best_data_mask_loc],
    vmin=0,
    vmax=5.0e16,
    transform=transform,
)

# Adjusted map extent to focus on the Houston area
ax.set_extent([-97, -93, 28, 32], crs=transform)

cb = plt.colorbar(
    im,
    ticks=[0, 1.0e16, 2.0e16, 3.0e16, 4.0e16, 5.0e16],
    location="bottom",
    fraction=0.05,
    pad=0.05,
)
cb.set_label("total NO2 col, " + NO2_unit, fontsize=10)

plt.show()
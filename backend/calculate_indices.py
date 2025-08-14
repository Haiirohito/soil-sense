import ee
import sys
import json
import os
import logging

# Logging configuration
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Load environment variables
EE_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
GEE_PROJECT_ID = os.getenv("GEE_PROJECT_ID")

if not EE_CREDENTIALS or not GEE_PROJECT_ID:
    raise ValueError(
        "Missing GOOGLE_APPLICATION_CREDENTIALS or GEE_PROJECT_ID environment variables."
    )

# Initialize Earth Engine
try:
    credentials = ee.ServiceAccountCredentials(None, EE_CREDENTIALS)
    ee.Initialize(credentials, project=GEE_PROJECT_ID)
    logging.info("Google Earth Engine authenticated successfully!")
except ee.EEException as e:
    raise RuntimeError(f"Google Earth Engine authentication failed: {e}")


def calculate_indices(geometry, year):
    # Define date range for the year
    start_date = f"{year}-01-01"
    end_date = f"{year}-12-31"

    aoi = ee.Geometry(geometry["geometry"])

    # Sentinel-2 for indices
    s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR")
        .filterDate(start_date, end_date)
        .filterBounds(aoi)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .select(["B2", "B3", "B4", "B8", "B11", "B12"])
        .median()
        .clip(aoi)
    )

    # Landsat-8 for LST
    l8 = (  # noqa: F841
        ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
        .filterDate(start_date, end_date)
        .filterBounds(aoi)
        .median()
        .clip(aoi)
    )

    # Vegetation and water indices
    ndvi = s2.normalizedDifference(["B8", "B4"]).rename("NDVI")
    ndmi = s2.normalizedDifference(["B8", "B11"]).rename("NDMI")
    ndsi = s2.normalizedDifference(["B3", "B11"]).rename("NDSI")
    gci = s2.expression(
        "(NIR / GREEN) - 1", {"NIR": s2.select("B8"), "GREEN": s2.select("B3")}
    ).rename("GCI")
    evi = s2.expression(
        "2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))",
        {"NIR": s2.select("B8"), "RED": s2.select("B4"), "BLUE": s2.select("B2")},
    ).rename("EVI")
    awei = s2.expression(
        "4 * (GREEN - SWIR1) - (0.25 * NIR + 2.75 * SWIR2)",
        {
            "GREEN": s2.select("B3"),
            "SWIR1": s2.select("B11"),
            "NIR": s2.select("B8"),
            "SWIR2": s2.select("B12"),
        },
    ).rename("AWEI")

    # Calculate means
    stats = {
        "NDVI": ndvi.reduceRegion(ee.Reducer.mean(), aoi, 10).get("NDVI"),
        "NDMI": ndmi.reduceRegion(ee.Reducer.mean(), aoi, 10).get("NDMI"),
        "NDSI": ndsi.reduceRegion(ee.Reducer.mean(), aoi, 10).get("NDSI"),
        "GCI": gci.reduceRegion(ee.Reducer.mean(), aoi, 10).get("GCI"),
        "EVI": evi.reduceRegion(ee.Reducer.mean(), aoi, 10).get("EVI"),
        "AWEI": awei.reduceRegion(ee.Reducer.mean(), aoi, 10).get("AWEI"),
    }

    return stats


def main():
    try:
        request = json.loads(sys.argv[1])
        geometry = request["geometry"][0]  # assuming only one shape
        years = request.get("years", [])

        results = {}

        for year in years:
            index_values = calculate_indices(geometry, year)
            values = ee.Dictionary(index_values).getInfo()
            results[year] = values

        # ✅ Print only once at the end
        print(json.dumps(results))

    except Exception as e:
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    main()

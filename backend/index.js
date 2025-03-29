require('dotenv').config();
const express = require('express');
const ee = require('@google/earthengine');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('fast-csv');
const app = express();
const port = process.env.PORT || 5000; 

// Create directories for storing data
const dataDir = path.join(__dirname, 'river_data');
const imagesDir = path.join(dataDir, 'images');
const csvDir = path.join(dataDir, 'csv');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir);

// Initialize Earth Engine
ee.data.authenticateViaPrivateKey(
  require(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  () => {
    ee.initialize();
    console.log('Earth Engine initialized');
  },
  (err) => {
    console.error('Authentication error:', err);
  }
);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Helper function to download an image from URL
async function downloadImage(url, filepath) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });
  
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Function to get dates with 3-month intervals between start and end dates
function getDateIntervalsThreeMonths(startDate, endDate) {
  const intervals = [];
  let currentStart = new Date(startDate);
  
  while (currentStart < new Date(endDate)) {
    const intervalStart = new Date(currentStart);
    const intervalEnd = new Date(currentStart);
    intervalEnd.setMonth(intervalEnd.getMonth() + 3);
    
    // Ensure we don't go past the end date
    if (intervalEnd > new Date(endDate)) {
      intervals.push({
        start: intervalStart.toISOString().split('T')[0],
        end: endDate
      });
    } else {
      intervals.push({
        start: intervalStart.toISOString().split('T')[0],
        end: intervalEnd.toISOString().split('T')[0]
      });
    }
    
    // Move to next interval
    currentStart = new Date(intervalEnd);
  }
  
  return intervals;
}

// Function to fetch climate data from Earth Engine for a specific date
async function getClimateData(geometry, date) {
  try {
    // ERA5 climate reanalysis dataset for temperature, precipitation, etc.
    const era5 = ee.ImageCollection('ECMWF/ERA5/DAILY')
      .filterDate(date, ee.Date(date).advance(1, 'day'))
      .first();
    
    // Water-related index from GLDAS
    const gldas = ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H')
      .filterDate(date, ee.Date(date).advance(1, 'day'))
      .first();
    
    // Extract climate variables for the location from ERA5
    const climateMeans = era5.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: 30000, // ERA5 resolution is ~30km
      maxPixels: 1e9
    });
    
    // Extract hydrological variables from GLDAS
    const hydroMeans = gldas.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: 25000, // GLDAS resolution is 0.25 degrees
      maxPixels: 1e9
    });
    
    // Get the computed values
    const climateData = await climateMeans.getInfo();
    const hydroData = await hydroMeans.getInfo();
    
    return {
      mean_2m_air_temperature: climateData.mean_2m_air_temperature - 273.15, // Convert K to °C
      max_2m_air_temperature: climateData.maximum_2m_air_temperature - 273.15, // Convert K to °C
      min_2m_air_temperature: climateData.minimum_2m_air_temperature - 273.15, // Convert K to °C
      total_precipitation: climateData.total_precipitation * 1000, // Convert m to mm
      surface_pressure: climateData.surface_pressure / 100, // Convert Pa to hPa
      soil_moisture: hydroData.SoilMoi0_10cm_inst, // Top layer soil moisture
      runoff: hydroData.Qs_acc, // Surface runoff
      water_table_depth: hydroData.CanopInt_inst // Canopy water content as proxy for water presence
    };
  } catch (error) {
    console.error('Error fetching climate data:', error);
    return {
      mean_2m_air_temperature: null,
      max_2m_air_temperature: null,
      min_2m_air_temperature: null,
      total_precipitation: null,
      surface_pressure: null,
      soil_moisture: null,
      runoff: null,
      water_table_depth: null
    };
  }
}

// Calculate water indices and statistics from an image
async function calculateWaterStats(geometry, date) {
  try {
    // Use an alternative water-related dataset (e.g., MODIS Water Occurrence)
    const waterDataset = ee.ImageCollection('MODIS/006/MOD44W')
      .filterDate(ee.Date(date).advance(-3, 'day'), ee.Date(date).advance(3, 'day')) // Search ±3 days
      .filterBounds(geometry)
      .first();

    if (!waterDataset) {
      throw new Error("No water data available for the given date and location.");
    }

    // Compute statistics on the water dataset
    const waterStats = waterDataset.reduceRegion({
      reducer: ee.Reducer.mean()
        .combine(ee.Reducer.stdDev(), null, true)
        .combine(ee.Reducer.minMax(), null, true),
      geometry: geometry,
      scale: 250, // MODIS resolution (250m)
      maxPixels: 1e9
    });

    const statsInfo = await waterStats.getInfo();

    return {
      water_mean: statsInfo['water_mean'],
      water_stdDev: statsInfo['water_stdDev'],
      water_min: statsInfo['water_min'],
      water_max: statsInfo['water_max']
    };
  } catch (error) {
    console.error("Error calculating water statistics:", error);
    return {
      water_mean: null,
      water_stdDev: null,
      water_min: null,
      water_max: null
    };
  }
}


app.get('/api/water-body-imagery', async (req, res) => {
  try {
    const { coordinates, startDate, endDate } = req.query;
    
    // Parse coordinates
    const parsedCoordinates = JSON.parse(coordinates);
    
    // Create geometry
    const geometry = ee.Geometry.Polygon([parsedCoordinates]);
    
    // Expand date range if no images found
    const dateRanges = [
      { 
        start: startDate || '2024-03-01', 
        end: endDate || new Date().toISOString().split('T')[0] 
      },
      { 
        start: '2023-01-01', 
        end: '2024-03-31' 
      },
      { 
        start: '2022-01-01', 
        end: '2024-12-31' 
      }
    ];
    
    // Array of different satellite imagery collections to explore
    const imageCollections = [
      {
        name: 'LANDSAT/LC08/C02/T1_L2',  // Landsat 8 Surface Reflectance
        cloudFilter: ee.Filter.lt('CLOUD_COVER', 20),
        visualizationParams: {
          bands: ['SR_B4', 'SR_B3', 'SR_B2'],
          min: 0,
          max: 30000
        },
        waterIndexBands: ['SR_B3', 'SR_B5']
      },
      {
        name: 'COPERNICUS/S2_SR',  // Sentinel-2 Surface Reflectance
        cloudFilter: ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20),
        visualizationParams: {
          bands: ['B4', 'B3', 'B2'],
          min: 0,
          max: 3000
        },
        waterIndexBands: ['B3', 'B11']
      },
      {
        name: 'MODIS/006/MOD09GA',  // MODIS Terra Surface Reflectance
        cloudFilter: ee.Filter.lt('state_1km', 20),
        visualizationParams: {
          bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
          min: 0,
          max: 5000
        },
        waterIndexBands: ['sur_refl_b02', 'sur_refl_b06']
      }
    ];
    
    // Results array to store imagery
    const results = [];
    
    // Iterate through date ranges
    for (const dateRange of dateRanges) {
      // Iterate through image collections
      for (const collection of imageCollections) {
        try {
          // Create image collection with filters
          const filteredCollection = ee.ImageCollection(collection.name)
            .filterBounds(geometry)
            .filterDate(dateRange.start, dateRange.end)
            .filter(collection.cloudFilter)
            .sort('system:time_start', false);  // Most recent first
          
          // Count images
          const imageCount = await filteredCollection.size().getInfo();
          
          // Skip if no images
          if (imageCount === 0) continue;
          
          // Select the first (most recent) image
          const image = filteredCollection.first();
          
          // Calculate Water Index (NDWI - Normalized Difference Water Index)
          const ndwi = image.normalizedDifference(collection.waterIndexBands).rename('NDWI');
          
          // Enhanced image with water index
          const enhancedImage = image.addBands(ndwi).clip(geometry);
          
          // Generate URLs
          const naturalUrl = await image.getThumbURL({
            ...collection.visualizationParams,
            region: geometry,
            scale: 30,
            format: 'png',
            maxPixels: 1e8
          });
          
          const waterIndexUrl = await enhancedImage.getThumbURL({
            bands: ['NDWI'],
            min: -1,
            max: 1,
            palette: ['#0000ff', '#ffffff', '#00ff00'],
            region: geometry,
            scale: 30,
            format: 'png',
            maxPixels: 1e8
          });
          
          // Get image metadata
          const imageMetadata = await image.getInfo();
          
          // Add to results
          results.push({
            datasetName: collection.name,
            naturalImageUrl: naturalUrl,
            waterIndexImageUrl: waterIndexUrl,
            imageCount: imageCount,
            dateRange: dateRange,
            mostRecentImageDate: imageMetadata.properties.system_time_start 
              ? new Date(imageMetadata.properties.system_time_start).toISOString()
              : null,
            cloudCoverPercentage: imageMetadata.properties.CLOUD_COVER || 
                                   imageMetadata.properties.CLOUDY_PIXEL_PERCENTAGE
          });
        } catch (collectionError) {
          console.error(`Error processing ${collection.name}:`, collectionError);
        }
        
        // Break if we found images
        if (results.length > 0) break;
      }
      
      // Break if we found images
      if (results.length > 0) break;
    }
    
    // Respond with results
    if (results.length > 0) {
      res.json({
        totalDatasets: results.length,
        datasets: results
      });
    } else {
      res.status(404).json({
        message: 'No water body imagery found after multiple attempts',
        attemptedDateRanges: dateRanges.map(range => `${range.start} to ${range.end}`)
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch water body imagery', 
      details: error.message 
    });
  }
});
// New endpoint to collect and store data for multiple time intervals
app.get('/api/collect-river-data', async (req, res) => {
  try {
    // Hard-coded coordinates for Varanasi area of Ganges River
    const coordinates =[[76.05, 31.95], [76.05, 32.05], [76.15, 32.05], [76.15, 31.95], [76.05, 31.95]];

    // Define the start and end dates for collecting data
    const startDate = '2019-02-01';
    // const endDate = '2025-02-15';
    const endDate='2019-06-30';

    // Generate 15-day intervals
    const intervals = getDateIntervalsFifteenDays(startDate, endDate);
    console.log(`Processing ${intervals.length} intervals from ${startDate} to ${endDate}`);

    // Create a CSV file for storing all data
    const timestamp = new Date().getTime();
    const csvFilePath = path.join(csvDir, `ganges_large_data_${timestamp}.csv`);
    const csvHeaders = [
      'interval_start', 'interval_end',
      'image_date', 'natural_image_url',
      'mean_temperature', 'max_temperature', 'min_temperature',
      'precipitation', 'pressure', 'soil_moisture', 'runoff',
      'ndwi_mean', 'ndwi_min', 'ndwi_max', 'mndwi_mean', 'mndwi_min', 'mndwi_max'
    ];

    const writableStream = fs.createWriteStream(csvFilePath);
    const csvStream = csv.format({ headers: csvHeaders });
    csvStream.pipe(writableStream);

    // Process each 15-day interval
    const results = [];
    const geometry = ee.Geometry.Polygon([coordinates]);

    for (const interval of intervals) {
      try {
        console.log(`Processing interval: ${interval.start} to ${interval.end}`);

        // Get Sentinel-2 imagery for this interval
        const collection = ee.ImageCollection('COPERNICUS/S2_SR')
          .filterDate(interval.start, interval.end)
          .filterBounds(geometry)
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
          .sort('CLOUDY_PIXEL_PERCENTAGE');

        const count = collection.size().getInfo();
        if (count === 0) {
          console.log(`No images found for interval ${interval.start} to ${interval.end}`);
          results.push({
            interval: interval,
            success: false,
            message: 'No images found for this interval'
          });
          continue;
        }

        // Get the best image
        const image = collection.first();
        const imageDate = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd').getInfo();

        // Fetch climate data
        const climateData = await getTempClimateData(geometry, imageDate);

        // Fetch water indices
        const waterIndices = await calculateWaterIndices(image, geometry);

        // Generate natural image URL
        const naturalVis = { bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.3 };
        const naturalUrl = await image.getThumbURL({
          ...naturalVis,
          region: geometry,
          scale: 10,
          format: 'png'
        });

        // Write complete data to CSV
        csvStream.write({
          interval_start: interval.start,
          interval_end: interval.end,
          image_date: imageDate,
          natural_image_url: naturalUrl,
          mean_temperature: climateData.mean_2m_air_temperature || 0,
          max_temperature: climateData.max_2m_air_temperature || 0,
          min_temperature: climateData.min_2m_air_temperature || 0,
          precipitation: climateData.total_precipitation || 0,
          pressure: climateData.surface_pressure || 0,
          soil_moisture: climateData.soil_moisture || 0,
          runoff: climateData.runoff || 0,
          ndwi_mean: waterIndices.ndwi_mean || 0,
          ndwi_min: waterIndices.ndwi_min || 0,
          ndwi_max: waterIndices.ndwi_max || 0,
          mndwi_mean: waterIndices.mndwi_mean || 0,
          mndwi_min: waterIndices.mndwi_min || 0,
          mndwi_max: waterIndices.mndwi_max || 0
        });

        results.push({
          interval: interval,
          success: true,
          imageDate: imageDate,
          naturalImageUrl: naturalUrl
        });

        console.log(`Successfully processed data for ${imageDate}`);

      } catch (intervalError) {
        console.error(`Error processing interval ${interval.start} to ${interval.end}:`, intervalError);
        results.push({
          interval: interval,
          success: false,
          error: intervalError.message
        });
      }
    }

    csvStream.end();

    res.json({
      success: true,
      message: `Processed ${results.length} intervals`,
      csvFilePath: csvFilePath,
      results: results
    });

  } catch (error) {
    console.error('Error in collect-river-data:', error);
    res.status(500).json({ error: 'Failed to collect river data', details: error.message });
  }
});

function getDateIntervalsFifteenDays(startDate, endDate) {
  const intervals = [];
  let currentDate = new Date(startDate);
  const finalDate = new Date(endDate);

  while (currentDate <= finalDate) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 15); // Add 15 days

    intervals.push({
      start: currentDate.toISOString().split('T')[0],
      end: nextDate.toISOString().split('T')[0]
    });

    currentDate = new Date(nextDate); // Move to next 15-day interval
  }

  return intervals;
}



async function getTempClimateData(geometry, date) {
  try {
    // Extend the date range to avoid missing data issues
    const startDate = ee.Date(date).advance(-1, 'day'); 
    const endDate = ee.Date(date).advance(1, 'day');

    const climateCollection = ee.ImageCollection('ECMWF/ERA5_LAND/HOURLY')
      .filterDate(startDate, endDate)
      .filterBounds(geometry);

    // Check if the collection has data
    const count = climateCollection.size().getInfo();
    if (count === 0) {
      console.warn('No climate data available for the specified date and location.');
      return null;
    }

    // Compute mean values from the available images
    const climateImage = climateCollection.mean();
    const climateData = climateImage.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: 1000,
      bestEffort: true
    });

    const data = climateData.getInfo();
    return {
      mean_2m_air_temperature: data['temperature_2m'] || 0,
      max_2m_air_temperature: data['temperature_2m_max'] || 0,
      min_2m_air_temperature: data['temperature_2m_min'] || 0,
      total_precipitation: data['total_precipitation'] || 0,
      surface_pressure: data['surface_pressure'] || 0,
      soil_moisture: data['volumetric_soil_water_layer_1'] || 0,
      runoff: data['surface_runoff'] || 0
    };
  } catch (error) {
    console.error('Error fetching climate data:', error);
    throw new Error('Failed to fetch climate data');
  }
}
app.get('/api/fetch-climate-data', async (req, res) => {
  try {
    const { lat, lon, date } = req.query;
    if (!lat || !lon || !date) {
      return res.status(400).json({ error: 'Missing required parameters: lat, lon, date' });
    }

    const geometry = ee.Geometry.Point([parseFloat(lon), parseFloat(lat)]);
    const climateData = await getTempClimateData(geometry, date);

    res.json({ success: true, climateData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch climate data', details: error.message });
  }
});

app.get('/api/river-imagery', async (req, res) => {
  try {
    const { coordinates, startDate, endDate } = req.query;
    
    // Ensure coordinates are correctly formatted as a polygon
    const geometry = ee.Geometry.Polygon([JSON.parse(coordinates)]);
    
    // Sentinel-2 imagery
    const collection = ee.ImageCollection('COPERNICUS/S2_SR')
      .filterDate(startDate || '2023-01-01', endDate || '2023-12-31')
      .filterBounds(geometry)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
      .sort('CLOUDY_PIXEL_PERCENTAGE');
    
    // Select the best image
    const image = collection.mosaic(); // Merge multiple images
    const mndwi = image.normalizedDifference(['B3', 'B11']).rename('MNDWI');
    const enhancedImage = image.addBands(mndwi).clip(geometry);  // Clip to remove white padding
    
    // Visualization parameters
    const mndwiVis = {
      bands: ['MNDWI'],
      min: -0.5,
      max: 0.5,
      palette: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']
    };
    
    const naturalVis = {
      bands: ['B4', 'B3', 'B2'],
      min: 0,
      max: 3000,
      gamma: 1.3
    };
    
    // Use scale instead of dimensions for better precision
    const scale = 1; // 10m per pixel
    
    // Generate high-resolution image URLs
    const url = await enhancedImage.getThumbURL({
      ...mndwiVis,
      region: geometry,
      scale: 50,
      format: 'png',
      maxPixels: 10e8
    });
    
    const naturalUrl = await image.getThumbURL({
      ...naturalVis,
      region: geometry,
      scale: scale,
      format: 'png'
    });
    
    res.json({
      mndwiImageUrl: url,
      naturalImageUrl: naturalUrl,
      scale: scale
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch imagery' });
  }
});

const latitude = 21 + 14 / 60 + 43.09 / 3600; // 21°14'43.09"N ≈ 21.245303°
const longitude = 79 + 5 / 60 + 27.65 / 3600; // 79°5'27.65"E ≈ 79.091014°
function dmsToDecimal(dms) {
  const regex = /([0-9]+)\D+([0-9]+)\D+([0-9.]+)\D*([NSEW])/;
  const [, degrees, minutes, seconds, direction] = dms.match(regex).map((val, i) => (i > 0 ? parseFloat(val) : val));
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') decimal *= -1;
  return decimal;
}

// Define API route
const OPEN_METEO_API = "https://archive-api.open-meteo.com/v1/archive";
app.get("/water-history", async (req, res) => {
  try {
      const { latitude, longitude, start_date, end_date } = req.query;

      if (!latitude || !longitude || !start_date || !end_date) {
          return res.status(400).json({ error: "Missing required parameters: latitude, longitude, start_date, or end_date" });
      }

      // Construct Open-Meteo API URL
      const apiUrl = `${OPEN_METEO_API}?latitude=${latitude}&longitude=${longitude}&start_date=${start_date}&end_date=${end_date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,pressure_msl_mean,rain_sum,soil_moisture_0_to_10cm_mean&timezone=auto`;

      // Fetch Data from Open-Meteo API
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.daily) {
          return res.status(500).json({ error: "No daily data available from Open-Meteo" });
      }

      const dailyData = data.daily;
      const meanValues = {};

      // Calculate mean values for each parameter
      for (const parameter in dailyData) {
          if (parameter !== 'time') { // Exclude 'time' from calculations
              const values = dailyData[parameter];
              const sum = values.reduce((acc, val) => acc + val, 0);
              meanValues[parameter] = sum / values.length;
          }
      }

      res.json({
          location: { latitude, longitude },
          start_date,
          end_date,
          meanWeatherData: meanValues,
      });
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
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
async function calculateWaterIndices(image, geometry) {
  try {
    // Calculate NDWI (Normalized Difference Water Index)
    const ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
    
    // Calculate MNDWI (Modified Normalized Difference Water Index)
    const mndwi = image.normalizedDifference(['B3', 'B11']).rename('MNDWI');
    
    // Add the indices to the image
    const enhancedImage = image.addBands(ndwi).addBands(mndwi);
    
    // Calculate statistics for the water indices
    const waterStats = enhancedImage.reduceRegion({
      reducer: ee.Reducer.mean()
        .combine(ee.Reducer.stdDev(), null, true)
        .combine(ee.Reducer.minMax(), null, true),
      geometry: geometry,
      scale: 10, // Sentinel-2 resolution
      maxPixels: 1e9
    });
    
    const statsInfo = await waterStats.getInfo();
    
    return {
      ndwi_mean: statsInfo['NDWI_mean'],
      ndwi_stdDev: statsInfo['NDWI_stdDev'],
      ndwi_min: statsInfo['NDWI_min'],
      ndwi_max: statsInfo['NDWI_max'],
      mndwi_mean: statsInfo['MNDWI_mean'],
      mndwi_stdDev: statsInfo['MNDWI_stdDev'],
      mndwi_min: statsInfo['MNDWI_min'],
      mndwi_max: statsInfo['MNDWI_max']
    };
  } catch (error) {
    console.error('Error calculating water indices:', error);
    return {
      ndwi_mean: null, ndwi_stdDev: null, ndwi_min: null, ndwi_max: null,
      mndwi_mean: null, mndwi_stdDev: null, mndwi_min: null, mndwi_max: null
    };
  }
}

// API endpoint to fetch river imagery
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
    const scale = 10; // 10m per pixel
    
    // Generate high-resolution image URLs
    const url = await enhancedImage.getThumbURL({
      ...mndwiVis,
      region: geometry,
      scale: 10,
      format: 'png',
      maxPixels: 1e8
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

// New endpoint to collect and store data for multiple time intervals
app.get('/api/collect-river-data', async (req, res) => {
  try {
    // Hard-coded coordinates for Varanasi area of Ganges River
    const coordinates = [[83.00, 25.20], [83.00, 25.40], [83.30, 25.40], [83.30, 25.20]];

    // Time range to analyze (can be modified as needed)
    const startDate = req.query.startDate || '2020-01-01';
    const endDate = req.query.endDate || '2023-12-31';

    // Get 3-month intervals
    const intervals = getDateIntervalsThreeMonths(startDate, endDate);
    console.log(`Processing ${intervals.length} intervals from ${startDate} to ${endDate}`);

    // Create a CSV file for storing all data
    const timestamp = new Date().getTime();
    const csvFilePath = path.join(csvDir, `ganges_data_${timestamp}.csv`);
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

    // Process each interval
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
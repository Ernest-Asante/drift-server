// routes/getFirstName.js

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

const calculateNearestDistance = async (teshieCoordinates) => {
    try {
      // Query to find nearest distance using PostGIS functions
      const { data, error } = await supabase
        .from('driver')
        .select('name', 'location') 
        .order('location <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)', [teshieCoordinates.longitude, teshieCoordinates.latitude])
        .limit(1);
  
      if (error) {
        throw error;
      }
  
      return data; // Return the nearest location data
    } catch (error) {
      throw error;
    }
  };

router.post('/', async(req, res) => {

    try {
        // Assuming teshieCoordinates contains the longitude and latitude of Teshie
        const teshieCoordinates = { longitude: -0.0708, latitude: 5.5792 };
    
        // Calculate nearest distance dynamically
        const nearestLocation = await calculateNearestDistance(teshieCoordinates);
    
        // Respond with the nearest location data
        res.status(200).json({ nearestLocation });
    
      } catch (error) {
        console.error('Error fetching nearest distance:', error.message);
        res.status(500).json({ error: 'Error fetching nearest distance' });
      }
});

module.exports = router;

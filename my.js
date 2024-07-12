// routes/getFirstName.js

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

const calculateNearestDistance = async (teshieCoordinates) => {
  try {
    // Call the get_nearest_driver function via RPC
    const { data, error } = await supabase
      .rpc('get_nearest_driver', {
        lon: teshieCoordinates.longitude,
        lat: teshieCoordinates.latitude
      });

    if (error) {
      throw error;
    }

    return data; // Return the nearest location data
  } catch (error) {
    throw error;
  }
};

const updateUserRidePayload = async (userId, updatedPayload) => {
  try {
    // Update the ride_payload for the given user ID
    const { data, error } = await supabase
      .from('rider')
      .update({ ride_payload: updatedPayload })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return data; // Return the updated user data
  } catch (error) {
    throw error;
  }
};
 
router.post('/', async(req, res) => { 
  
  const {userId} = req.body; 
  try { 
    // Assuming teshieCoordinates contains the longitude and latitude of Teshie
    const teshieCoordinates = { longitude:-1.3501, latitude:5.0843};

    // Calculate nearest distance dynamically 
    const nearestLocation = await calculateNearestDistance(teshieCoordinates);

     // Define location percentage values
     const locationPercentages = [70, 60, 50, 40, 30];  

     // Add location percentage to driver rating and store results
     const results = nearestLocation.map((location, index) => {
       const finalRating = location.driver_rating + locationPercentages[index];
       return { 
      //   ...location, // Include original location details
        // location_percentage: locationPercentages[index], // Add location percentage
       //  final_rating: finalRating 
         
         driver_id: location.driver_id,
         driver_name: location.driver_name,
         final_rating: finalRating// Calculate and add final rating
       };
     });

     results.sort((a, b) => b.final_rating - a.final_rating);
     console.log(results)

     const highestRatedDriver = results[0];
     console.log(highestRatedDriver)

       // Create a payload to be sent to the user
    const payload = {
      nearest_drivers: results.map(driver => ({
        driver_id: driver.driver_id,
        driver_name: driver.driver_name,
        final_rating: driver.final_rating
      }))
    }; 

     const updatedPayload = await updateUserRidePayload(userId, payload);
    // console.log(results)
 
    // Respond with the nearest location data
    res.status(200).json({highest:highestRatedDriver, result: results});
  
  } catch (error) {
    console.error('Error fetching nearest distance:', error.message);
    res.status(500).json({ error: 'Error fetching nearest distance' });
  }

});

module.exports = router;

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { userId, driverId } = req.body;

  try {
    const { data, error } = await supabase
      .from('driver')
      .update({ ride_request: null})
      .eq('id', driverId);

    if (error) {
      console.error('Error updating data:', error.message);
      return res.status(500).send({ "error": 'Failed to update' });
    }

    console.log('Data updated successfully, request underway:', data);


  //  res.status(200).send({ "message": "Request underway" });


 
  try {
    // Fetch current rides
    const { data, error } = await supabase
      .from('rider')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error;

    console.log(data)

    const drivers = data.ride_payload.nearest_drivers;
    console.log(drivers)

    // Remove the rejecting driver from the list
    const updatedDrivers = drivers.filter(driver => driver.driver_id !== driverId);
    console.log(updatedDrivers)

    // Update the rides table with the new drivers list
    const { error: updateError } = await supabase
      .from('rider')
      .update({ ride_payload:{nearest_drivers : updatedDrivers }})
      .eq('id', userId);

    if (updateError) throw updateError;

    // Notify the next driver 
    if (updatedDrivers.length > 0) {
      const nextDriver = updatedDrivers[0];
    //  notifyDriver(nextDriver);
    console.log(nextDriver)

    const nextDriverId = nextDriver.driver_id
    console.log(nextDriverId)

    const payload = {
   
        userId: userId,
        driverId: nextDriverId,
        fare: 50,
        from: data.ride_payload.from,
        to: data.ride_payload.to,
        fromLat: data.ride_info.fromLat,
        fromLong:data.ride_info.fromLat ,
        toLat: data.ride_info.fromLat,
        toLong: data.ride_info.fromLat,

      // tripId: 0,
      
      }

    try {
        const { data, error } = await supabase
          .from('driver')
          .update({ ride_request: payload, request:true})
          .eq('id', nextDriverId);
  
        if (error) {
          console.error('Error updating data:', error.message);
          return res.status(500).send({ "error": 'Failed to update' });
        }
  
        console.log('Data updated successfully, request underway:', data);
  
  
        res.status(200).send({ "message": "Request underway" });
      } catch (error) {
        res.status(500).send({ "error": 'Failed to initiate request' });
      }
    
    }

   // res.status(200).json({ message: 'Driver rejected, next driver notified' });
  } catch (error) {
    console.error('Error handling rejection:', error.message);
    res.status(500).json({ error: 'Error handling rejection' });
  }
} catch (error) {
    res.status(500).send({ "error": 'Failed to initiate request' });
  }
 
});

module.exports = router;

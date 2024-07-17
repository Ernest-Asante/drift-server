const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Infobip, AuthType } = require('@infobip-api/sdk');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);


// Function to send OTP email

// Define the /verifyotp route
router.post('/', async (req, res) => {
  const { userId, driverId, fare, from, fromLat, toLat, fromLong,toLong, to} = req.body;
  
 
  const payload = {
   
      riderId: userId,
      driverId: driverId,
      fare: fare,
      from: from,
      to: to,
      fromLat: fromLat,
      fromLong:fromLong ,
      toLat: toLat,
      toLong: toLong,

      
    }

    const payload2 = {
   
      riderId: userId,
     // driverId: driverId,
      fare: fare,
      from: from,
      to: to,
      fromLat: fromLat,
      fromLong:fromLong ,
      toLat: toLat,
      toLong: toLong,

      
    }
  
  
    try {
      const { data, error } = await supabase
        .from('driver')
        .update({ ride_request: payload, request: true})
        .eq('id', driverId);

      if (error) {
        console.error('Error updating data:', error.message);
        return res.status(500).send({ "error": 'Failed to update' });
      }

      console.log('Data updated successfully, request underway:', data);

      try {
        const { data, error } = await supabase
          .from('rider')
          .update({ ride_info: payload2})
          .eq('id', userId);
  
        if (error) {
          console.error('Error updating data:', error.message);
          return res.status(500).send({ "error": 'Failed to update' });
        }
  
        console.log('Data updated successfully, request underway:', data);
  
  
        res.status(200).send({ "message": "Request underway" });
      } catch (error) {
        res.status(500).send({ "error": 'Failed to initiate request' });
      }


      //res.status(200).send({ "message": "Request underway" });
    } catch (error) {
      res.status(500).send({ "error": 'Failed to initiate request' });
    }
  
});

module.exports = router;

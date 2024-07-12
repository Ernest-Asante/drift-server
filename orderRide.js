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
  const { userId, driverId, fare, from, to, tripId } = req.body;
  
  const payload = {
   
      riderId: userId,
      driverId: driverId,
      fare: fare,
      from: from,
      to: to,
      tripId: tripId,
    }
  
    try {
      const { data, error } = await supabase
        .from('driver')
        .update({ ride_request: payload})
        .eq('id', driverId);

      if (error) {
        console.error('Error updating data:', error.message);
        return res.status(500).send({ "error": 'Failed to update' });
      }

      console.log('Data updated successfully, request underway:', data);


      res.status(200).send({ "message": "Request underway" });
    } catch (error) {
      res.status(500).send({ "error": 'Failed to initiate request' });
    }
  
});

module.exports = router;

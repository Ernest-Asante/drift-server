// routes/getFirstName.js

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { identity, carName, carModel, registrationId, colour, license, roadworthy} = req.body;

  try {
    const {data: insertData, error: insertError } = await supabase
      .from('driver')
      .update({car_name: carName, car_plate: registrationId, car_model: carModel, car_colour: colour, car_included: true, license: license, road_worthy: roadworthy })
      .eq(identity.includes('@') ? 'email' : 'phone', identity)
      
     
      if (insertError) {
        console.error('Error inserting data:', insertError.message);
        return  res.status(400).json({ message: 'Error inserting data' });
        // You might not need to send another response here, as it will cause the headers sent error.
      } else {
        console.log('Data inserted successfully:', insertData);
        return  res.status(200).json({ message: 'Data inserted successfully' }); 
        // Again, avoid sending another response here.
      }
   
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

module.exports = router;

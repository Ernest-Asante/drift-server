// routes/getFirstName.js

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { name, longitude, latitude ,riderId} = req.body;  
 
  try {
    const { data, error } = await supabase 
      .from('rider')
      .update([{ location: `POINT(${longitude} ${latitude})`, name: name }])
      .eq('id', riderId)
 

    if (error) { 
      console.error('Error adding:', error.message);  
      return res.status(500).json({ error: 'Error adding'});   
    } else{ 

   

    res.status(200).json({message: 'added'}); 
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

module.exports = router;

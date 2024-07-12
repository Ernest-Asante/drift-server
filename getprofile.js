// routes/getFirstName.js

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { identity, key} = req.body;

  try {
    const {data: insertData, error: insertError } = await supabase
      .from('rider')
      .select('*')
      .eq(key.includes('@') ? 'email' : 'phone', key)
      .order('created_at', { ascending: false })
      .limit(1);
     
      if (insertError) {
        console.error('Error getting data:', insertError.message);
        return  res.status(400).json({ message: 'Error getting data' });
        // You might not need to send another response here, as it will cause the headers sent error.
      } else {
        console.log('data available:', insertData);
        return  res.status(200).json({ message: 'Data available successfully', firstName: insertData[0].first_name, data:insertData }); 
        // Again, avoid sending another response here.
      }
   
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

module.exports = router;

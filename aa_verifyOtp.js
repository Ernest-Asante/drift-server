const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { email, otp} = req.body;


 

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching data:', error.message);
      return res.status(500).json({ error: 'error fetching data' });
    }

    if (data.length === 0) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const otpRecord = data[0];
    const currentTime = new Date();
    const otpTime = new Date(otpRecord.created_at);
    const timeDifference = (currentTime - otpTime) / 1000; // Difference in seconds

    if (timeDifference > 60) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    
    res.status(200).json({ message: 'OTP verified successfully' });

    // Add profile to the database 
   
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' }); 
  }
});

module.exports = router;

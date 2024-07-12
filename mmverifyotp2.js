const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { identity, otp, contact, firstName, lastName } = req.body;
  console.log(firstName)

  const isEmail = contact.includes('@')
  const userColumn = isEmail ? 'email' : 'phone';
 const identityColumn = isEmail ? 'phone' : 'email';

  try {
    const { data, error } = await supabase
      .from('rider')
      .select('*')
      .eq(identityColumn, identity)
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

    // OTP is valid
    //res.status(200).json({ message: 'OTP verified successfully' });

    // Add profile to the database
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('rider')
        .update({ [userColumn]: contact, first_name: firstName, last_name: lastName, verified: true, [`${userColumn}_verify`]: true })
        .eq(identityColumn, identity);

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
      console.error('Unexpected error during insert:', error);
      return  res.status(200).json({ message: 'Unexpected error during insert' }); 
      // Avoid sending another response here.
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
});

module.exports = router;

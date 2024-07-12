const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { identity, otp } = req.body;

  const handleVerification = async (identityKey, identityValue) => {
    try {
      const { data, error } = await supabase
        .from('rider')
        .select('*')
        .eq(identityKey, identityValue)
        .eq('otp', otp)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).json({ error: 'Error fetching data' });
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

     // res.status(200).json({message: 'OTP verification successful'})

      const panic = otpRecord.panic_included;
      const verified = otpRecord.verified;
      const email_verify = otpRecord.email_verify
      const phone_verify = otpRecord.phone_verify

      const isEmail = identity.includes('@')
      const userColumn = isEmail ? 'email' : 'phone';
     const identityColumn = isEmail ? 'phone' : 'email';
    

      if(identity.includes('@') && !email_verify){
        try {
            const { data, error } = await supabase
              .from('rider')
              .update({ email_verify: true, })
              .eq('email', identity);
      
            if (error) {
              console.error('Error updating data:', error.message); 
            }
            console.log('Data updated successfully:', data);
          } catch (error) {
            console.log('error', error)
            
          }
      } else if(!phone_verify){
        try {
            const { data, error } = await supabase
              .from('rider')
              .update({ phone_verify: true, })
              .eq('phone', identity);
      
            if (error) {
              console.error('Error updating data:', error.message);
            }
            console.log('Data updated successfully:', data);
          } catch (error) {
            console.log('error', error)
            
          }
      }

    

      if (!verified) {
        return res.status(400).json({ verify: 'User not verified' });
      } else if (!panic) {
        return res.status(400).json({ verify: 'User panic details not found' });
      } else {
        return res.status(200).json({ verify: 'User is fully inclusive' ,identity:data[`${userColumn}_verify`]});
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Unexpected error' });
    }
  };

  if (identity.includes('@')) {
    await handleVerification('email', identity);
  } else {
    await handleVerification('phone', identity);
  }
});

module.exports = router;

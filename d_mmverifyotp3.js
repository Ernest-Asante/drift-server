const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { identity, otp, contact, firstName, lastName,dataId, ghanacard, address, photo } = req.body;
  console.log(firstName)
  console.log(dataId)

  const isEmail = contact.includes('@')
  const userColumn = isEmail ? 'email' : 'phone';
 const identityColumn = isEmail ? 'phone' : 'email'; 

  try {
    const { data, error } = await supabase
      .from('driver')
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
   


      try {
        const { data: updateData, error: updateError } = await supabase
          .from('driver')
          .update({ 
            [userColumn]: contact, 
            fname: firstName, 
            lname: lastName, 
            national_id: ghanacard,
            address:address,
            imageurl: photo,
            verified: true, 
            [`${userColumn}_verify`]: true 
          })
          .eq(identityColumn, identity); // Use the row ID for updating the correct record
  
        if (updateError) {
          console.error('Error updating data:', updateError.message);
          return res.status(400).json({ message: 'Error updating data' });
        } else {
          console.log('Data updated successfully:', updateData);
  
          // Delete the row after updating
          try {
            const { data: deleteData, error: deleteError } = await supabase
              .from('driver')
              .delete()
              .eq('id', dataId);
  
            if (deleteError) {
              console.error('Error deleting data:', deleteError.message);
              return res.status(400).json({ message: 'Error deleting data' });
            } else {
              console.log('Data deleted successfully:', deleteData);
              return res.status(200).json({ message: 'Data updated and deleted successfully' });
            }
          } catch (deleteError) {
            console.error('Unexpected error during delete:', deleteError);
            return res.status(500).json({ message: 'Unexpected error during delete' });
          }
        }
      } catch (updateError) {
        console.error('Unexpected error during update:', updateError);
        return res.status(500).json({ message: 'Unexpected error during update' });
      }

    // Add profile to the database
   
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' }); 
  }
});

module.exports = router;

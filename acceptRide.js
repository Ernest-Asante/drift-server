const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { userId, driverId, fare, model, color, plate } = req.body;

  function generateRandomDuration() {
    const minMinutes = 4;
    const maxMinutes = 10;

    // Generate a random number between minMinutes and maxMinutes (inclusive)
    const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;

    return `${randomMinutes} minutes`;
}

// Example usage:
const duration = generateRandomDuration();

function generateRandom10DigitNumber() {
  let numDigits = 10;
  let randomNumber = '';

  for (let i = 0; i < numDigits; i++) {
      randomNumber += Math.floor(Math.random() * 10); // Append a random digit (0-9)
  }

  return randomNumber;
}

// Generate and output a random 10-digit number
const tripId = generateRandom10DigitNumber();

  const payload = {
   
    userId: userId,
    driverId: driverId,
    time: duration,
    fare: fare,
    model:model,
    color: color,
    plate: plate,
    tripId:tripId,
    
  }


      try {
        const { data: updateData, error: updateError } = await supabase
          .from('rider')
          .update({ride_payload: payload, ongoing_ride:true})
          .eq('id', userId); // Use the row ID for updating the correct record
  
        if (updateError) {
          console.error('Error delete data:', updateError.message);
          return res.status(400).json({ message: 'Error updating data' });
        } else {
          console.log('Data update successfully:', updateData);
  
          // Delete the row after updating
          try {
            const { data: updateData, error: updateError } = await supabase
              .from('driver')
              .update({ongoing_ride: true})
              .eq('id', driverId);
  
            if (updateError) {
              console.error('Error deleting data:', updateError.message);
              return res.status(400).json({ message: 'Error deleting data' });
            } else {
              console.log('Data deleted successfully:', updateData);
              return res.status(200).json({ message: 'Trip accepted' });
            }
          } catch (deleteError) {
            console.error('Unexpected error during delete:', updateError);
            return res.status(500).json({ message: 'Unexpected error during delete' });
          }
        }
      } catch (updateError) {
        console.error('Unexpected error during update:', updateError);
        return res.status(500).json({ message: 'Unexpected error during update' });
      }

    // Add profile to the database
   
 
});

module.exports = router;

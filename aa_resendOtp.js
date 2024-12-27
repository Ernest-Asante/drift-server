const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Infobip, AuthType } = require('@infobip-api/sdk');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);



// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail'
    auth: {
      user: 'waecbay@gmail.com', // your email
      pass: 'puae vhmw tugh ltrb' // your email password
    }
  });

  // Set up email data
  const mailOptions = {
    from: 'ShopHaven <waecbay@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}` // plain text body
  };

  // Send mail with defined transport object
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


// Define the /verifyotp route
router.post('/', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);
  const currentTime = new Date().toISOString();

  
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ otp, created_at: currentTime })
        .eq('email', email);

      if (error) {
        console.error('Error updating data:', error.message);
        return res.status(500).send({ "error": 'Failed to update OTP' });
      }

      console.log('Data updated successfully:', data);
      await sendOTPEmail(email, otp);

      res.status(200).send({ "message": "OTP sent successfully" });
    } catch (error) {
      res.status(500).send({ "error": 'Failed to send OTP email' });
    }
  }
);

module.exports = router;

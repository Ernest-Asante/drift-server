const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Infobip, AuthType } = require('@infobip-api/sdk');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the data to be inserted
const infobipClient = new Infobip({
  baseUrl: 'xl36j3.api.infobip.com',
  apiKey: '5842f8416c51516d270ca62f98d3b723-71c8c08d-71ff-49b1-8ba2-51de59819997',
  authType: AuthType.ApiKey,
});

// Function to send OTP email
const sendOTPEmail = async (contact, otp) => {
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
    from: 'Drift <waecbay@gmail.com>', // sender address
    to: contact, // list of receivers
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

const sendOTPPhone = async (contact, otp) => {
  try {
    await infobipClient.channels.sms.send({
      messages: [{
        destinations: [
          {
            to: contact,
          },
        ],
        from: 'Drift',
        text: `Your Drift OTP is: ${otp}`,
      }],
    });
  } catch (error) {
    console.error('Error sending phone OTP:', error);
  }
};

// Define the /verifyotp route
router.post('/', async (req, res) => {
  const { identity , contact} = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);
  const currentTime = new Date().toISOString();

  if (contact.includes('@')) {
    try {
      const { data, error } = await supabase
        .from('rider')
        .update({ otp, created_at: currentTime })
        .eq('phone', identity);

      if (error) {
        console.error('Error updating data:', error.message);
        return res.status(500).send({ "error": 'Failed to update OTP' });
      }

      console.log('Data updated successfully:', data);
      await sendOTPEmail(contact, otp);

      res.status(200).send({ "message": "OTP sent successfully" });
    } catch (error) {
      res.status(500).send({ "error": 'Failed to send OTP email' });
    }
  } else {
    try {
      const { data, error } = await supabase
        .from('rider')
        .update({ otp, created_at: currentTime })
        .eq('email', identity);

      if (error) {
        console.error('Error updating data:', error.message);
        return res.status(500).send({ "error": 'Failed to update OTP' });
      }

      console.log('Data updated successfully:', data);
      await sendOTPPhone(contact, otp);

      res.status(200).send({ "message": "OTP sent successfully" });
    } catch (error) {
      res.status(500).send({ "error": 'Failed to send OTP SMS' });
    }
  }
});

module.exports = router;

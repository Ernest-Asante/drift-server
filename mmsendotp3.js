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
  baseUrl: 'qyngx3.api.infobip.com',
  apiKey: '68280bbbfabbc6211283b0f4363def24-7e223ec0-096f-4ae2-ab1a-f10a380582ea',
  authType: AuthType.ApiKey,
});

// Function to send OTP email
const sendOTPEmail = async (contact, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'waecbay@gmail.com',
      pass: 'puae vhmw tugh ltrb',
    },
  });

  const mailOptions = {
    from: 'Drift <waecbay@gmail.com>',
    to: contact,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

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
        destinations: [{ to: contact }],
        from: 'Drift',
        text: `Your Drift OTP is: ${otp}`,
      }],
    });
    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending phone OTP:', error);
  }
};

// Define the /verifyotp route
router.post('/', async (req, res) => {
  const { identity, contact } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);
  const currentTime = new Date().toISOString();

  try {
    let column = contact.includes('@') ? 'email' : 'phone';
    let inverseColumn = contact.includes('@') ? 'phone' : 'email';


     const { data, error } = await supabase
        .from('rider')
        .update({ otp, created_at: currentTime })
        .eq(inverseColumn, identity);

      if (error) {
        console.error('Error updating data:', error.message);
        return res.status(500).send({ error: 'Failed to update OTP' });
      }

      if (contact.includes('@')) {
        await sendOTPEmail(contact, otp);
      } else {
        await sendOTPPhone(contact, otp);
      }

      return res.status(200).send({ message: 'OTP sent successfully' });
    

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
});

module.exports = router;

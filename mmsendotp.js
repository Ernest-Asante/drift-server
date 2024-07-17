const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Infobip, AuthType } = require('@infobip-api/sdk');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ykvtwisrbzpkzejkposo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdnR3aXNyYnpwa3plamtwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNTk1NzcsImV4cCI6MjAzMzczNTU3N30.b1fqoxTiOYOVRTlnWwcSJTB-AWxCpfJudXnGRx_v_Lk';
const supabase = createClient(supabaseUrl, supabaseKey);

const infobipClient = new Infobip({
  baseUrl: 'qyngx3.api.infobip.com',
  apiKey: '68280bbbfabbc6211283b0f4363def24-7e223ec0-096f-4ae2-ab1a-f10a380582ea',
  authType: AuthType.ApiKey,
});

const sendOTPEmail = async (identity, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'waecbay@gmail.com',
      pass: 'puae vhmw tugh ltrb',
    },
  });

  const mailOptions = {
    from: 'Drift <waecbay@gmail.com>',
    to: identity,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendOTPPhone = async (identity, otp) => {
  await infobipClient.channels.sms.send({
    messages: [{
      destinations: [{ to: identity }],
      from: 'Drift',
      text: `Your Drift OTP is: ${otp}`,
    }],
  });
};

router.post('/', async (req, res) => {
  const { identity } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);
  const currentTime = new Date().toISOString();

  try {
    const key = identity.includes('@') ? 'email' : 'phone';
    const { data, error } = await supabase
      .from('rider')
      .select('*')
      .eq(key, identity)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) { 
      console.error('Error fetching data:', error.message) 
      console.log(error)
      return res.status(500).json({ error: 'Error fetching data' });
    } 

    if (data.length === 0) {
      const { error: insertError } = await supabase
        .from('rider')
        .insert([{ [key]: identity, otp, created_at: currentTime, type: 'rider' }]);

      if (insertError) {
        console.error('Error inserting data:', insertError.message);
        return res.status(500).json({ error: 'Failed to insert OTP' });
      }

      try {
        if (key === 'email') {
          await sendOTPEmail(identity, otp);
        } else {
          await sendOTPPhone(identity, otp);
        }
        return res.status(200).json({ message: 'OTP sent successfully' });
      } catch (sendError) {
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
    } else {
      const { error: updateError } = await supabase
        .from('rider')
        .update({ otp, created_at: currentTime })
        .eq(key, identity);

      if (updateError) {
        console.error('Error updating data:', updateError.message);
        return res.status(500).json({ error: 'Failed to update OTP' });
      }

      try {
        if (key === 'email') { 
          await sendOTPEmail(identity, otp);
        } else {
          await sendOTPPhone(identity, otp);
        }
        return res.status(200).json({ message: 'OTP sent successfully' });
      } catch (sendError) {
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
});

module.exports = router;

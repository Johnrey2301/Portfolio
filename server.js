const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'johnreygavino95@gmail.com',      // replace with your Gmail
        pass: 'bofq bdcq soop ukst'         // use Gmail App Password
      }
    });

    await transporter.sendMail({
      from: email,
      to: 'johnreygavino95@gmail.com',
      subject: 'New message from Portfolio Contact Form',
      html: `<strong>Name:</strong> ${name}<br>
             <strong>Email:</strong> ${email}<br>
             <strong>Message:</strong><br>${message}`
    });

    res.send('✅ Message sent successfully!');
  } catch (error) {
    res.status(500).send('❌ Error: ' + error.message);
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

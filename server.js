// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Anslut till MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Ansluten till MongoDB'))
.catch(err => console.error('MongoDB anslutningsfel:', err));

// Användarmodell
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// E-postkonfiguration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Skicka e-postfunktion
async function sendNewUserEmail(user) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'mackybaraka4@gmail.com',
    subject: 'Ny användare på Bibelstudion',
    text: `En ny användare har registrerat sig:\n\nNamn: ${user.name}\nE-post: ${user.email}\n\nTid: ${new Date().toLocaleString()}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-post skickad');
  } catch (error) {
    console.error('E-postfel:', error);
  }
}

// Registreringsroute
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kontrollera om användaren redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-postadressen används redan' });
    }

    // Kryptera lösenord
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa ny användare
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Skicka e-postnotifikation
    await sendNewUserEmail(user);

    // Skapa JWT-token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Registrering misslyckades' });
  }
});

// Inloggningsroute
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hitta användare
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Ogiltiga inloggningsuppgifter' });
    }

    // Jämför lösenord
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ogiltiga inloggningsuppgifter' });
    }

    // Skapa JWT-token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Inloggning misslyckades' });
  }
});

// Profilroute (skyddad)
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Åtkomst nekad' });
    }

    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Användare inte hittad' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Ogiltig token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));
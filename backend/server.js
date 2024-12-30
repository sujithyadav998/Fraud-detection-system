const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Persistent user storage
const USERS_FILE = 'users.json';
const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : {};

const saveUsers = () => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Received token:', token);
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Invalid token:', err);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded; // Attach decoded token data to request
    next();
  });
};

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});

// Signup route
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Signup request received:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (users[email]) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { password: hashedPassword };
    saveUsers();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', { email });

    const user = users[email];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token }); // Ensure token is sent back to the client
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User details route
app.get('/auth/user', verifyToken, (req, res) => {
  console.log('User details request received for:', req.user.email);
  res.json({ email: req.user.email });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

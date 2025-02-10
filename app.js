require('dotenv').config();
const express = require('express');
const app = express();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const https= require('http');
const server = https.createServer(app);
const hostname = '127.0.0.1';
const PORT = process.env.PORT || 4000;

app.use(express.json());

const db = require('./routes/connection');
const Account = require("./schema/account");
const { console } = require('inspector');

app.get('/', (req, res) => {
    res.send('Hello, Express!');
    res.clearCookie('token');
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username,email,password)
    const existingUser = await Account.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Account({ username, email, password: hashedPassword });
    // const newUser = new Account({ username, email, password });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Account.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: true });
    console.log('Login successful');
    res.json({ message: 'Login successful', token});
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    console.log('Logout successful');
    res.json({ message: 'Logged out successfully'});
});

server.listen(PORT, () => {
    console.log(`🎯 Server is started on port: http://${hostname}:${PORT}/`);
});
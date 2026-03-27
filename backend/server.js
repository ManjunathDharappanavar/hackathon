const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const connectdb = require('./db/connectdb');
const userroute = require('./routes/userroute');


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MongoDB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api',userroute);

// Start the server
const PORT = process.env.port || 4646;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
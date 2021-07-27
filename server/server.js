const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// added env settings
dotenv.config();
console.log('dotenv.config();', dotenv.config());

const app = express();

// import routes
const authRouter = require('./routes/authRoute');

// notificate http request
app.use(morgan('dev'));

// parse request json data
app.use(express.json({ extended: false }));

// result cors error
// app.use(cors());
app.use(cors({ origin: process.env.CLIENT_URL }));

// middlewares
app.use('/api/auth', authRouter);

console.log('process.env.PORT', process.env.PORT);
// console.log('process.env', process.env);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

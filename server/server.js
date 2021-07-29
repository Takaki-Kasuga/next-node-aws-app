const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const dotenv = require('dotenv');
const connectDB = require('./database/db');
// added env settings
dotenv.config();
console.log('dotenv.config();', dotenv.config());

const app = express();

// mongoDB
connectDB();

// import routes
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

// notificate http request
app.use(morgan('dev'));

// parse request json data
app.use(express.json({ extended: false }));

// result cors error
// app.use(cors());
app.use(cors({ origin: process.env.CLIENT_URL }));

// middlewares
app.use('/api/auth', authRouter);
app.use('/api', userRouter);

console.log('process.env.PORT', process.env.PORT);
// console.log('process.env', process.env);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

const express = require('express');
const app = express();
const morgan = require('morgan');

// import routes
const authRouter = require('./routes/authRoute');

// notificate http request
app.use(morgan('dev'));

// parse request json data
app.use(express.json({ extended: false }));

// middlewares
app.use('/api/auth', authRouter);

console.log('process.env.PORT', process.env.PORT);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

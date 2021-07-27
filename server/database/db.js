const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CLOUD, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log('MongoDBに接続が失敗しました。');
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

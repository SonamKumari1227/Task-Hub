const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ersonam2712kumari:la0E6nm98Gvm2Qux@user-cluster.nvuc77z.mongodb.net/UserInfo?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;


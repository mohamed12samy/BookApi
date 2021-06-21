const mongoose = require('mongoose');
const config = require('../config.json');
require('dotenv').config()
const { PORT } = process.env;

module.exports = () => {
  mongoose.connect(config.dbSettings.url,
    {
      useNewUrlParser: true, useUnifiedTopology: true
    }
  );
  
  const db = mongoose.connection;
  
  db.on('open', () => {
    console.log('connection started', process.env, PORT);
  });
  
  db.emit("hello");
  
  
  db.on('error', (err) => {
    console.log('connection error', err);
  })

};
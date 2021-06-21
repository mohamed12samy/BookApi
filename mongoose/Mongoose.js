const mongoose = require('mongoose');
const config = require('../config.json');


module.exports = () => {
  mongoose.connect(config.dbSettings.url,
    {
      useNewUrlParser: true, useUnifiedTopology: true
    }
  );
  
  const db = mongoose.connection;
  
  db.on('open', () => {
    console.log('connection started');
  });
  
  db.emit("hello");
  
  
  db.on('error', (err) => {
    console.log('connection error', err);
  })

};
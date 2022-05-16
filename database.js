
const mongoose = require('mongoose');

if(mongoose.connection.readyState == 0){
  mongoose.connect('mongodb://127.0.0.1:27017/comment', )
  mongoose.connection.on('error', (err) => {
    console.log('err', err);
    throw err;
  });

  mongoose.connection.on('connected', () => {
    console.log('mongoose is connected');
  });
}
module.exports = mongoose;

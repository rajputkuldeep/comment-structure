const Mongoose = require('mongoose');

const schema = new Mongoose.Schema({
  name: {
    type: String,
    maxLength: 60,
    required: true
  },
  email: {
    type: String,
    required:true
  },
  friends: {
    type: Array,
    default: []
  },
  friend_request: {
    type: Array,
    default: []
  },
  stripe_customer_id: {
    type:String,
    required:false
  },
  fingerprint: {
    type:Array,
    default:[]
  }
}, {
  timestamps: true
});

module.exports = Mongoose.model('User', schema);

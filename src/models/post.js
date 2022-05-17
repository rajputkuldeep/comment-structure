const Mongoose = require('mongoose');

const schema = new Mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    user_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model('Post', schema, 'post');

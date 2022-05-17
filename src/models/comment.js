const Mongoose = require('mongoose');

const schema = new Mongoose.Schema(
  {
    post_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    comment_id: {
      type: Mongoose.Schema.Types.ObjectId,
      required: false,
    },
    user_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model('Comment', schema, 'comment');

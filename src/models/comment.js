const Mongoose = require('mongoose');

const schema = new Mongoose.Schema({
    post_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    content: {
      type: String,
    },
    stage: {
      type: Number,
      isIn: [1, 2, 3]
    },
    comment_id: {
      type: Mongoose.Schema.Types.ObjectId,
      // ref: "Comment",
      required: false
    },
    nested_comment_id: {
      type: Mongoose.Schema.Types.ObjectId,
      required: false
    }
  },
  {
    timestamps: true
  });

module.exports = Mongoose.model('Comment', schema, 'comment');

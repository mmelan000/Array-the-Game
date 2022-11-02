const { Schema, model, Types } = require('mongoose');

const reactionSchema = new Schema({
  reactionid: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    require: true,
    max: 280,
  },
  username: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reaction = model('Reaction', reactionSchema);

module.exports = Reaction;

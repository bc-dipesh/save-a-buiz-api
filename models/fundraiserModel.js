import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const fundraiserSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    goal: {
      type: Number,
      required: true,
      default: 0,
    },
    collected: {
      type: Number,
      required: true,
      default: 0,
    },
    donors: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: [commentSchema],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

export default Fundraiser;

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
    location: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
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

fundraiserSchema.pre('save', function (next) {
  const shortDescription = this.description.substring(
    0,
    100,
  );
  this.shortDescription = shortDescription;
  next();
});

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

export default Fundraiser;

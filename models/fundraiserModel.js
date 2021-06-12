import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please provide the name of the commentator'],
    ref: 'User',
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
  },
});

const fundraiserSchema = mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Please provide location for the fundraiser'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the fundraiser'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a image for the fundraiser'],
    },
    youTubeVideoLink: {
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the fundraiser'],
    },
    shortDescription: {
      type: String,
    },
    goal: {
      type: Number,
      required: [true, 'Please provide a goal amount for the fundraiser'],
    },
    collected: {
      type: Number,
      default: 0,
    },
    donors: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a organizer for the fundraiser'],
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

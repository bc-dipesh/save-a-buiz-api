import mongoose from 'mongoose';

const DonationSchema = mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a donor for the fundraiser.'],
      ref: 'User',
    },
    message: {
      type: String,
      required: [true, 'Please provide a message for the fundraiser.'],
    },
  },
  {
    timestamps: true,
  }
);

const FundraiserSchema = mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Please provide location for the fundraiser.'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the fundraiser.'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a image for the fundraiser.'],
    },
    youTubeVideoLink: {
      type: String,
      required: [
        true,
        'Please provide a YouTube video link that describes the story for the fundraiser.',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the fundraiser.'],
    },
    shortDescription: {
      type: String,
    },
    goal: {
      type: Number,
      required: [true, 'Please provide a goal amount for the fundraiser.'],
    },
    collected: {
      type: Number,
      default: 0,
    },
    donations: [DonationSchema],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a organizer for the fundraiser.'],
      ref: 'User',
    },
    isGoalCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

FundraiserSchema.pre('save', function (next) {
  // generate a short description
  const shortDescription = this.description.substring(0, 100);
  this.shortDescription = shortDescription;
  next();
});

const Fundraiser = mongoose.model('Fundraiser', FundraiserSchema);

export default Fundraiser;

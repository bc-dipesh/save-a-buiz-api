import mongoose from 'mongoose';

const DonationSchema = mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please provide a donor for the fundraiser.'],
    ref: 'User',
  },
  refId: {
    type: String,
    required: true,
    unique: [true, 'You have already donated. Thank you'],
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
    donations: [DonationSchema],
    collected: {
      type: Number,
      default: 0,
    },
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

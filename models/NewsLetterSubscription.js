import mongoose from 'mongoose';

const NewsLetterSubscriptionSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide a email'],
      unique: [true, 'Email already subscribed to newsletter'],
    },
  },
  {
    timestamps: true,
  }
);

const SubscribeToNewsLetter = mongoose.model('SubscribeToNewsLetter', NewsLetterSubscriptionSchema);

export default SubscribeToNewsLetter;

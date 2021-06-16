import mongoose from 'mongoose';
import validator from 'validator';

const NewsLetterSubscriptionSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide a email'],
      unique: [true, 'Email already subscribed to newsletter'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
  },
  {
    timestamps: true,
  }
);

const SubscribeToNewsLetter = mongoose.model('SubscribeToNewsLetter', NewsLetterSubscriptionSchema);

export default SubscribeToNewsLetter;

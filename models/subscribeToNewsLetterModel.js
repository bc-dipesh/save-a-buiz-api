import mongoose from 'mongoose';

const subscribeToNewsLetterSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const SubscribeToNewsLetter = mongoose.model('SubscribeToNewsLetter', subscribeToNewsLetterSchema);

export default SubscribeToNewsLetter;

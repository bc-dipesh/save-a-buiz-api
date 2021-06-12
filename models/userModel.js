import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name of the user'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a email'],
      unique: [true, 'Email already taken, please provide a new email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    mobilePhoneNumber: {
      type: String,
      required: [true, 'Please provide a mobile phone number'],
      unique: [true, 'Mobile phone number already taken, please provide a new number'],
      validate: [validator.isMobilePhone, 'Please provide a valid mobile phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password for the user'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.comparePassword = async function (passwordToCompare) {
  const passwordIsMatch = await bcrypt.compare(passwordToCompare, this.password);
  return passwordIsMatch;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;

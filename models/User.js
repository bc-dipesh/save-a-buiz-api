import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const UserSchema = mongoose.Schema(
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
      minlength: 6,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    twoFactorCode: String,
    twoFactorCodeExpire: Date,
    twoFactorEnable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // generate token
  const passwordResetToken = crypto.randomBytes(20).toString('hex');

  // hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

  // set token expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return passwordResetToken;
};

// generate email confirmation token
UserSchema.methods.generateEmailConfirmToken = function () {
  // generate token
  const emailConfirmationToken = crypto.randomBytes(20).toString('hex');

  this.confirmEmailToken = crypto.createHash('sha256').update(emailConfirmationToken).digest('hex');

  const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
  const confirmTokenCombined = `${emailConfirmationToken}.${confirmTokenExtend}`;

  return confirmTokenCombined;
};

// cascade delete fundraisers when a user is deleted
UserSchema.pre('remove', async function (next) {
  console.log(`Fundraiser being removed from user ${this._id}`);
  await this.model('Fundraiser').deleteMany({ user: this._id });
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;

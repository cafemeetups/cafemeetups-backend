import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  community: {
    type: String,
    required: true,
    enum: ['Influencer', 'Entrepreneur', 'Blogger', 'Artist', 'Creator', 'Video Editor']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  socialLinks: {
    instagram: String,
    facebook: String,
    youtube: String
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.model('User', userSchema);

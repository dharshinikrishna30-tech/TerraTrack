import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    organization: {
      type: String,
      default: 'TerraTrack Enterprise',
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'sustainability_lead', 'facility_manager', 'viewer'],
      default: 'sustainability_lead',
    },
    avatar: {
      type: String,
      default: '',
    },
    unitSystem: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric',
    },
    facilityArea: {
      type: Number,
      default: 15000, // sq meters / sq ft
    },
    headcount: {
      type: Number,
      default: 50,
    },
    customEmissionFactors: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Hash password prior to saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

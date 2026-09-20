import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['spike', 'anomaly', 'goal_drift', 'missing_data', 'milestone'],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'warning',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      default: 'all',
    },
    metric: {
      type: String,
      default: 'CO2e',
    },
    threshold: {
      type: Number,
      default: 0,
    },
    detectedValue: {
      type: Number,
      default: 0,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Alert', alertSchema);

import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: 120,
    },
    resourceType: {
      type: String,
      enum: [
        'all',
        'electricity',
        'fuel_diesel',
        'fuel_petrol',
        'natural_gas',
        'water',
        'waste_landfill',
      ],
      default: 'all',
    },
    baselineValue: {
      type: Number,
      required: true, // Baseline CO2e in kg
    },
    targetValue: {
      type: Number,
      required: true, // Target CO2e in kg
    },
    currentValue: {
      type: Number,
      default: 0, // Recalculated dynamically or periodically
    },
    targetReductionPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ['carbon_neutrality', 'energy_efficiency', 'water_conservation', 'waste_diversion', 'fleet_decarbonization'],
      default: 'carbon_neutrality',
    },
    status: {
      type: String,
      enum: ['in_progress', 'achieved', 'at_risk'],
      default: 'in_progress',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Goal', goalSchema);

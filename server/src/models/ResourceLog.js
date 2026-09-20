import mongoose from 'mongoose';

const resourceLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: [
        'electricity',
        'fuel_diesel',
        'fuel_petrol',
        'natural_gas',
        'water',
        'waste_landfill',
        'waste_recycled',
      ],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Resource quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kWh', 'MWh', 'L', 'gal', 'm3', 'therm', 'kg', 'ton', 'lb'],
    },
    normalizedQuantity: {
      type: Number,
      default: 0,
    },
    emissionFactorUsed: {
      type: Number,
      required: true,
    },
    estimatedCO2e: {
      type: Number,
      required: true, // In Kilograms (kg CO2e)
      index: true,
    },
    scope: {
      type: String,
      required: true,
      enum: ['Scope 1', 'Scope 2', 'Scope 3'],
      index: true,
    },
    cost: {
      type: Number,
      default: 0,
    },
    periodStart: {
      type: Date,
      required: true,
      index: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      default: 'Main Campus',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for date-range queries per user
resourceLogSchema.index({ user: 1, periodStart: -1 });

export default mongoose.model('ResourceLog', resourceLogSchema);

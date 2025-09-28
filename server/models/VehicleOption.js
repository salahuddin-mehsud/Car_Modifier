import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Option name is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['exterior', 'interior', 'performance', 'technology', 'safety', 'convenience']
  },
  subcategory: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: String,
  thumbnail: String,
  compatibleVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  dependencies: [{
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleOption'
    },
    required: Boolean
  }],
  conflicts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleOption'
  }],
  isStandard: {
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

optionSchema.index({ category: 1, subcategory: 1 });
optionSchema.index({ price: 1 });

export default mongoose.model('VehicleOption', optionSchema);
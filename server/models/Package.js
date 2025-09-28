import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['performance', 'luxury', 'technology', 'safety', 'appearance', 'premium']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  includedOptions: [{
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleOption'
    },
    quantity: { type: Number, default: 1 }
  }],
  compatibleVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  features: [String]
}, {
  timestamps: true
});

packageSchema.virtual('finalPrice').get(function() {
  return this.price * (1 - this.discount / 100);
});

packageSchema.index({ type: 1 });
packageSchema.index({ price: 1 });

export default mongoose.model('Package', packageSchema);
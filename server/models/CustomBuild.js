import mongoose from 'mongoose';

const customBuildSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Build name is required'],
    trim: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  selectedOptions: [{
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleOption'
    },
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  selectedPackages: [{
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package'
    },
    price: Number
  }],
  selectedColor: {
    name: String,
    code: String,
    price: Number
  },
  basePrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  configuration: mongoose.Schema.Types.Mixed, // Flexible configuration object
  isPublic: {
    type: Boolean,
    default: false
  },
  thumbnail: String,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

customBuildSchema.index({ user: 1, createdAt: -1 });
customBuildSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.model('CustomBuild', customBuildSchema);
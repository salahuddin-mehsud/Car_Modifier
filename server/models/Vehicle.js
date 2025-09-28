import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    enum: {
      values: [
        'Toyota',
        'Ford',
        'BMW',
        'Mercedes',
        'Audi',
        'Porsche',
        'Tesla',
        'Honda',
        'Nissan',
        'AutoCustom' // ✅ added your fictional brand
      ],
      message: '{VALUE} is not a valid manufacturer'
    }
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  category: {
    type: String,
    enum: ['sedan', 'suv', 'truck', 'sports', 'luxury', 'electric'],
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  description: {
    type: String,
    required: true
  },
  images: {
    main: { type: String, required: true },
    gallery: [String],
    threeDModel: String
  },
  specifications: {
    engine: String,
    horsepower: Number,
    torque: Number,
    acceleration: Number, // 0-60 mph in seconds
    topSpeed: Number,
    fuelEfficiency: String,
    transmission: String,
    driveType: String,
    seating: Number
  },
  availableColors: [{
    name: String,
    code: String,
    price: { type: Number, default: 0 },
    image: String,
    texture: String // ✅ added in case you want GLB/JPG textures
  }],
  availableOptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleOption'
  }],
  availablePackages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  }],
  inventory: {
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    expectedDelivery: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
vehicleSchema.index({ manufacturer: 1, model: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ basePrice: 1 });
vehicleSchema.index({ 'specifications.horsepower': -1 });

export default mongoose.model('Vehicle', vehicleSchema);

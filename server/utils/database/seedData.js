import mongoose from 'mongoose';
import { config } from '../../config/environment.js';
import Vehicle from '../../models/Vehicle.js';
import VehicleOption from '../../models/VehicleOption.js';
import Package from '../../models/Package.js';
import { VEHICLE_MODELS, WHEEL_MODELS, COLOR_TEXTURES } from '../constants/vehicleModels.js';


const seedData = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to database for seeding');

    // Clear existing data
    await Vehicle.deleteMany({});
    await VehicleOption.deleteMany({});
    await Package.deleteMany({});

    // Seed Vehicle Options
    const options = await VehicleOption.insertMany([
      // Exterior Options
      {
        name: 'Metallic Paint',
        category: 'exterior',
        subcategory: 'paint',
        description: 'Premium metallic paint finish',
        price: 1500,
        image: '/images/options/metallic-paint.jpg'
      },
      {
        name: 'Premium LED Headlights',
        category: 'exterior',
        subcategory: 'lighting',
        description: 'Advanced LED lighting system',
        price: 1200,
        image: '/images/options/led-headlights.jpg'
      },
      {
        name: '20-inch Alloy Wheels',
        category: 'exterior',
        subcategory: 'wheels',
        description: 'Sporty 20-inch alloy wheels',
        price: 2500,
        image: '/images/options/20inch-wheels.jpg'
      },
      
      // Interior Options
      {
        name: 'Leather Seats',
        category: 'interior',
        subcategory: 'upholstery',
        description: 'Premium leather seat upholstery',
        price: 3000,
        image: '/images/options/leather-seats.jpg'
      },
      {
        name: 'Heated Seats',
        category: 'interior',
        subcategory: 'comfort',
        description: 'Front seat heating system',
        price: 800,
        image: '/images/options/heated-seats.jpg'
      },
      {
        name: 'Premium Sound System',
        category: 'interior',
        subcategory: 'audio',
        description: 'High-fidelity audio system',
        price: 1800,
        image: '/images/options/premium-audio.jpg'
      },
      
      // Performance Options
      {
        name: 'Sport Suspension',
        category: 'performance',
        subcategory: 'handling',
        description: 'Enhanced sport suspension system',
        price: 2200,
        image: '/images/options/sport-suspension.jpg'
      },
      {
        name: 'Performance Brakes',
        category: 'performance',
        subcategory: 'braking',
        description: 'High-performance braking system',
        price: 1800,
        image: '/images/options/performance-brakes.jpg'
      }
    ]);

    // Seed Packages
    const packages = await Package.insertMany([
      {
        name: 'Luxury Package',
        type: 'luxury',
        description: 'Premium luxury features including leather seats and premium audio',
        price: 6500,
        discount: 10,
        includedOptions: [
          { option: options[3]._id, quantity: 1 }, // Leather Seats
          { option: options[5]._id, quantity: 1 }, // Premium Sound System
          { option: options[4]._id, quantity: 1 }  // Heated Seats
        ],
        features: ['Leather Upholstery', 'Premium Audio', 'Heated Seats', 'Wood Trim']
      },
      {
        name: 'Sport Package',
        type: 'performance',
        description: 'Enhanced performance and sport styling',
        price: 5500,
        discount: 15,
        includedOptions: [
          { option: options[2]._id, quantity: 1 }, // 20-inch Wheels
          { option: options[6]._id, quantity: 1 }, // Sport Suspension
          { option: options[7]._id, quantity: 1 }  // Performance Brakes
        ],
        features: ['Sport Suspension', 'Performance Brakes', '20-inch Wheels', 'Sport Seats']
      }
    ]);

    // Seed Vehicles
    const vehicles = await Vehicle.insertMany([
      {
    name: 'Sports Coupe Premium',
    model: 'Sports Coupe',
    manufacturer: 'AutoCustom',
    basePrice: 45000,
    category: 'sports',
    year: 2024,
    description: 'High-performance sports coupe with premium features',
    modelPath: VEHICLE_MODELS.car1.modelPath,
    images: {
      main: '/images/vehicles/sports-coupe.jpg',
      gallery: [
        '/images/vehicles/sports-coupe-1.jpg',
        '/images/vehicles/sports-coupe-2.jpg'
      ]
    },
    specifications: {
      engine: '3.0L V6 Turbo',
      horsepower: 400,
      torque: 420,
      acceleration: 4.2,
      topSpeed: 180,
      fuelEfficiency: '25 MPG',
      transmission: '8-Speed Automatic',
      driveType: 'RWD',
      seating: 4
    },
    availableColors: [
      { name: 'Racing Red', code: '#FF0000', price: 0, texture: COLOR_TEXTURES.red },
      { name: 'Midnight Black', code: '#000000', price: 1500, texture: COLOR_TEXTURES.black },
      { name: 'Arctic White', code: '#FFFFFF', price: 0, texture: COLOR_TEXTURES.white }
    ],
    // ... rest of vehicle data
  },
  {
    name: 'Luxury Sedan Elite',
    model: 'Luxury Sedan',
    manufacturer: 'AutoCustom',
    basePrice: 65000,
    category: 'luxury',
    year: 2024,
    description: 'Premium luxury sedan with advanced technology',
    modelPath: VEHICLE_MODELS.car2.modelPath,
    images: {
      main: '/images/vehicles/luxury-sedan.jpg',
      gallery: [
        '/images/vehicles/luxury-sedan-1.jpg',
        '/images/vehicles/luxury-sedan-2.jpg'
      ]
    },
    specifications: {
      engine: '4.0L V8',
      horsepower: 450,
      torque: 480,
      acceleration: 4.8,
      topSpeed: 170,
      fuelEfficiency: '22 MPG',
      transmission: '10-Speed Automatic',
      driveType: 'AWD',
      seating: 5
    },
        availableColors: [
      { name: 'Deep Blue', code: '#003366', price: 0, texture: COLOR_TEXTURES.blue },
      { name: 'Silver Metallic', code: '#C0C0C0', price: 2000, texture: COLOR_TEXTURES.silver },
      { name: 'Pearl White', code: '#F5F5F5', price: 1500, texture: COLOR_TEXTURES.white }
    ],
        availableOptions: options.map(opt => opt._id),
        availablePackages: packages.map(pkg => pkg._id),
        inventory: {
          inStock: true,
          quantity: 15,
          expectedDelivery: new Date('2024-03-15')
        }
      },
      {
        name: 'X5 xDrive40i',
        model: 'X5',
        manufacturer: 'BMW',
        basePrice: 65900,
        category: 'suv',
        year: 2024,
        description: 'Luxury SUV with advanced technology',
        images: {
          main: '/images/vehicles/bmw-x5.jpg',
          gallery: [
            '/images/vehicles/bmw-x5-1.jpg',
            '/images/vehicles/bmw-x5-2.jpg'
          ]
        },
        specifications: {
          engine: '3.0L Turbo I6',
          horsepower: 335,
          torque: 331,
          acceleration: 5.3,
          topSpeed: 130,
          fuelEfficiency: '25 MPG',
          transmission: '8-Speed Automatic',
          driveType: 'AWD',
          seating: 7
        },
        availableColors: [
          { name: 'Alpine White', code: '#FFFFFF', price: 0, image: '/images/colors/white.jpg' },
          { name: 'Black Sapphire', code: '#000000', price: 1500, image: '/images/colors/black.jpg' },
          { name: 'Phytonic Blue', code: '#1C6BA0', price: 1500, image: '/images/colors/blue.jpg' }
        ],
        availableOptions: options.map(opt => opt._id),
        availablePackages: packages.map(pkg => pkg._id),
        inventory: {
          inStock: true,
          quantity: 8,
          expectedDelivery: new Date('2024-03-20')
        }
      }
    ]);

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
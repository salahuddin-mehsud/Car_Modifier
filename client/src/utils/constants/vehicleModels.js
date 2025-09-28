import { getModelPath, getTexturePath, getImagePath } from '../helpers/assetHelper.js'

// Vehicle model configurations with CORRECT file paths
export const VEHICLE_MODELS = {
  'car1': {
    modelPath: getModelPath('cars/car1.glb'),
    previewImage: getImagePath('vehicles/car1.jpg'),
    wheelPositions: [
      { position: [ -0.8, -0.3, 1.2 ], name: 'front-left' },
      { position: [ 0.8, -0.3, 1.2 ], name: 'front-right' },
      { position: [ -0.8, -0.3, -1.2 ], name: 'rear-left' },
      { position: [ 0.8, -0.3, -1.2 ], name: 'rear-right' }
    ],
    bodyMaterialName: 'BodyMaterial',
    scale: 1.0
  },
  'car2': {
    modelPath: getModelPath('cars/car2.glb'),
    previewImage: getImagePath('vehicles/car2.jpg'),
    wheelPositions: [
      { position: [ -0.75, -0.35, 1.3 ], name: 'front-left' },
      { position: [ 0.75, -0.35, 1.3 ], name: 'front-right' },
      { position: [ -0.75, -0.35, -1.3 ], name: 'rear-left' },
      { position: [ 0.75, -0.35, -1.3 ], name: 'rear-right' }
    ],
    bodyMaterialName: 'CarBody',
    scale: 1.1
  },
  'car3': {
    modelPath: getModelPath('cars/car3.glb'),
    previewImage: getImagePath('vehicles/car3.jpg'),
    wheelPositions: [
      { position: [ -0.85, -0.4, 1.1 ], name: 'front-left' },
      { position: [ 0.85, -0.4, 1.1 ], name: 'front-right' },
      { position: [ -0.85, -0.4, -1.1 ], name: 'rear-left' },
      { position: [ 0.85, -0.4, -1.1 ], name: 'rear-right' }
    ],
    bodyMaterialName: 'MainBody',
    scale: 0.9
  },
  'car4': {
    modelPath: getModelPath('cars/car4.glb'),
    previewImage: getImagePath('vehicles/car4.jpg'),
    wheelPositions: [
      { position: [ -0.7, -0.25, 1.4 ], name: 'front-left' },
      { position: [ 0.7, -0.25, 1.4 ], name: 'front-right' },
      { position: [ -0.7, -0.25, -1.4 ], name: 'rear-left' },
      { position: [ 0.7, -0.25, -1.4 ], name: 'rear-right' }
    ],
    bodyMaterialName: 'BodyPaint',
    scale: 1.2
  },
  'car5': {
    modelPath: getModelPath('cars/car5.glb'),
    previewImage: getImagePath('vehicles/car5.jpg'),
    wheelPositions: [
      { position: [ -0.9, -0.45, 1.0 ], name: 'front-left' },
      { position: [ 0.9, -0.45, 1.0 ], name: 'front-right' },
      { position: [ -0.9, -0.45, -1.0 ], name: 'rear-left' },
      { position: [ 0.9, -0.45, -1.0 ], name: 'rear-right' }
    ],
    bodyMaterialName: 'VehicleBody',
    scale: 0.8
  },
  'car6': {
    modelPath: getModelPath('cars/car6.glb'),
    previewImage: getImagePath('vehicles/car6.jpg'),
    wheelPositions: [
      { position: [ -0.95, -0.5, 0.9 ], name: 'front-left' },
      { position: [ 0.95, -0.5, 0.9 ], name: 'front-right' },
      { position: [ -0.95, -0.5, -0.9 ], name: 'rear-left' },
      { position: [ 0.95, -0.5, -0.9 ], name: 'rear-right' }
    ],
    bodyMaterialName: 'Chassis',
    scale: 0.7
  }
}

// Wheel models configuration
export const WHEEL_MODELS = {
  'standard': {
    modelPath: getModelPath('wheels/wheel.glb'),
    name: 'Standard Alloy',
    price: 0
  },
  'sport': {
    modelPath: getModelPath('wheels/wheel1.glb'),
    name: 'Sport Alloy',
    price: 1200
  },
  'premium': {
    modelPath: getModelPath('wheels/wheel2.glb'),
    name: 'Premium Alloy',
    price: 2500
  },
  'luxury': {
    modelPath: getModelPath('wheels/wheel3.glb'),
    name: 'Luxury Chrome',
    price: 3500
  },
  'rim1': {
    modelPath: getModelPath('rim/rim1.glb'),
    name: 'Rim Style 1',
    price: 1800
  },
  'rim2': {
    modelPath: getModelPath('rim/rim2.glb'),
    name: 'Rim Style 2',
    price: 2200
  },
  'rim3': {
    modelPath: getModelPath('rim/rim3.glb'),
    name: 'Rim Style 3',
    price: 2800
  },
  'rim4': {
    modelPath: getModelPath('rim/rim4.glb'),
    name: 'Rim Style 4',
    price: 3200
  }
}

// Color textures configuration
export const COLOR_TEXTURES = {
  'red': getTexturePath('texture1.jpg'),
  'blue': getTexturePath('texture2.jpg'),
  'black': getTexturePath('texture3.jpg'),
  'white': getTexturePath('preview.jpg'),
  'silver': getTexturePath('texture1.jpg'),
  'green': getTexturePath('texture2.jpg'),
  'yellow': getTexturePath('texture3.jpg'),
  'orange': getTexturePath('preview.jpg')
}

// Map backend vehicle names to actual model files
export const VEHICLE_MODEL_MAPPING = {
  'Sports Coupe Premium': 'car1',
  'Luxury Sedan Elite': 'car2',
  'X5 xDrive40i': 'car3',
  'Model S Premium': 'car4',
  'Sports Coupe': 'car5',
  'Luxury Sedan': 'car6'
}

// Fallback model in case primary models fail
export const FALLBACK_MODEL = {
  modelPath: getModelPath('cars/car1.glb'),
  wheelPositions: [
    { position: [ -0.8, -0.3, 1.2 ], name: 'front-left' },
    { position: [ 0.8, -0.3, 1.2 ], name: 'front-right' },
    { position: [ -0.8, -0.3, -1.2 ], name: 'rear-left' },
    { position: [ 0.8, -0.3, -1.2 ], name: 'rear-right' }
  ],
  scale: 1.0
}
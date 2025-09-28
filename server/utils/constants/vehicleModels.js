// Vehicle model configurations with actual GLB paths
export const VEHICLE_MODELS = {
  // Car models
  'car1': {
    modelPath: '/models/cars/car1.glb',
    wheelPositions: [
      { position: [ -0.8, -0.3, 1.2 ], name: 'front-left' },
      { position: [ 0.8, -0.3, 1.2 ], name: 'front-right' },
      { position: [ -0.8, -0.3, -1.2 ], name: 'rear-left' },
      { position: [ 0.8, -0.3, -1.2 ], name: 'rear-right' }
    ],
    bodyMaterialName: 'BodyMaterial', // Name of the material to apply colors/textures to
    scale: 1.0
  },
  'car2': {
    modelPath: '/models/cars/car2.glb',
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
    modelPath: '/models/cars/car3.glb',
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
    modelPath: '/models/cars/car4.glb',
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
    modelPath: '/models/cars/car5.glb',
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
    modelPath: '/models/cars/car6.glb',
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
    modelPath: '/models/wheels/wheel.glb',
    name: 'Standard Alloy',
    price: 0
  },
  'sport': {
    modelPath: '/models/wheels/wheel1.glb',
    name: 'Sport Alloy',
    price: 1200
  },
  'premium': {
    modelPath: '/models/wheels/wheel2.glb',
    name: 'Premium Alloy',
    price: 2500
  },
  'luxury': {
    modelPath: '/models/wheels/wheel3.glb',
    name: 'Luxury Chrome',
    price: 3500
  }
}

// Color textures configuration
export const COLOR_TEXTURES = {
  'red': '/textures/red.jpg',
  'blue': '/textures/blue.jpg',
  'black': '/textures/black.jpg',
  'white': '/textures/white.jpg',
  'silver': '/textures/silver.jpg',
  'green': '/textures/green.jpg',
  'yellow': '/textures/yellow.jpg',
  'orange': '/textures/orange.jpg'
}
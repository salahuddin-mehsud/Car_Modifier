import Vehicle from '../models/Vehicle.js';
import VehicleOption from '../models/VehicleOption.js';
import Package from '../models/Package.js';

export const vehicleController = {
  async getAllVehicles(req, res) {
    try {
      const {
        category,
        manufacturer,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
        sortBy = 'basePrice',
        sortOrder = 'asc'
      } = req.query;

      const filter = { isActive: true };
      
      if (category) filter.category = category;
      if (manufacturer) filter.manufacturer = manufacturer;
      if (minPrice || maxPrice) {
        filter.basePrice = {};
        if (minPrice) filter.basePrice.$gte = parseInt(minPrice);
        if (maxPrice) filter.basePrice.$lte = parseInt(maxPrice);
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const vehicles = await Vehicle.find(filter)
        .populate('availableOptions')
        .populate('availablePackages')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Vehicle.countDocuments(filter);

      res.json({
        success: true,
        data: vehicles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching vehicles'
      });
    }
  },

  async getVehicleById(req, res) {
    try {
      const vehicle = await Vehicle.findById(req.params.id)
        .populate('availableOptions')
        .populate('availablePackages');

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching vehicle'
      });
    }
  },

  async getVehicleOptions(req, res) {
    try {
      const { category } = req.query;
      const filter = { isActive: true };
      
      if (category) filter.category = category;

      const options = await VehicleOption.find(filter);

      res.json({
        success: true,
        data: options
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching options'
      });
    }
  },

  async getPackages(req, res) {
    try {
      const { type } = req.query;
      const filter = { isActive: true };
      
      if (type) filter.type = type;

      const packages = await Package.find(filter).populate('includedOptions.option');

      res.json({
        success: true,
        data: packages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching packages'
      });
    }
  }
};
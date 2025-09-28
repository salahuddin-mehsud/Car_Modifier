import Vehicle from '../models/Vehicle.js';
import CustomBuild from '../models/CustomBuild.js';
import { PricingEngine } from '../services/pricingEngine.js';
import { EMIService } from '../services/emiService.js';

export const configuratorController = {
  async calculatePrice(req, res) {
    try {
      const { vehicleId, selectedOptions, selectedPackages, selectedColor } = req.body;

      const vehicle = await Vehicle.findById(vehicleId)
        .populate('availableOptions')
        .populate('availablePackages');

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      const pricing = PricingEngine.calculateBuildPrice(
        vehicle,
        selectedOptions,
        selectedPackages,
        selectedColor
      );

      res.json({
        success: true,
        data: pricing
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async calculateEMI(req, res) {
    try {
      const { principal, annualInterestRate, tenureMonths, downPayment = 0 } = req.body;

      const validation = EMIService.validateLoanParameters(
        principal,
        annualInterestRate,
        tenureMonths,
        downPayment
      );

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid loan parameters',
          errors: validation.errors
        });
      }

      const loanAmount = principal - downPayment;
      const emi = EMIService.calculateEMI(loanAmount, annualInterestRate, tenureMonths);
      const totalPayment = EMIService.calculateTotalPayment(emi, tenureMonths);
      const totalInterest = EMIService.calculateTotalInterest(totalPayment, loanAmount);
      const schedule = EMIService.getEMISchedule(loanAmount, annualInterestRate, tenureMonths);

      res.json({
        success: true,
        data: {
          emi,
          loanAmount,
          downPayment,
          totalPayment,
          totalInterest,
          tenureMonths,
          schedule
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async saveBuild(req, res) {
    try {
      const { name, vehicleId, selectedOptions, selectedPackages, selectedColor, configuration } = req.body;

      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      const pricing = PricingEngine.calculateBuildPrice(
        vehicle,
        selectedOptions,
        selectedPackages,
        selectedColor
      );

      const build = new CustomBuild({
        user: req.user._id,
        name,
        vehicle: vehicleId,
        selectedOptions,
        selectedPackages,
        selectedColor,
        basePrice: pricing.basePrice,
        totalPrice: pricing.totalPrice,
        configuration,
        lastModified: new Date()
      });

      await build.save();
      await build.populate('vehicle selectedOptions.option selectedPackages.package');

      res.status(201).json({
        success: true,
        message: 'Build saved successfully',
        data: build
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getUserBuilds(req, res) {
    try {
      const builds = await CustomBuild.find({ user: req.user._id })
        .populate('vehicle selectedOptions.option selectedPackages.package')
        .sort({ lastModified: -1 });

      res.json({
        success: true,
        data: builds
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching builds'
      });
    }
  },

  async getBuildById(req, res) {
    try {
      const build = await CustomBuild.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('vehicle selectedOptions.option selectedPackages.package');

      if (!build) {
        return res.status(404).json({
          success: false,
          message: 'Build not found'
        });
      }

      res.json({
        success: true,
        data: build
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching build'
      });
    }
  },

  async updateBuild(req, res) {
    try {
      const { name, selectedOptions, selectedPackages, selectedColor, configuration } = req.body;

      let build = await CustomBuild.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('vehicle');

      if (!build) {
        return res.status(404).json({
          success: false,
          message: 'Build not found'
        });
      }

      const pricing = PricingEngine.calculateBuildPrice(
        build.vehicle,
        selectedOptions,
        selectedPackages,
        selectedColor
      );

      build.name = name || build.name;
      build.selectedOptions = selectedOptions || build.selectedOptions;
      build.selectedPackages = selectedPackages || build.selectedPackages;
      build.selectedColor = selectedColor || build.selectedColor;
      build.configuration = configuration || build.configuration;
      build.totalPrice = pricing.totalPrice;
      build.lastModified = new Date();

      await build.save();
      await build.populate('vehicle selectedOptions.option selectedPackages.package');

      res.json({
        success: true,
        message: 'Build updated successfully',
        data: build
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async deleteBuild(req, res) {
    try {
      const build = await CustomBuild.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!build) {
        return res.status(404).json({
          success: false,
          message: 'Build not found'
        });
      }

      res.json({
        success: true,
        message: 'Build deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting build'
      });
    }
  }
};
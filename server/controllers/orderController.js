import Order from '../models/Order.js';
import CustomBuild from '../models/CustomBuild.js';
import Vehicle from '../models/Vehicle.js';
import { PricingEngine } from '../services/pricingEngine.js';

export const orderController = {
  async createOrder(req, res) {
    try {
      const { 
        buildId, 
        shippingAddress, 
        billingAddress, 
        paymentMethod,
        financing 
      } = req.body;

      // Get the build
      const build = await CustomBuild.findOne({
        _id: buildId,
        user: req.user._id
      }).populate('vehicle selectedOptions.option selectedPackages.package');

      if (!build) {
        return res.status(404).json({
          success: false,
          message: 'Build not found'
        });
      }

      // Calculate final pricing
      const tax = PricingEngine.calculateTax(build.totalPrice);
      const shipping = PricingEngine.calculateShipping(shippingAddress.zipCode, build.vehicle.category);
      
      const pricing = {
        subtotal: build.totalPrice,
        tax,
        shipping,
        discount: 0,
        total: build.totalPrice + tax + shipping
      };

      // Create order items
      const items = [
        {
          name: `${build.vehicle.manufacturer} ${build.vehicle.model}`,
          type: 'vehicle',
          referenceId: build.vehicle._id,
          quantity: 1,
          price: build.basePrice,
          subtotal: build.basePrice
        }
      ];

      // Add color option
      if (build.selectedColor) {
        items.push({
          name: `${build.selectedColor.name} Paint`,
          type: 'option',
          referenceId: null, // Color is not a separate option in DB
          quantity: 1,
          price: build.selectedColor.price,
          subtotal: build.selectedColor.price
        });
      }

      // Add selected options
      if (build.selectedOptions && build.selectedOptions.length > 0) {
        build.selectedOptions.forEach(option => {
          items.push({
            name: option.option.name,
            type: 'option',
            referenceId: option.option._id,
            quantity: option.quantity || 1,
            price: option.price,
            subtotal: option.price * (option.quantity || 1)
          });
        });
      }

      // Add packages
      if (build.selectedPackages && build.selectedPackages.length > 0) {
        build.selectedPackages.forEach(pkg => {
          items.push({
            name: pkg.package.name,
            type: 'package',
            referenceId: pkg.package._id,
            quantity: 1,
            price: pkg.price,
            subtotal: pkg.price
          });
        });
      }

      // Create order
      const order = new Order({
        user: req.user._id,
        customBuild: build._id,
        items,
        pricing,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        payment: {
          method: paymentMethod,
          status: 'pending'
        },
        financing: financing || null,
        status: 'pending'
      });

      await order.save();
      await order.populate('customBuild user');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getUserOrders(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      
      const filter = { user: req.user._id };
      if (status) filter.status = status;

      const orders = await Order.find(filter)
        .populate('customBuild')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        data: orders,
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
        message: 'Error fetching orders'
      });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('customBuild user');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching order'
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;

      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { status },
        { new: true }
      ).populate('customBuild user');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async cancelOrder(req, res) {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Only allow cancellation for pending or confirmed orders
      if (!['pending', 'confirmed'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Order cannot be cancelled at this stage'
        });
      }

      order.status = 'cancelled';
      await order.save();

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
import User from '../models/User.js';
import CustomBuild from '../models/CustomBuild.js';
import Order from '../models/Order.js';

export const userController = {
  async getUserDashboard(req, res) {
    try {
      const userId = req.user._id;

      // Get user stats
      const [buildsCount, ordersCount, recentBuilds, recentOrders] = await Promise.all([
        CustomBuild.countDocuments({ user: userId }),
        Order.countDocuments({ user: userId }),
        CustomBuild.find({ user: userId })
          .populate('vehicle')
          .sort({ lastModified: -1 })
          .limit(3),
        Order.find({ user: userId })
          .populate('customBuild')
          .sort({ createdAt: -1 })
          .limit(3)
      ]);

      res.json({
        success: true,
        data: {
          user: req.user,
          stats: {
            buildsCount,
            ordersCount,
            savedBuilds: buildsCount
          },
          recentBuilds,
          recentOrders
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard data'
      });
    }
  },

  async updateUserPreferences(req, res) {
    try {
      const { preferences } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { preferences },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async deactivateAccount(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, { isActive: false });

      res.json({
        success: true,
        message: 'Account deactivated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deactivating account'
      });
    }
  }
};
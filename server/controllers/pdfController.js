import CustomBuild from '../models/CustomBuild.js';
import Order from '../models/Order.js';
import { PDFGenerationService } from '../services/pdfGenerationService.js';

export const pdfController = {
  async generateBuildReport(req, res) {
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

      const pdfBuffer = await PDFGenerationService.generateBuildReport(
        build, 
        req.user, 
        build.vehicle
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=build-report-${build._id}.pdf`);
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating PDF report'
      });
    }
  },

  async generateOrderInvoice(req, res) {
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

      // For now, reuse build report service for orders
      // In a real implementation, you'd create a separate invoice generator
      const pdfBuffer = await PDFGenerationService.generateBuildReport(
        order.customBuild, 
        req.user, 
        order.customBuild.vehicle
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating invoice'
      });
    }
  }
};
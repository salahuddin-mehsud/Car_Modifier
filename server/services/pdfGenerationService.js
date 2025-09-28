import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PDFGenerationService {
  static generateBuildReport(build, user, vehicle) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Add header
        this.addHeader(doc, build, user, vehicle);
        
        // Add build details
        this.addBuildDetails(doc, build, vehicle);
        
        // Add pricing summary
        this.addPricingSummary(doc, build);
        
        // Add footer
        this.addFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static addHeader(doc, build, user, vehicle) {
    // Title
    doc.fontSize(20).text('Custom Vehicle Build Report', { align: 'center' });
    doc.moveDown(0.5);
    
    // User info
    doc.fontSize(12).text(`Generated for: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    
    // Vehicle info
    doc.fontSize(14).text(`Vehicle: ${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}`);
    doc.text(`Build Name: ${build.name}`);
    doc.moveDown();
  }

  static addBuildDetails(doc, build, vehicle) {
    doc.fontSize(16).text('Configuration Details', { underline: true });
    doc.moveDown(0.5);
    
    // Selected Color
    if (build.selectedColor) {
      doc.fontSize(12).text(`Exterior Color: ${build.selectedColor.name}`, { continued: true });
      doc.text(` - $${build.selectedColor.price.toLocaleString()}`, { align: 'right' });
    }
    
    // Selected Options
    if (build.selectedOptions && build.selectedOptions.length > 0) {
      doc.moveDown(0.5);
      doc.text('Additional Options:');
      build.selectedOptions.forEach(option => {
        doc.text(`  • ${option.option?.name || 'Option'}: $${option.price.toLocaleString()}`);
      });
    }
    
    // Selected Packages
    if (build.selectedPackages && build.selectedPackages.length > 0) {
      doc.moveDown(0.5);
      doc.text('Packages:');
      build.selectedPackages.forEach(pkg => {
        doc.text(`  • ${pkg.package?.name || 'Package'}: $${pkg.price.toLocaleString()}`);
      });
    }
    
    doc.moveDown();
  }

  static addPricingSummary(doc, build) {
    doc.fontSize(16).text('Pricing Summary', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(12);
    doc.text(`Base Price: $${build.basePrice.toLocaleString()}`, { align: 'right' });
    
    if (build.selectedColor) {
      doc.text(`Color Upgrade: $${build.selectedColor.price.toLocaleString()}`, { align: 'right' });
    }
    
    const optionsTotal = build.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
    if (optionsTotal > 0) {
      doc.text(`Options Total: $${optionsTotal.toLocaleString()}`, { align: 'right' });
    }
    
    const packagesTotal = build.selectedPackages?.reduce((sum, pkg) => sum + pkg.price, 0) || 0;
    if (packagesTotal > 0) {
      doc.text(`Packages Total: $${packagesTotal.toLocaleString()}`, { align: 'right' });
    }
    
    doc.moveDown(0.5);
    doc.fontSize(14).text(`Total Price: $${build.totalPrice.toLocaleString()}`, { align: 'right', bold: true });
  }

  static addFooter(doc) {
    doc.moveDown(2);
    doc.fontSize(10)
       .text('Thank you for using our car customizer platform!', { align: 'center' })
       .text('This is a computer-generated report.', { align: 'center' });
  }
}
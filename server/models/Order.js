import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customBuild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomBuild',
    required: true
  },
  items: [{
    name: String,
    type: { type: String, enum: ['vehicle', 'option', 'package'] },
    referenceId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  payment: {
    method: { type: String, enum: ['credit_card', 'debit_card', 'paypal', 'stripe'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paymentDate: Date
  },
  financing: {
    loanAmount: Number,
    interestRate: Number,
    termMonths: Number,
    monthlyPayment: Number,
    downPayment: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDelivery: Date,
  trackingNumber: String,
  notes: String
}, {
  timestamps: true
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of orders today for sequential number
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await mongoose.model('Order').countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    this.orderNumber = `ORD-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);
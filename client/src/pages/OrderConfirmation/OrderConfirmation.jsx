import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Truck, Download, Share2 } from 'lucide-react'
import { useCart } from '../../hooks/useCart.js'
import { useAuth } from '../../hooks/useAuth.js'
import { formatCurrency } from '../../utils/formatters/currencyFormatter.js'
import { formatDate } from '../../utils/formatters/dateFormatter.js'

const OrderConfirmation = () => {
  const { currentOrder } = useCart()
  const { user } = useAuth()

  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">It seems there's no order to display.</p>
        <Link to="/configurator" className="btn btn-primary">
          Start a New Build
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your order, {user?.firstName}! Your vehicle is being prepared.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700">Order Number</label>
                <p className="text-lg">{currentOrder.orderNumber}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Order Date</label>
                <p>{formatDate(currentOrder.createdAt)}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Status</label>
                <p className={`px-2 py-1 rounded-full text-sm inline-block ${
                  currentOrder.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentOrder.status.toUpperCase()}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Total Amount</label>
                <p className="text-lg font-bold text-primary-600">
                  {formatCurrency(currentOrder.pricing.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
            <div className="flex items-center space-x-4">
              <img
                src={currentOrder.customBuild?.vehicle?.images.main}
                alt={currentOrder.customBuild?.vehicle?.name}
                className="w-24 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {currentOrder.customBuild?.vehicle?.manufacturer} {currentOrder.customBuild?.vehicle?.model}
                </h3>
                <p className="text-gray-600">
                  Color: {currentOrder.customBuild?.selectedColor?.name}
                </p>
                <p className="text-gray-600">
                  {currentOrder.customBuild?.selectedOptions?.length || 0} options •{' '}
                  {currentOrder.customBuild?.selectedPackages?.length || 0} packages
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700">Shipping Address</label>
                <p className="text-sm">
                  {currentOrder.shippingAddress.street}<br />
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Contact</label>
                <p className="text-sm">
                  {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}<br />
                  {currentOrder.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <span>Order confirmation email sent</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span>Vehicle preparation (3-5 days)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span>Shipping & delivery</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Order Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn btn-outline flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
              </button>
              <button className="w-full btn btn-outline flex items-center justify-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share Order</span>
              </button>
              <Link to="/dashboard" className="w-full btn btn-primary">
                View in Dashboard
              </Link>
            </div>
          </div>

          <div className="card p-6 bg-primary-50 border-primary-200">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Our support team is here to help with your order.
            </p>
            <div className="space-y-1 text-sm">
              <div>📞 1-800-AUTO-CARE</div>
              <div>✉️ support@autocustomizer.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Ready to build another dream car?</p>
        <Link to="/configurator" className="btn btn-primary">
          Start New Build
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmation
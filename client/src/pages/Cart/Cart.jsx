import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../hooks/useCart.js'
import { useAuth } from '../../hooks/useAuth.js'
import { formatCurrency } from '../../utils/formatters/currencyFormatter.js'
import { toast } from 'react-toastify'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleQuantityChange = (buildId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(buildId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(buildId, newQuantity)
    }
  }

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      toast.info('Please sign in to proceed to checkout')
      return
    }
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    navigate('/configurator')
  }

  const subtotal = getCartTotal()
  const tax = subtotal * 0.08
  const shipping = 1500
  const total = subtotal + tax + shipping

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Start building your dream car to see it here! Customize your perfect vehicle with our advanced configurator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContinueShopping}
              className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center"
            >
              Start Building Your Car
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/"
              className="btn btn-outline text-lg px-8 py-3"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            Review your customized vehicles before checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
              </span>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear All Items
              </button>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.build._id} className="card p-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* Vehicle Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.build.vehicle.images.main}
                        alt={item.build.vehicle.name}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Vehicle Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.build.vehicle.manufacturer} {item.build.vehicle.model}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {item.build.name} • {item.build.selectedColor?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary-600">
                            {formatCurrency(item.build.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-500">each</div>
                        </div>
                      </div>

                      {/* Options Summary */}
                      <div className="text-sm text-gray-600 mb-4">
                        {item.build.selectedOptions.length > 0 && (
                          <span>{item.build.selectedOptions.length} options • </span>
                        )}
                        {item.build.selectedPackages.length > 0 && (
                          <span>{item.build.selectedPackages.length} packages</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.build._id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.build._id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(item.build.totalPrice * item.quantity)}
                          </div>
                          <button
                            onClick={() => {
                              removeFromCart(item.build._id)
                              toast.success('Item removed from cart')
                            }}
                            className="text-red-600 hover:text-red-700 flex items-center space-x-1 text-sm mt-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContinueShopping}
                className="btn btn-outline flex-1"
              >
                Continue Building
              </button>
              <Link
                to="/"
                className="btn btn-outline flex-1 text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping & Delivery</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                
                <hr className="my-3" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full btn btn-primary py-3 text-lg font-semibold mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Secure checkout</span>
                </div>
                <p>Your payment information is encrypted and secure</p>
              </div>

              {/* Additional Info */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Manufacturer warranty included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>

            {/* Financing Option */}
            <div className="card p-6 mt-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Financing Available</h3>
              <p className="text-blue-800 text-sm mb-3">
                Get approved for financing and drive away today. Monthly payments as low as {formatCurrency(total * 0.02)}/mo.
              </p>
              <button className="text-blue-700 hover:text-blue-800 text-sm font-medium">
                Learn more about financing options →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
import React from 'react'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../../../hooks/useCart.js'
import { useAuth } from '../../../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Start building your dream car to see it here!</p>
        <button
          onClick={() => navigate('/configurator')}
          className="btn btn-primary"
        >
          Start Building
        </button>
      </div>
    )
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.build._id} className="card p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.build.vehicle.images.main}
                  alt={item.build.vehicle.name}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-grow">
                  <h3 className="font-semibold">
                    {item.build.vehicle.manufacturer} {item.build.vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.build.name} • {item.build.selectedColor?.name}
                  </p>
                  <div className="text-lg font-bold text-primary-600">
                    {formatCurrency(item.build.totalPrice)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.build._id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.build._id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item.build._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax</span>
                <span>{formatCurrency(getCartTotal() * 0.08)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(1500)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(getCartTotal() * 1.08 + 1500)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full btn btn-primary"
            >
              Proceed to Checkout
            </button>
            
            <button
              onClick={() => navigate('/configurator')}
              className="w-full btn btn-outline mt-3"
            >
              Continue Building
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
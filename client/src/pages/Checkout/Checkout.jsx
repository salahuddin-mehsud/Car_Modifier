import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck, MapPin } from 'lucide-react'
import { useCart } from '../../hooks/useCart.js'
import { useAuth } from '../../hooks/useAuth.js'
import { orderService } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/formatters/currencyFormatter.js'
import { toast } from 'react-toastify'

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, setOrder } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    // Shipping Address
    shippingFirstName: user?.firstName || '',
    shippingLastName: user?.lastName || '',
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'United States',
    shippingPhone: '',

    // Billing Address
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',

    // Payment
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',

    // Financing (optional)
    useFinancing: false,
    loanAmount: getCartTotal(),
    downPayment: 0,
    interestRate: 5.5,
    termMonths: 60
  })

  const [loading, setLoading] = useState(false)

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // If sameAsShipping is checked, copy shipping to billing
    if (name === 'sameAsShipping' && checked) {
      setFormData(prev => ({
        ...prev,
        billingFirstName: prev.shippingFirstName,
        billingLastName: prev.shippingLastName,
        billingStreet: prev.shippingStreet,
        billingCity: prev.shippingCity,
        billingState: prev.shippingState,
        billingZipCode: prev.shippingZipCode
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // For demo purposes, we'll use the first build in cart
      const build = cartItems[0].build

      const orderData = {
        buildId: build._id,
        shippingAddress: {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          street: formData.shippingStreet,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
          country: formData.shippingCountry,
          phone: formData.shippingPhone
        },
        billingAddress: formData.sameAsShipping ? undefined : {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.shippingCountry
        },
        paymentMethod: formData.paymentMethod,
        financing: formData.useFinancing ? {
          loanAmount: formData.loanAmount,
          downPayment: formData.downPayment,
          interestRate: formData.interestRate,
          termMonths: formData.termMonths
        } : undefined
      }

      const order = await orderService.createOrder(orderData)
      setOrder(order)
      clearCart()
      navigate('/order-confirmation')
      
    } catch (error) {
      toast.error('Failed to place order: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getCartTotal()
  const tax = subtotal * 0.08
  const shipping = 1500
  const total = subtotal + tax + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Address */}
            <section className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="shippingFirstName"
                  value={formData.shippingFirstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input"
                  required
                />
                <input
                  name="shippingLastName"
                  value={formData.shippingLastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="input"
                  required
                />
              </div>

              <input
                name="shippingStreet"
                value={formData.shippingStreet}
                onChange={handleChange}
                placeholder="Street Address"
                className="input mt-4"
                required
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  placeholder="City"
                  className="input"
                  required
                />
                <input
                  name="shippingState"
                  value={formData.shippingState}
                  onChange={handleChange}
                  placeholder="State"
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  name="shippingZipCode"
                  value={formData.shippingZipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                  className="input"
                  required
                />
                <input
                  name="shippingPhone"
                  value={formData.shippingPhone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="input"
                  required
                />
              </div>
            </section>

            {/* Billing Address */}
            <section className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Billing Address</h2>
              </div>

              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  name="sameAsShipping"
                  checked={formData.sameAsShipping}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Same as shipping address</span>
              </label>

              {!formData.sameAsShipping && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="billingFirstName"
                      value={formData.billingFirstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="input"
                      required
                    />
                    <input
                      name="billingLastName"
                      value={formData.billingLastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="input"
                      required
                    />
                  </div>

                  <input
                    name="billingStreet"
                    value={formData.billingStreet}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="input"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleChange}
                      placeholder="City"
                      className="input"
                      required
                    />
                    <input
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleChange}
                      placeholder="State"
                      className="input"
                      required
                    />
                  </div>

                  <input
                    name="billingZipCode"
                    value={formData.billingZipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="input"
                    required
                  />
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>

                {formData.paymentMethod.includes('card') && (
                  <>
                    <input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="Card Number"
                      className="input"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="input"
                        required
                      />
                      <input
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="CVV"
                        className="input"
                        required
                      />
                    </div>
                    <input
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleChange}
                      placeholder="Name on Card"
                      className="input"
                      required
                    />
                  </>
                )}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg"
            >
              {loading ? 'Processing...' : `Place Order - ${formatCurrency(total)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.build._id} className="flex items-center space-x-3">
                  <img
                    src={item.build.vehicle.images.main}
                    alt={item.build.vehicle.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {item.build.vehicle.manufacturer} {item.build.vehicle.model}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.build.selectedColor?.name}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(item.build.totalPrice)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
import React, { createContext, useContext, useState, useEffect } from 'react'

// ✅ export CartContext so useCart.js can import it
export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('carCustomizerCart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('carCustomizerCart')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('carCustomizerCart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (build) => {
    const existingItem = cartItems.find(item => item.build._id === build._id)

    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item.build._id === build._id
            ? { ...item, quantity: item.quantity + 1, updatedAt: new Date() }
            : item
        )
      )
    } else {
      setCartItems(items => [...items, {
        build,
        quantity: 1,
        addedAt: new Date(),
        updatedAt: new Date()
      }])
    }
  }

  const removeFromCart = (buildId) => {
    setCartItems(items => items.filter(item => item.build._id !== buildId))
  }

  const updateQuantity = (buildId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(buildId)
      return
    }

    setCartItems(items =>
      items.map(item =>
        item.build._id === buildId
          ? { ...item, quantity, updatedAt: new Date() }
          : item
      )
    )
  }

  const clearCart = () => setCartItems([])

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + (item.build.totalPrice * item.quantity), 0)

  const getCartItemsCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0)

  const isInCart = (buildId) =>
    cartItems.some(item => item.build._id === buildId)

  const getCartItem = (buildId) =>
    cartItems.find(item => item.build._id === buildId)

  const setOrder = (order) => {
    setCurrentOrder(order)
    clearCart()
  }

  const value = {
    cartItems,
    currentOrder,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem,
    setOrder
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header/Header.jsx'
import Footer from './components/common/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Configurator from './pages/Configurator/Configurator.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Cart from './pages/Cart/Cart.jsx' // ✅ Added Cart import
import Checkout from './pages/Checkout/Checkout.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation.jsx'
import { useAuth } from './hooks/useAuth.js'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/configurator/:buildId" element={<Configurator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} /> {/* ✅ Added Cart route */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
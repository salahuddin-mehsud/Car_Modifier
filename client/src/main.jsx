import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ConfiguratorProvider } from './contexts/ConfiguratorContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfiguratorProvider>
          <CartProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </ConfiguratorProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
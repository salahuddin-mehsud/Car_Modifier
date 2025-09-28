import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Car, Settings, Zap, Shield } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'Easy Customization',
      description: 'Choose from thousands of options to create your perfect vehicle'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Real-time Pricing',
      description: 'See instant price updates as you customize your dream car'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Checkout',
      description: 'Safe and secure payment processing for your peace of mind'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br bg-black from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build Your Dream Car
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Customize every detail of your perfect vehicle with our advanced configurator. 
            See real-time pricing and financing options as you build.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
            <Link to="/configurator" className="btn flex items-center justify-center bg-green-400 text-primary-600 hover:bg-gray-100 hover:text-black text-lg px-8 py-3">
              Build Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/dashboard" className="btn bg-transparent hover:text-black border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3">
              View My Builds
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AutoCustomizer?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make car customization simple, transparent, and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Car className="h-16 w-16 text-primary-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've built their dream cars with us
          </p>
          <Link to="/configurator" className="btn btn-primary text-lg px-8 py-3">
            Build Your Dream Car Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ShoppingCart, Eye, Grid } from 'lucide-react'
import { useConfigurator } from '../../hooks/useConfigurator.js'
import { useCart } from '../../hooks/useCart.js'
import { useAuth } from '../../hooks/useAuth.js'
import VehicleSelector from '../../components/configurator/VehicleSelector/VehicleSelector.jsx'
import ColorPicker from '../../components/configurator/ColorPicker/ColorPicker.jsx'
import PackageSelector from '../../components/configurator/PackageSelector/PackageSelector.jsx'
import WheelSelector from '../../components/configurator/WheelSelector/WheelSelector.jsx'
import InteriorCustomizer from '../../components/configurator/InteriorCustomizer/InteriorCustomizer.jsx'
import ModelViewer from '../../components/configurator/ModelViewer/ModelViewer.jsx'
import PriceSummary from '../../components/finance/PriceSummary/PriceSummary.jsx'
import EMICalculator from '../../components/finance/EMICalculator/EMICalculator.jsx'
import Loader from '../../components/common/Loader/Loader.jsx'
import Modal from '../../components/common/Modal/Modal.jsx'
import { toast } from 'react-toastify'

const Configurator = () => {
  const { buildId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { currentBuild, saveBuild, loading } = useConfigurator()
  const { addToCart } = useCart()
  
  const [activeTab, setActiveTab] = useState('vehicle')
  const [viewMode, setViewMode] = useState('3d') // '3d' or '2d'
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [buildName, setBuildName] = useState('')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'vehicle', label: 'Vehicle', icon: '🚗' },
    { id: 'color', label: 'Exterior', icon: '🎨' },
    { id: 'wheels', label: 'Wheels', icon: '⚙️' },
    { id: 'interior', label: 'Interior', icon: '💺' },
    { id: 'packages', label: 'Packages', icon: '📦' },
  ]

  const getActiveComponent = () => {
    switch (activeTab) {
      case 'vehicle': return VehicleSelector
      case 'color': return ColorPicker
      case 'wheels': return WheelSelector
      case 'interior': return InteriorCustomizer
      case 'packages': return PackageSelector
      default: return VehicleSelector
    }
  }

  const ActiveComponent = getActiveComponent()

  const handleSaveBuild = async () => {
    if (!buildName.trim()) {
      toast.error('Please enter a name for your build')
      return
    }

    setSaving(true)
    try {
      await saveBuild(buildName)
      toast.success('Build saved successfully!')
      setSaveModalOpen(false)
      setBuildName('')
    } catch (error) {
      toast.error('Failed to save build: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddToCart = () => {
    if (!currentBuild.vehicle) {
      toast.error('Please select a vehicle first')
      return
    }

    const buildData = {
      _id: Date.now().toString(),
      name: buildName || `My ${currentBuild.vehicle.manufacturer} Build`,
      vehicle: currentBuild.vehicle,
      selectedColor: currentBuild.selectedColor,
      selectedOptions: currentBuild.selectedOptions,
      selectedPackages: currentBuild.selectedPackages,
      basePrice: currentBuild.pricing?.basePrice || 0,
      totalPrice: currentBuild.pricing?.totalPrice || 0
    }

    addToCart(buildData)
    toast.success('Build added to cart!')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Vehicle Configurator</h1>
            <p className="text-gray-600">
              Customize your dream car step by step. See real-time 3D updates as you make changes.
            </p>
          </div>

          {/* 3D/2D View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  viewMode === '3d'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                3D View
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  viewMode === '2d'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Grid className="h-4 w-4 inline mr-2" />
                2D View
              </button>
            </div>
          </div>

          {/* 3D Model Viewer or Image */}
          <div className="mb-8">
            {viewMode === '3d' ? (
              <ModelViewer />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                {currentBuild.vehicle ? (
                  <img
                    src={currentBuild.vehicle.images.main}
                    alt={currentBuild.vehicle.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">📷</div>
                    <p>Select a vehicle to view</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Active Component */}
          <div className="mb-8">
            <ActiveComponent />
          </div>

          {/* EMI Calculator */}
          {currentBuild.pricing && (
            <div className="mb-8">
              <EMICalculator vehiclePrice={currentBuild.pricing.totalPrice} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <PriceSummary />
          
          {/* Action Buttons */}
          <div className="card p-6 space-y-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setSaveModalOpen(true)}
                  disabled={!currentBuild.vehicle}
                  className="w-full btn btn-outline flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Build</span>
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!currentBuild.vehicle}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Sign in to save your build and add to cart
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn btn-primary"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Build Modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Your Build"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Build Name
            </label>
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="e.g., My Dream Tesla Build"
              className="input"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setSaveModalOpen(false)}
              className="flex-1 btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBuild}
              disabled={saving || !buildName.trim()}
              className="flex-1 btn btn-primary"
            >
              {saving ? <Loader size="sm" /> : 'Save Build'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Configurator
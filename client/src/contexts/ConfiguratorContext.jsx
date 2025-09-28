import React, { createContext, useContext, useState, useEffect } from 'react'
import { vehicleService } from '../services/vehicleService.js'
import { configuratorService } from '../services/configuratorService.js'

const ConfiguratorContext = createContext()

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext)
  if (!context) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider')
  }
  return context
}

export const ConfiguratorProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([])
  const [options, setOptions] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentBuild, setCurrentBuild] = useState({
    vehicle: null,
    selectedColor: null,
    selectedOptions: [],
    selectedPackages: [],
    pricing: null
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [vehiclesData, optionsData, packagesData] = await Promise.all([
        vehicleService.getVehicles(),
        vehicleService.getOptions(),
        vehicleService.getPackages()
      ])
      setVehicles(vehiclesData)
      setOptions(optionsData)
      setPackages(packagesData)
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectVehicle = (vehicle) => {
    const newBuild = {
      ...currentBuild,
      vehicle,
      selectedColor: vehicle.availableColors?.[0] || null,
      selectedOptions: [],
      selectedPackages: []
    }
    setCurrentBuild(newBuild)
    calculatePrice(newBuild)
  }

  const selectColor = (color) => {
    const newBuild = {
      ...currentBuild,
      selectedColor: color
    }
    setCurrentBuild(newBuild)
    calculatePrice(newBuild)
  }

  const toggleOption = (option) => {
    const isSelected = currentBuild.selectedOptions.some(opt => opt._id === option._id)
    let newOptions
    
    if (isSelected) {
      newOptions = currentBuild.selectedOptions.filter(opt => opt._id !== option._id)
    } else {
      newOptions = [...currentBuild.selectedOptions, { ...option, quantity: 1 }]
    }

    const newBuild = {
      ...currentBuild,
      selectedOptions: newOptions
    }
    setCurrentBuild(newBuild)
    calculatePrice(newBuild)
  }

  const togglePackage = (pkg) => {
    const isSelected = currentBuild.selectedPackages.some(selectedPkg => selectedPkg._id === pkg._id)
    let newPackages
    
    if (isSelected) {
      // Remove package and its included options
      newPackages = currentBuild.selectedPackages.filter(selectedPkg => selectedPkg._id !== pkg._id)
      
      // Remove options that were included in this package
      const packageOptionIds = new Set(pkg.includedOptions?.map(inc => inc.option?._id) || [])
      const newOptions = currentBuild.selectedOptions.filter(opt => 
        !packageOptionIds.has(opt._id)
      )
      
      const newBuild = {
        ...currentBuild,
        selectedPackages: newPackages,
        selectedOptions: newOptions
      }
      setCurrentBuild(newBuild)
      calculatePrice(newBuild)
    } else {
      // Add package and its included options
      newPackages = [...currentBuild.selectedPackages, pkg]
      
      // Add package options that aren't already selected
      const existingOptionIds = new Set(currentBuild.selectedOptions.map(opt => opt._id))
      const newPackageOptions = pkg.includedOptions?.filter(inc => 
        inc.option && !existingOptionIds.has(inc.option._id)
      ).map(inc => ({
        ...inc.option,
        quantity: inc.quantity || 1
      })) || []
      
      const newOptions = [...currentBuild.selectedOptions, ...newPackageOptions]
      
      const newBuild = {
        ...currentBuild,
        selectedPackages: newPackages,
        selectedOptions: newOptions
      }
      setCurrentBuild(newBuild)
      calculatePrice(newBuild)
    }
  }

  const calculatePrice = async (build) => {
    if (!build.vehicle) return

    try {
      const pricing = await configuratorService.calculatePrice({
        vehicleId: build.vehicle._id,
        selectedOptions: build.selectedOptions,
        selectedPackages: build.selectedPackages,
        selectedColor: build.selectedColor
      })
      
      setCurrentBuild(prev => ({
        ...prev,
        pricing
      }))
    } catch (error) {
      console.error('Error calculating price:', error)
    }
  }

  const saveBuild = async (name) => {
    if (!currentBuild.vehicle) throw new Error('No vehicle selected')
    
    const buildData = {
      name,
      vehicleId: currentBuild.vehicle._id,
      selectedOptions: currentBuild.selectedOptions,
      selectedPackages: currentBuild.selectedPackages,
      selectedColor: currentBuild.selectedColor,
      configuration: currentBuild
    }

    return await configuratorService.saveBuild(buildData)
  }

  const loadBuild = (build) => {
    setCurrentBuild({
      vehicle: build.vehicle,
      selectedColor: build.selectedColor,
      selectedOptions: build.selectedOptions || [],
      selectedPackages: build.selectedPackages || [],
      pricing: {
        basePrice: build.basePrice,
        totalPrice: build.totalPrice
      }
    })
  }

  const resetBuild = () => {
    setCurrentBuild({
      vehicle: null,
      selectedColor: null,
      selectedOptions: [],
      selectedPackages: [],
      pricing: null
    })
  }

  const getCompatiblePackages = () => {
    if (!currentBuild.vehicle) return packages
    
    return packages.filter(pkg => 
      !pkg.compatibleVehicles || 
      pkg.compatibleVehicles.length === 0 ||
      pkg.compatibleVehicles.some(vehicle => vehicle._id === currentBuild.vehicle._id)
    )
  }

  const value = {
    vehicles,
    options,
    packages: getCompatiblePackages(),
    loading,
    currentBuild,
    selectVehicle,
    selectColor,
    toggleOption,
    togglePackage,
    saveBuild,
    loadBuild,
    resetBuild,
    getCompatiblePackages
  }

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  )
}

export { ConfiguratorContext }
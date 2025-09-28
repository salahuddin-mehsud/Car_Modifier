import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useConfigurator } from '../../../hooks/useConfigurator.js'
import { 
  VEHICLE_MODELS, 
  WHEEL_MODELS, 
  COLOR_TEXTURES, 
  VEHICLE_MODEL_MAPPING,
  FALLBACK_MODEL 
} from '../../../utils/constants/vehicleModels.js'
import { checkFileExists } from '../../../utils/helpers/assetHelper.js'
import Loader from '../../common/Loader/Loader.jsx'

const ModelViewer = () => {
  const mountRef = useRef(null)
  const sceneRef = useRef(new THREE.Scene())
  const { currentBuild } = useConfigurator()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentModelPath, setCurrentModelPath] = useState('')
  
  const carModelRef = useRef(null)
  const wheelModelsRef = useRef({})
  const currentWheelTypeRef = useRef('standard')

  useEffect(() => {
    if (!mountRef.current) return

    const scene = sceneRef.current
    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    // Clear previous scene
    while(scene.children.length > 0) { 
      scene.remove(scene.children[0]) 
    }

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(5, 2, 5)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Simple background
    scene.background = new THREE.Color(0xf8fafc)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 3
    controls.maxDistance = 15

    // Add to DOM
    if (mountRef.current.children.length > 0) {
      mountRef.current.removeChild(mountRef.current.children[0])
    }
    mountRef.current.appendChild(renderer.domElement)

    // Load wheel models
    loadWheelModels()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Load car when vehicle changes
  useEffect(() => {
    if (currentBuild.vehicle) {
      loadCarModel()
    } else {
      setLoading(false)
    }
  }, [currentBuild.vehicle])

  // Apply color when color changes
  useEffect(() => {
    if (carModelRef.current && currentBuild.selectedColor) {
      applyColorToModel(currentBuild.selectedColor)
    }
  }, [currentBuild.selectedColor])

  const getVehicleModelKey = (vehicle) => {
    return VEHICLE_MODEL_MAPPING[vehicle.name] || 
           VEHICLE_MODEL_MAPPING[vehicle.model] || 
           'car1'
  }

  const getActualModelPath = async (intendedPath) => {
    // First check if the intended path exists
    if (await checkFileExists(intendedPath)) {
      return intendedPath
    }
    
    // Try alternative paths
    const alternatives = [
      intendedPath,
      intendedPath.replace('/models/', '/assets/'),
      intendedPath.replace('/models/', '/src/assets/'),
      intendedPath.replace('cars/', ''),
      intendedPath.replace('wheels/', '')
    ]
    
    for (const altPath of alternatives) {
      if (await checkFileExists(altPath)) {
        console.log(`Found model at alternative path: ${altPath}`)
        return altPath
      }
    }
    
    // Fallback to car1
    console.warn(`Model not found at ${intendedPath}, using fallback`)
    return FALLBACK_MODEL.modelPath
  }

  const loadCarModel = async () => {
    if (!currentBuild.vehicle) return

    setLoading(true)
    setError(null)

    try {
      const modelKey = getVehicleModelKey(currentBuild.vehicle)
      const modelConfig = VEHICLE_MODELS[modelKey]
      
      if (!modelConfig) {
        throw new Error(`Model configuration not found for: ${modelKey}`)
      }

      // Get the actual working path
      const actualModelPath = await getActualModelPath(modelConfig.modelPath)
      setCurrentModelPath(actualModelPath)

      const loader = new GLTFLoader()
      
      // Add error handling for the loader
      loader.load(
        actualModelPath,
        (gltf) => {
          // Remove previous car model
          if (carModelRef.current) {
            sceneRef.current.remove(carModelRef.current)
          }

          const model = gltf.scene
          carModelRef.current = model

          // Enable shadows and apply settings
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              
              // Apply initial color if selected
              if (currentBuild.selectedColor) {
                applyColorToMesh(child, currentBuild.selectedColor)
              }
            }
          })

          // Position and scale model
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())

          model.position.x = -center.x
          model.position.y = -center.y
          model.position.z = -center.z

          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = (5 / maxDim) * (modelConfig.scale || 1)
          model.scale.setScalar(scale)

          sceneRef.current.add(model)
          
          // Try to attach wheels
          setTimeout(() => {
            attachWheelsToCar(currentWheelTypeRef.current)
          }, 100)
          
          setLoading(false)
          console.log('Model loaded successfully:', actualModelPath)
        },
        (progress) => {
          console.log(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(0)}%`)
        },
        (error) => {
          console.error('GLTFLoader error:', error)
          setError(`Failed to load 3D model. The file might be missing or corrupted.`)
          setLoading(false)
        }
      )
    } catch (err) {
      console.error('Model loading error:', err)
      setError(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  const loadWheelModels = async () => {
    const wheelTypes = Object.keys(WHEEL_MODELS)
    
    for (const wheelType of wheelTypes) {
      try {
        const wheelConfig = WHEEL_MODELS[wheelType]
        const actualPath = await getActualModelPath(wheelConfig.modelPath)
        
        const loader = new GLTFLoader()
        loader.load(
          actualPath,
          (gltf) => {
            wheelModelsRef.current[wheelType] = gltf.scene
            console.log(`Loaded wheel model: ${wheelType} from ${actualPath}`)
          },
          null,
          (error) => {
            console.warn(`Could not load ${wheelType} wheels:`, error)
          }
        )
      } catch (error) {
        console.warn(`Failed to load ${wheelType} wheels:`, error)
      }
    }
  }

  const applyColorToModel = (color) => {
    if (!carModelRef.current) return

    carModelRef.current.traverse((child) => {
      if (child.isMesh) {
        applyColorToMesh(child, color)
      }
    })
  }

  const applyColorToMesh = (mesh, color) => {
    // For now, use solid colors instead of textures to simplify
    const threeColor = new THREE.Color(color.code || '#666666')
    if (mesh.material) {
      mesh.material.color = threeColor
      mesh.material.needsUpdate = true
    }
  }

  const attachWheelsToCar = (wheelType) => {
    if (!carModelRef.current) {
      console.log('Car model not ready for wheels')
      return
    }

    if (!wheelModelsRef.current[wheelType]) {
      console.log(`Wheel model ${wheelType} not loaded yet`)
      return
    }

    // Remove existing wheels
    sceneRef.current.children.forEach(child => {
      if (child.userData && child.userData.isWheel) {
        sceneRef.current.remove(child)
      }
    })

    const modelKey = getVehicleModelKey(currentBuild.vehicle)
    const vehicleConfig = VEHICLE_MODELS[modelKey] || FALLBACK_MODEL

    // Attach wheels at default positions
    vehicleConfig.wheelPositions.forEach((wheelPos) => {
      try {
        const wheelModel = wheelModelsRef.current[wheelType].clone()
        wheelModel.position.set(...wheelPos.position)
        wheelModel.scale.setScalar((vehicleConfig.scale || 1) * 0.3)
        wheelModel.userData = { isWheel: true, wheelType: wheelType }
        
        wheelModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        sceneRef.current.add(wheelModel)
      } catch (error) {
        console.warn(`Failed to attach wheel at position ${wheelPos.name}:`, error)
      }
    })

    console.log(`Attached ${wheelType} wheels`)
  }

  if (!currentBuild.vehicle) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🚗</div>
          <p>Select a vehicle to view 3D model</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden border border-gray-300">
      <div ref={mountRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            <Loader size="lg" />
            <p className="mt-2 text-gray-600">Loading 3D model...</p>
            {currentModelPath && (
              <p className="text-xs text-gray-500 mt-1">Path: {currentModelPath}</p>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center text-red-600 max-w-md p-4">
            <div className="text-4xl mb-2">⚠️</div>
            <h3 className="font-semibold mb-2">3D Model Loading Error</h3>
            <p className="text-sm mb-4">{error}</p>
            <div className="text-xs text-gray-600 mb-4">
              <div>Vehicle: {currentBuild.vehicle.name}</div>
              <div>Model Key: {getVehicleModelKey(currentBuild.vehicle)}</div>
              <div>Attempted Path: {currentModelPath}</div>
            </div>
            <button 
              onClick={() => loadCarModel()}
              className="btn btn-outline btn-sm"
            >
              Retry Loading
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white bg-opacity-80 px-2 py-1 rounded">
        🖱️ Drag to rotate • Scroll to zoom
      </div>

      <div className="absolute top-4 left-4 text-sm bg-black bg-opacity-60 text-white px-3 py-2 rounded">
        {currentBuild.vehicle.manufacturer} {currentBuild.vehicle.model}
      </div>
    </div>
  )
}

export default ModelViewer
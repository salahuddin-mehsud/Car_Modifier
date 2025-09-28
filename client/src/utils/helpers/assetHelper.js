// Helper to get correct asset paths for both development and production
export const getAssetPath = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Check if we're in development mode and adjust paths accordingly
  if (import.meta.env.DEV) {
    return `/${cleanPath}`
  }
  
  return `/${cleanPath}`
}

// Specific path helpers for different asset types
export const getModelPath = (filename) => {
  return getAssetPath(`models/${filename}`)
}

export const getTexturePath = (filename) => {
  return getAssetPath(`textures/${filename}`)
}

export const getImagePath = (filename) => {
  return getAssetPath(`images/${filename}`)
}

// Test if a file exists by making a HEAD request
export const checkFileExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    return false
  }
}
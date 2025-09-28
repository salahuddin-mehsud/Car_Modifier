import { useContext } from 'react'
import { ConfiguratorContext } from '../contexts/ConfiguratorContext.jsx'

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext)
  if (!context) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider')
  }
  return context
}
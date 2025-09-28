import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Car, 
  ShoppingCart, 
  Save, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  User,
  Clock
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { configuratorService } from '../../services/configuratorService.js'
import { orderService } from '../../services/orderService.js'
import { pdfService } from '../../services/pdfService.js'
import Loader from '../../components/common/Loader/Loader.jsx'
import Modal from '../../components/common/Modal/Modal.jsx'
import { formatCurrency } from '../../utils/formatters/currencyFormatter.js'
import { formatDate } from '../../utils/formatters/dateFormatter.js'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('builds')
  const [builds, setBuilds] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [buildToDelete, setBuildToDelete] = useState(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const [buildsData, ordersData] = await Promise.all([
        configuratorService.getUserBuilds(),
        orderService.getUserOrders()
      ])
      setBuilds(buildsData)
      setOrders(ordersData)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBuild = async () => {
    if (!buildToDelete) return

    try {
      await configuratorService.deleteBuild(buildToDelete._id)
      setBuilds(builds.filter(build => build._id !== buildToDelete._id))
      toast.success('Build deleted successfully')
      setDeleteModalOpen(false)
      setBuildToDelete(null)
    } catch (error) {
      toast.error('Failed to delete build')
    }
  }

  const generateBuildReport = async (buildId) => {
    try {
      const pdfUrl = await pdfService.generateBuildReport(buildId)
      // Create a temporary link to download the PDF
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `build-report-${buildId}.pdf`
      link.click()
      toast.success('Build report downloaded')
    } catch (error) {
      toast.error('Failed to generate report')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-96">
          <Loader size="lg" />
        </div>
      </div>
    )
  }

  const stats = [
    {
      icon: <Save className="h-6 w-6" />,
      label: 'Saved Builds',
      value: builds.length,
      color: 'bg-blue-500'
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      label: 'Total Orders',
      value: orders.length,
      color: 'bg-green-500'
    },
    {
      icon: <Car className="h-6 w-6" />,
      label: 'Vehicles Customized',
      value: new Set(builds.map(build => build.vehicle?.model)).size,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-gray-600">Manage your builds, orders, and account settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'builds', label: 'My Builds', icon: <Car className="h-4 w-4" /> },
            { id: 'orders', label: 'Orders', icon: <ShoppingCart className="h-4 w-4" /> },
            { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Builds Tab */}
      {activeTab === 'builds' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Saved Builds</h2>
            <Link to="/configurator" className="btn btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Build</span>
            </Link>
          </div>

          {builds.length === 0 ? (
            <div className="card p-12 text-center">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved builds yet</h3>
              <p className="text-gray-600 mb-4">Start building your dream car to see it here!</p>
              <Link to="/configurator" className="btn btn-primary">
                Start Building
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {builds.map((build) => (
                <div key={build._id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{build.name}</h3>
                      <p className="text-gray-600">
                        {build.vehicle?.manufacturer} {build.vehicle?.model}
                      </p>
                    </div>
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                      {formatCurrency(build.totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={build.vehicle?.images.main}
                      alt={build.vehicle?.name}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">
                        Color: {build.selectedColor?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {build.selectedOptions.length} options • {build.selectedPackages.length} packages
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatDate(build.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Link
                      to={`/configurator/${build._id}`}
                      className="flex-1 btn btn-outline btn-sm flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => generateBuildReport(build._id)}
                      className="flex-1 btn btn-outline btn-sm flex items-center justify-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setBuildToDelete(build)
                        setDeleteModalOpen(true)
                      }}
                      className="btn btn-outline btn-sm text-red-600 hover:bg-red-50 flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Order History</h2>

          {orders.length === 0 ? (
            <div className="card p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Complete a build and place an order to see it here!</p>
              <Link to="/configurator" className="btn btn-primary">
                Start Building
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={order.customBuild?.vehicle?.images.main}
                      alt={order.customBuild?.vehicle?.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">
                        {order.customBuild?.vehicle?.manufacturer} {order.customBuild?.vehicle?.model}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.customBuild?.selectedColor?.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-primary-600">
                      {formatCurrency(order.pricing.total)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => pdfService.generateOrderInvoice(order._id)}
                        className="btn btn-outline btn-sm flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Invoice</span>
                      </button>
                      <Link
                        to={`/order-confirmation/${order._id}`}
                        className="btn btn-outline btn-sm flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="input bg-gray-50">{user?.firstName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="input bg-gray-50">{user?.lastName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="input bg-gray-50">{user?.email}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Account Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Since
                    </label>
                    <div className="input bg-gray-50">
                      {formatDate(user?.createdAt)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Login
                    </label>
                    <div className="input bg-gray-50">
                      {user?.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Status
                    </label>
                    <div className="input bg-gray-50">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user?.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-4">Preferences</h3>
              <div className="flex space-x-4">
                <button className="btn btn-outline">Change Password</button>
                <button className="btn btn-outline">Update Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Build"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the build "{buildToDelete?.name}"? 
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1 btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteBuild}
              className="flex-1 btn btn-primary bg-red-600 hover:bg-red-700"
            >
              Delete Build
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard
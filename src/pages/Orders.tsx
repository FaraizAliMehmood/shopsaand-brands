import { useState } from 'react'

interface OrderItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image?: string
  category: string
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  orderDate: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  items: number
  shippingAddress: string
  orderItems: OrderItem[]
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table')
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Order>>({})

  // Sample data - replace with actual data from API
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      orderDate: '2024-01-15',
      status: 'pending',
      totalAmount: 299.99,
      items: 3,
      shippingAddress: '123 Main St, City, State 12345',
      orderItems: [
        {
          id: 'ITEM-001',
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 199.99,
          quantity: 1,
          category: 'Electronics'
        },
        {
          id: 'ITEM-002',
          name: 'Smart Watch',
          description: 'Fitness tracking smartwatch with heart rate monitor',
          price: 89.99,
          quantity: 1,
          category: 'Electronics'
        },
        {
          id: 'ITEM-003',
          name: 'Phone Case',
          description: 'Protective silicone phone case',
          price: 9.99,
          quantity: 1,
          category: 'Accessories'
        }
      ]
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      orderDate: '2024-01-14',
      status: 'processing',
      totalAmount: 149.50,
      items: 2,
      shippingAddress: '456 Oak Ave, City, State 12345',
      orderItems: [
        {
          id: 'ITEM-004',
          name: 'Laptop Stand',
          description: 'Adjustable aluminum laptop stand',
          price: 79.99,
          quantity: 1,
          category: 'Office'
        },
        {
          id: 'ITEM-005',
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse with USB receiver',
          price: 69.51,
          quantity: 1,
          category: 'Electronics'
        }
      ]
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike.j@email.com',
      orderDate: '2024-01-13',
      status: 'shipped',
      totalAmount: 89.99,
      items: 1,
      shippingAddress: '789 Pine Rd, City, State 12345',
      orderItems: [
        {
          id: 'ITEM-006',
          name: 'Bluetooth Speaker',
          description: 'Portable waterproof Bluetooth speaker',
          price: 89.99,
          quantity: 1,
          category: 'Electronics'
        }
      ]
    },
    {
      id: 'ORD-004',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.w@email.com',
      orderDate: '2024-01-12',
      status: 'delivered',
      totalAmount: 199.99,
      items: 4,
      shippingAddress: '321 Elm St, City, State 12345',
      orderItems: [
        {
          id: 'ITEM-007',
          name: 'Coffee Maker',
          description: 'Programmable drip coffee maker',
          price: 89.99,
          quantity: 1,
          category: 'Kitchen'
        },
        {
          id: 'ITEM-008',
          name: 'Coffee Beans',
          description: 'Premium dark roast coffee beans (2lb)',
          price: 24.99,
          quantity: 2,
          category: 'Food'
        },
        {
          id: 'ITEM-009',
          name: 'Coffee Filters',
          description: 'Bamboo coffee filters (100 count)',
          price: 9.99,
          quantity: 1,
          category: 'Kitchen'
        },
        {
          id: 'ITEM-010',
          name: 'Coffee Mug Set',
          description: 'Set of 4 ceramic coffee mugs',
          price: 24.99,
          quantity: 1,
          category: 'Kitchen'
        }
      ]
    },
    {
      id: 'ORD-005',
      customerName: 'David Brown',
      customerEmail: 'david.b@email.com',
      orderDate: '2024-01-11',
      status: 'cancelled',
      totalAmount: 75.00,
      items: 2,
      shippingAddress: '654 Maple Dr, City, State 12345',
      orderItems: [
        {
          id: 'ITEM-011',
          name: 'Desk Lamp',
          description: 'LED desk lamp with adjustable brightness',
          price: 45.00,
          quantity: 1,
          category: 'Office'
        },
        {
          id: 'ITEM-012',
          name: 'Notebook Set',
          description: 'Set of 3 spiral notebooks',
          price: 30.00,
          quantity: 1,
          category: 'Office'
        }
      ]
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Changing order ${orderId} status to ${newStatus}`)
    // Implement status change logic here
  }

  const handleViewOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setShowViewModal(true)
    }
  }

  const handleEditOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setEditFormData(order)
      setShowEditModal(true)
    }
  }

  const handleDeleteOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setShowDeleteModal(true)
    }
  }

  const handleSaveEdit = () => {
    console.log('Saving order:', editFormData)
    // Implement save logic here
    setShowEditModal(false)
    setEditFormData({})
    setSelectedOrder(null)
  }

  const handleConfirmDelete = () => {
    console.log('Deleting order:', selectedOrder?.id)
    // Implement delete logic here
    setShowDeleteModal(false)
    setSelectedOrder(null)
  }

  const handleCloseModals = () => {
    setShowViewModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedOrder(null)
    setEditFormData({})
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded-l-lg ${viewMode === 'table' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-r-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {viewMode === 'table' ? (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {order.orderItems && order.orderItems.length > 0 ? (
                          <div className="space-y-1">
                            {order.orderItems.slice(0, 2).map((item) => (
                              <div key={item.id} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="flex justify-between">
                                  <span>Qty: {item.quantity}</span>
                                  <span>${item.price.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                            {order.orderItems.length > 2 && (
                              <div className="text-xs text-gray-500 italic">
                                +{order.orderItems.length - 2} more items
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">No items</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Order"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditOrder(order.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Order"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border border-primary rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Order"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Customer:</span> {order.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {order.customerEmail}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Items:</span> {order.items} | 
                      <span className="font-medium ml-2">Address:</span> {order.shippingAddress}
                    </div>
                    
                    {/* Order Items in List View */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Order Items:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-2 rounded text-xs">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="flex justify-between text-gray-600">
                                <span>Qty: {item.quantity}</span>
                                <span>${item.price.toFixed(2)}</span>
                              </div>
                              <div className="text-gray-500">{item.category}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditOrder(order.id)}
                        className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                      >
                        Edit
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-3 py-2 text-sm border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
      </div>

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedOrder?.id || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder?.status || '')}`}>
                    {selectedOrder?.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'N/A'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <p className="text-gray-900">{selectedOrder?.customerName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                  <p className="text-gray-900">{selectedOrder?.customerEmail || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                  <p className="text-gray-900">{selectedOrder?.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <p className="text-lg font-semibold text-gray-900">${selectedOrder?.totalAmount ? selectedOrder.totalAmount.toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                  <p className="text-gray-900">{selectedOrder?.items || '0'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrder?.shippingAddress || 'N/A'}</p>
              </div>
            </div>
            
            {/* Order Items Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder?.orderItems?.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                          <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Item ID: {item.id}</span>
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: ${item.price.toFixed(2)}</span>
                          <span className="font-semibold text-gray-900">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items found for this order</p>
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              {selectedOrder?.orderItems && selectedOrder.orderItems.length > 0 && (
                <div className="mt-6 bg-white border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Order Total:</span>
                    <span className="text-primary">${selectedOrder?.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                    <span>Items: {selectedOrder?.items || 0}</span>
                    <span>Subtotal: ${selectedOrder?.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Order</h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <input
                    type="text"
                    value={editFormData.id || ''}
                    onChange={(e) => setEditFormData({...editFormData, id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editFormData.status || ''}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editFormData.customerName || ''}
                    onChange={(e) => setEditFormData({...editFormData, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={editFormData.customerEmail || ''}
                    onChange={(e) => setEditFormData({...editFormData, customerEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                  <input
                    type="date"
                    value={editFormData.orderDate || ''}
                    onChange={(e) => setEditFormData({...editFormData, orderDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.totalAmount || ''}
                    onChange={(e) => setEditFormData({...editFormData, totalAmount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                  <input
                    type="number"
                    value={editFormData.items || ''}
                    onChange={(e) => setEditFormData({...editFormData, items: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <textarea
                  value={editFormData.shippingAddress || ''}
                  onChange={(e) => setEditFormData({...editFormData, shippingAddress: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Order</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete order <strong>{selectedOrder.id}</strong>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
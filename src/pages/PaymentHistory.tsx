import { useState } from 'react'

interface PaymentTransaction {
  id: string
  orderId: string
  customerName: string
  customerEmail: string
  amount: number
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  method: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer'
  date: string
  transactionId: string
  processingFee: number
  netAmount: number
  description?: string
}

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null)

  // Sample data - replace with actual data from API
  const [payments] = useState<PaymentTransaction[]>([
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      amount: 299.99,
      status: 'completed',
      method: 'credit_card',
      date: '2024-01-15T10:30:00Z',
      transactionId: 'txn_123456789',
      processingFee: 8.99,
      netAmount: 291.00,
      description: 'Payment for Premium Wireless Headphones order'
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      amount: 149.50,
      status: 'pending',
      method: 'paypal',
      date: '2024-01-14T14:22:00Z',
      transactionId: 'txn_987654321',
      processingFee: 4.48,
      netAmount: 145.02,
      description: 'Payment for Laptop Stand and Wireless Mouse order'
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike.j@email.com',
      amount: 89.99,
      status: 'completed',
      method: 'stripe',
      date: '2024-01-13T09:15:00Z',
      transactionId: 'txn_456789123',
      processingFee: 2.70,
      netAmount: 87.29,
      description: 'Payment for Bluetooth Speaker order'
    },
    {
      id: 'PAY-004',
      orderId: 'ORD-004',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.w@email.com',
      amount: 199.99,
      status: 'completed',
      method: 'credit_card',
      date: '2024-01-12T16:45:00Z',
      transactionId: 'txn_789123456',
      processingFee: 6.00,
      netAmount: 193.99,
      description: 'Payment for Coffee Maker and accessories order'
    },
    {
      id: 'PAY-005',
      orderId: 'ORD-005',
      customerName: 'David Brown',
      customerEmail: 'david.b@email.com',
      amount: 75.00,
      status: 'refunded',
      method: 'paypal',
      date: '2024-01-11T11:20:00Z',
      transactionId: 'txn_321654987',
      processingFee: 0,
      netAmount: 0,
      description: 'Refund for Desk Lamp and Notebook Set order'
    },
    {
      id: 'PAY-006',
      orderId: 'ORD-006',
      customerName: 'Lisa Anderson',
      customerEmail: 'lisa.a@email.com',
      amount: 159.99,
      status: 'failed',
      method: 'credit_card',
      date: '2024-01-10T13:30:00Z',
      transactionId: 'txn_654321987',
      processingFee: 0,
      netAmount: 0,
      description: 'Failed payment for Smart Watch order'
    },
    {
      id: 'PAY-007',
      orderId: 'ORD-007',
      customerName: 'Robert Taylor',
      customerEmail: 'robert.t@email.com',
      amount: 89.99,
      status: 'completed',
      method: 'bank_transfer',
      date: '2024-01-09T08:45:00Z',
      transactionId: 'txn_147258369',
      processingFee: 0.90,
      netAmount: 89.09,
      description: 'Bank transfer for Phone Case order'
    },
    {
      id: 'PAY-008',
      orderId: 'ORD-008',
      customerName: 'Emily Davis',
      customerEmail: 'emily.d@email.com',
      amount: 249.99,
      status: 'completed',
      method: 'stripe',
      date: '2024-01-08T15:10:00Z',
      transactionId: 'txn_963852741',
      processingFee: 7.50,
      netAmount: 242.49,
      description: 'Payment for Premium Headphones and accessories order'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'paypal':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.676c-.95-1.09-2.36-1.66-4.1-1.66H9.95c-.524 0-.968.382-1.05.9L7.78 19.337h4.67c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c2.57 0 4.578-.543 5.69-1.81 1.01-1.15 1.304-2.42 1.012-4.287z"/>
          </svg>
        )
      case 'stripe':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.778 6.766 2.254V2.91c-2.04-1.258-4.515-1.903-6.766-1.903-5.451 0-8.31 2.776-8.31 6.833 0 3.524 2.214 5.51 5.451 6.833 2.172.806 3.356 1.426 3.356 2.409 0 .831-.683 1.305-1.901 1.305-2.227 0-4.515-.778-6.766-2.254v4.289c2.04 1.258 4.515 1.903 6.766 1.903 5.451 0 8.31-2.776 8.31-6.833 0-3.524-2.214-5.51-5.451-6.833z"/>
          </svg>
        )
      case 'bank_transfer':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.date)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0
          break
        case '7d':
          matchesDate = daysDiff <= 7
          break
        case '30d':
          matchesDate = daysDiff <= 30
          break
        case '90d':
          matchesDate = daysDiff <= 90
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDate
  })

  const handleViewPayment = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId)
    if (payment) {
      setSelectedPayment(payment)
      setShowViewModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowViewModal(false)
    setSelectedPayment(null)
  }

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.netAmount, 0)

  const completedPayments = payments.filter(p => p.status === 'completed').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length
  const failedPayments = payments.filter(p => p.status === 'failed').length

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p className="text-gray-600">Track and manage all payment transactions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">{failedPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments..."
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                    <div className="text-sm text-gray-500">{payment.transactionId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.customerName}</div>
                      <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                    {payment.processingFee > 0 && (
                      <div className="text-sm text-gray-500">Fee: ${payment.processingFee.toFixed(2)}</div>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                      <div className="flex-shrink-0 mr-2">
                        {getMethodIcon(payment.method)}
                      </div>
                      <span className="text-sm text-gray-900 capitalize">
                        {payment.method.replace('_', ' ')}
                      </span>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      {new Date(payment.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewPayment(payment.id)}
                      className="text-primary hover:text-primary-dull"
                    >
                      View Details
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                    </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <button
                onClick={handleCloseModal}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedPayment.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <p className="text-gray-900">{selectedPayment.orderId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <p className="text-gray-900">{selectedPayment.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                  <p className="text-gray-900">{selectedPayment.customerEmail}</p>
        </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-2xl font-bold text-gray-900">${selectedPayment.amount.toFixed(2)}</p>
        </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      {getMethodIcon(selectedPayment.method)}
        </div>
                    <span className="text-gray-900 capitalize">
                      {selectedPayment.method.replace('_', ' ')}
                    </span>
        </div>
      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Fee</label>
                  <p className="text-gray-900">${selectedPayment.processingFee.toFixed(2)}</p>
          </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Amount</label>
                  <p className="text-lg font-semibold text-gray-900">${selectedPayment.netAmount.toFixed(2)}</p>
          </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="text-gray-900">{new Date(selectedPayment.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{new Date(selectedPayment.date).toLocaleTimeString()}</p>
          </div>
        </div>
        
              {selectedPayment.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPayment.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory
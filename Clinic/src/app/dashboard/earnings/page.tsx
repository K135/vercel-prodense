'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface EarningsData {
  totalEarnings: number
  monthlyEarnings: number
  pendingPayments: number
  completedPayments: number
  averagePerTreatment: number
  growthRate: number
}

interface Transaction {
  id: string
  patient: string
  treatment: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'processing'
  paymentMethod: 'card' | 'cash' | 'insurance'
}

export default function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showFilters, setShowFilters] = useState(false)

  const earningsData: EarningsData = {
    totalEarnings: 125600,
    monthlyEarnings: 45600,
    pendingPayments: 8900,
    completedPayments: 36700,
    averagePerTreatment: 285,
    growthRate: 15.2
  }

  const transactions: Transaction[] = [
    {
      id: '1',
      patient: 'Sarah Johnson',
      treatment: 'Dental Cleaning',
      amount: 150,
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'card'
    },
    {
      id: '2',
      patient: 'Mike Chen',
      treatment: 'Root Canal Treatment',
      amount: 850,
      date: '2024-01-14',
      status: 'pending',
      paymentMethod: 'insurance'
    },
    {
      id: '3',
      patient: 'Emma Davis',
      treatment: 'Teeth Whitening',
      amount: 450,
      date: '2024-01-14',
      status: 'completed',
      paymentMethod: 'card'
    },
    {
      id: '4',
      patient: 'John Smith',
      treatment: 'Dental Implant',
      amount: 2500,
      date: '2024-01-13',
      status: 'processing',
      paymentMethod: 'card'
    },
    {
      id: '5',
      patient: 'Lisa Anderson',
      treatment: 'Orthodontic Consultation',
      amount: 200,
      date: '2024-01-12',
      status: 'completed',
      paymentMethod: 'cash'
    }
  ]

  const monthlyData = [
    { month: 'Jan', earnings: 42000 },
    { month: 'Feb', earnings: 38000 },
    { month: 'Mar', earnings: 45000 },
    { month: 'Apr', earnings: 41000 },
    { month: 'May', earnings: 48000 },
    { month: 'Jun', earnings: 45600 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCardIcon className="h-4 w-4" />
      case 'cash':
        return <BanknotesIcon className="h-4 w-4" />
      case 'insurance':
        return <CreditCardIcon className="h-4 w-4" />
      default:
        return <CurrencyDollarIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Payments</h1>
          <p className="text-gray-600 mt-2">Track your clinic's financial performance and settlements</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button className="btn-primary flex items-center">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-2">
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">
                ${earningsData.totalEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +{earningsData.growthRate}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Earnings</p>
              <p className="text-3xl font-bold text-gray-900">
                ${earningsData.monthlyEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900">
                ${earningsData.pendingPayments.toLocaleString()}
              </p>
              <p className="text-sm text-yellow-600 flex items-center mt-1">
                <CreditCardIcon className="h-4 w-4 mr-1" />
                12 transactions
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg per Treatment</p>
              <p className="text-3xl font-bold text-gray-900">
                ${earningsData.averagePerTreatment}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +8% improvement
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Earnings Chart */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Earnings Trend</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View Details
            </button>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-red-600 h-2 rounded-full"
                      style={{ width: `${(data.earnings / 50000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                    ${(data.earnings / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Methods Breakdown */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCardIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Credit/Debit Cards</p>
                  <p className="text-sm text-gray-500">68% of payments</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">$31,000</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cash</p>
                  <p className="text-sm text-gray-500">22% of payments</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">$10,000</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CreditCardIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Insurance</p>
                  <p className="text-sm text-gray-500">10% of payments</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">$4,600</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            View All
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                <option value="">All Payment Methods</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="insurance">Insurance</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </motion.div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{transaction.patient}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.treatment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="ml-2 capitalize">{transaction.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Settlement Information */}
      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Next Settlement</h3>
              <p className="text-blue-700">
                Your next payment of <strong>${earningsData.pendingPayments.toLocaleString()}</strong> will be processed on January 20, 2024
              </p>
            </div>
          </div>
          <button className="btn-primary">
            View Settlement History
          </button>
        </div>
      </motion.div>
    </div>
  )
}
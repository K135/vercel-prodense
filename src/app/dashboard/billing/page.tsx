'use client'

import { motion } from 'framer-motion'
import { CreditCardIcon } from '@heroicons/react/24/outline'

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#DB3116] to-red-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <CreditCardIcon className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Billing & Payments
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Manage your payments, invoices, and billing information. Track your treatment costs and payment history.
        </p>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">
            🚧 This page is under construction. Coming soon with amazing billing features!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
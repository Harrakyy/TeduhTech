'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { getAuthHeaders, removeToken } from '@/utils/auth'
import { Search, Inbox } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const API_BASE_URL = 'https://sistem-manajemen-proyek-agile-six.vercel.app'

export default function OrdersPage() {
  const [isDark, setIsDark] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, searchQuery])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`${API_BASE_URL}/api/admin/orders?${params}`, {
        headers: getAuthHeaders(),
      })
      const data = await res.json()

      if (data.success) {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statuses = [
    { id: 'all', label: 'Semua' },
    { id: 'pending', label: 'Menunggu' },
    { id: 'in_progress', label: 'Dikerjakan' },
    { id: 'revision', label: 'Revisi' },
    { id: 'completed', label: 'Selesai' },
    { id: 'rejected', label: 'Ditolak' },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      pending: { bg: 'rgba(155,236,0,0.08)', border: 'rgba(155,236,0,0.20)', text: '#9BEC00' },
      in_progress: { bg: 'rgba(128,74,199,0.08)', border: 'rgba(128,74,199,0.20)', text: '#804AC7' },
      revision: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.20)', text: '#F59E0B' },
      completed: { bg: 'rgba(66,214,166,0.08)', border: 'rgba(66,214,166,0.20)', text: '#42D6A6' },
      rejected: { bg: 'rgba(249,77,99,0.08)', border: 'rgba(249,77,99,0.20)', text: '#F94D63' },
    }
    return colors[status] || colors.pending
  }

  const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    in_progress: 'Dikerjakan',
    revision: 'Revisi',
    completed: 'Selesai',
    rejected: 'Ditolak',
  }

  return (
    <AdminLayout>
      <div style={{ backgroundColor: isDark ? '#000000' : '#FFFFFF' }} className="transition-colors duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-light mb-1" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
            Manajemen Order
          </h1>
          <p className="text-sm" style={{ color: '#767676' }}>
            {orders.length} order ditemukan
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-3 items-center"
        >
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className="px-4 py-1.5 rounded text-xs uppercase font-medium tracking-wider transition-all"
              style={{
                backgroundColor:
                  statusFilter === status.id
                    ? 'rgba(128,74,199,0.12)'
                    : 'transparent',
                border:
                  statusFilter === status.id
                    ? '1px solid #804AC7'
                    : `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
                color: statusFilter === status.id ? '#804AC7' : '#767676',
              }}
            >
              {status.label}
            </button>
          ))}

          {/* Search */}
          <div className="ml-auto relative">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#404040' }} />
            <input
              type="text"
              placeholder="Cari nama, nomor order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60 pl-9 pr-3 py-1.5 rounded text-xs bg-transparent outline-none"
              style={{
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
                color: isDark ? '#FFFFFF' : '#000000',
              }}
            />
          </div>
        </motion.div>

        {/* Kanban Columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto pb-4"
        >
          <div className="flex gap-4" style={{ minWidth: '100%' }}>
            {['pending', 'in_progress', 'revision', 'completed', 'rejected'].map((status) => {
              const statusOrders = isLoading
                ? []
                : orders.filter((o) => o.status === status)
              const statusColor = getStatusColor(status)

              return (
                <div
                  key={status}
                  className="flex-shrink-0 w-80 flex flex-col"
                  style={{
                    borderBottom: `2px solid ${statusColor.text}`,
                  }}
                >
                  <div className="flex justify-between items-center pb-3 mb-3">
                    <p
                      className="text-xs uppercase font-medium tracking-wider"
                      style={{ color: statusColor.text }}
                    >
                      {statusLabels[status]}
                    </p>
                    <div
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: statusColor.bg,
                        border: `1px solid ${statusColor.border}`,
                        color: statusColor.text,
                      }}
                    >
                      {statusOrders.length}
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {statusOrders.length > 0 ? (
                      statusOrders.map((order, idx) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className="p-4 rounded-md cursor-pointer transition-all"
                          style={{
                            backgroundColor: isDark
                              ? 'rgba(255,255,255,0.03)'
                              : 'rgba(0,0,0,0.02)',
                            border: isDark
                              ? '1px solid rgba(255,255,255,0.06)'
                              : '1px solid rgba(0,0,0,0.06)',
                          }}
                          onClick={() => {
                            window.location.href = `/admin/orders/${order.id}`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(128,74,199,0.35)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = isDark
                              ? 'rgba(255,255,255,0.06)'
                              : 'rgba(0,0,0,0.06)'
                          }}
                        >
                          <div className="flex justify-between mb-2">
                            <p
                              className="text-xs font-medium"
                              style={{ color: isDark ? '#FFFFFF' : '#000000' }}
                            >
                              {order.order_number}
                            </p>
                            <p className="text-xs" style={{ color: '#404040' }}>
                              {new Date(order.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <p className="text-xs mb-1" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                            {order.customer_name}
                          </p>
                          <p className="text-xs" style={{ color: '#767676' }}>
                            {order.customer_phone}
                          </p>
                          {order.ai_category && (
                            <div
                              className="text-xs px-2 py-1 rounded mt-2 inline-block"
                              style={{
                                backgroundColor: 'rgba(128,74,199,0.10)',
                                color: '#804AC7',
                              }}
                            >
                              {order.ai_category}
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Inbox size={24} style={{ color: '#404040', margin: '0 auto 6px' }} />
                        <p className="text-xs" style={{ color: '#404040' }}>
                          Tidak ada order
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

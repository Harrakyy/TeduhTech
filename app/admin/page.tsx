'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { getToken, getAuthHeaders, removeToken } from '@/utils/auth'
import { FolderKanban, CheckSquare, CheckCircle, ShoppingBag, Inbox } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const API_BASE_URL = 'https://sistem-manajemen-proyek-agile-six.vercel.app'

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [pendingOrders, setPendingOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    const token = getToken()
    if (!token) {
      window.location.href = '/login'
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders()

      // Fetch dashboard data
      const dashRes = await fetch(`${API_BASE_URL}/api/dashboard/me`, {
        headers,
      })
      const dashData = await dashRes.json()

      if (dashData.success) {
        setDashboardData(dashData.data)
        setStats({
          totalProjects: dashData.data.my_projects?.length || 0,
          activeTasks:
            (dashData.data.my_tasks?.by_status?.in_progress || 0) +
            (dashData.data.my_tasks?.by_status?.review || 0) +
            (dashData.data.my_tasks?.by_status?.testing || 0),
          completedTasks: dashData.data.my_tasks?.by_status?.done || 0,
          pendingOrders: 0,
        })
      } else {
        throw new Error('Failed to fetch dashboard')
      }

      // Fetch pending orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/admin/orders?status=pending&limit=5`, {
        headers,
      })
      const ordersData = await ordersRes.json()

      if (ordersData.success) {
        setPendingOrdersCount(ordersData.data.length)
        setPendingOrders(ordersData.data)
        setStats((prev) => ({
          ...prev,
          pendingOrders: ordersData.data.length,
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      removeToken()
      window.location.href = '/login'
    } finally {
      setIsLoading(false)
    }
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    hasPulse,
  }: {
    icon: any
    label: string
    value: number
    color: string
    hasPulse?: boolean
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg p-6"
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs uppercase tracking-widest" style={{ color: '#404040' }}>
          {label}
        </p>
        <div className="relative">
          <Icon size={20} style={{ color }} />
          {hasPulse && (
            <motion.div
              animate={{ scale: [1, 1.3], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{
                borderRadius: '50%',
                width: '6px',
                height: '6px',
                backgroundColor: color,
                top: '-2px',
                right: '-2px',
              }}
            />
          )}
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-3xl font-medium"
        style={{ color: isDark ? '#FFFFFF' : '#000000' }}
      >
        {value}
      </motion.p>
    </motion.div>
  )

  return (
    <AdminLayout>
      <div style={{ backgroundColor: isDark ? '#000000' : '#FFFFFF' }} className="transition-colors duration-300">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1
            className="text-4xl font-light mb-2"
            style={{ color: isDark ? '#FFFFFF' : '#000000' }}
          >
            Selamat datang, {dashboardData?.user?.name || 'Admin'}
          </h1>
          <p style={{ color: '#767676' }} className="text-sm">
            {currentDate}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FolderKanban}
            label="Total Proyek"
            value={stats.totalProjects}
            color="#804AC7"
          />
          <StatCard
            icon={CheckSquare}
            label="Task Aktif"
            value={stats.activeTasks}
            color="#9BEC00"
          />
          <StatCard
            icon={CheckCircle}
            label="Task Selesai"
            value={stats.completedTasks}
            color="#42D6A6"
          />
          <StatCard
            icon={ShoppingBag}
            label="Order Menunggu"
            value={stats.pendingOrders}
            color="#F59E0B"
            hasPulse={stats.pendingOrders > 0}
          />
        </div>

        {/* Recent Pending Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-lg p-6"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-lg font-medium"
              style={{ color: isDark ? '#FFFFFF' : '#000000' }}
            >
              Order Menunggu Tindakan
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm"
              style={{ color: '#804AC7' }}
            >
              Lihat Semua →
            </Link>
          </div>

          {pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-md p-4 flex flex-wrap justify-between items-center gap-4"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isDark ? '#FFFFFF' : '#000000' }}
                    >
                      {order.order_number}
                    </p>
                    <p className="text-xs" style={{ color: '#767676' }}>
                      {order.customer_name}
                    </p>
                  </div>
                  {order.ai_category && (
                    <div
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(128,74,199,0.10)',
                        border: '1px solid rgba(128,74,199,0.20)',
                        color: '#804AC7',
                      }}
                    >
                      {order.ai_category}
                    </div>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <div
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(155,236,0,0.08)',
                        border: '1px solid rgba(155,236,0,0.20)',
                        color: '#9BEC00',
                      }}
                    >
                      Menunggu
                    </div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs px-3 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        color: isDark ? '#FFFFFF' : '#000000',
                      }}
                    >
                      Lihat
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Inbox size={32} style={{ color: '#404040', margin: '0 auto 8px' }} />
              <p style={{ color: '#404040' }} className="text-sm">
                Tidak ada order yang menunggu
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}

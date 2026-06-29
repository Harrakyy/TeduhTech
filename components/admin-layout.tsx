'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, FolderKanban, Sun, Moon, LogOut, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { removeToken } from '@/utils/auth'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('teduhtech_user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const isActive = (route: string) => pathname === route

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: FolderKanban, label: 'Proyek', href: '/admin/projects' },
  ]

  const handleLogout = () => {
    removeToken()
    localStorage.removeItem('teduhtech_user')
    window.location.href = '/login'
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: isDark ? '#000000' : '#FFFFFF' }}
    >
      {/* Sidebar */}
      <motion.div
        initial={{ x: -220 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col fixed left-0 top-0 w-56 h-screen border-r transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#0D0D0D' : '#F5F5F5',
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span className="text-sm font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
              TeduhTech
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest" style={{ color: '#404040' }}>
            Admin Panel
          </p>
        </div>

        {/* Nav Items */}
        <div className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-all"
                style={{
                  backgroundColor: active ? 'rgba(128,74,199,0.10)' : 'transparent',
                  color: active ? '#804AC7' : '#767676',
                  borderLeft: active ? '2px solid #804AC7' : 'none',
                  paddingLeft: active ? 'calc(12px - 2px)' : '12px',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = isDark ? '#FFFFFF' : '#000000'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#767676'
                  }
                }}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t" style={{
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors mb-4"
            style={{
              color: '#767676',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = isDark ? '#FFFFFF' : '#000000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#767676'
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm">Tema</span>
          </button>

          {/* User Info */}
          {user && (
            <div className="mb-4 px-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(128,74,199,0.2)',
                    color: '#804AC7',
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                    {user.name}
                  </p>
                  <p className="text-xs" style={{ color: '#404040' }}>
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md transition-colors"
            style={{
              color: '#F94D63',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(249,77,99,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <LogOut size={14} />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </motion.div>

      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-between px-4 z-40"
        style={{
          backgroundColor: isDark ? '#0D0D0D' : '#F5F5F5',
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          <span className="text-xs font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
            TeduhTech
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: isDark ? '#FFFFFF' : '#000000' }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -220 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:hidden fixed top-14 left-0 w-56 h-[calc(100vh-56px)] border-r z-30 flex flex-col"
          style={{
            backgroundColor: isDark ? '#0D0D0D' : '#F5F5F5',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex-1 p-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: isActive(item.href) ? '#804AC7' : '#767676',
                    backgroundColor: isActive(item.href) ? 'rgba(128,74,199,0.10)' : 'transparent',
                  }}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
          <div className="p-4 border-t" style={{
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md transition-colors"
              style={{ color: '#F94D63' }}
            >
              <LogOut size={14} />
              <span className="text-sm">Keluar</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main
        className="flex-1 md:ml-56 md:mt-0 mt-14 p-10 transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#000000' : '#FFFFFF' }}
      >
        {children}
      </main>

      {/* Pass theme to children via context/props if needed */}
      {/* For now, we'll rely on children managing their own theme */}
    </div>
  )
}

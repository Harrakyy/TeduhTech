'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Geist, Geist_Mono } from 'next/font/google'
import { getToken, setToken } from '@/utils/auth'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

const API_BASE_URL = 'https://sistem-manajemen-proyek-agile-six.vercel.app'

export default function LoginPage() {
  const [isDark, setIsDark] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    if (getToken()) {
      window.location.href = '/admin'
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    setLoginError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success && data.data.user.role === 'admin') {
        setToken(data.data.access_token)
        localStorage.setItem('teduhtech_user', JSON.stringify(data.data.user))
        window.location.href = '/admin'
      } else if (data.success && data.data.user.role !== 'admin') {
        setLoginError('Akses ditolak. Hanya admin yang dapat masuk.')
      } else {
        setLoginError('Email atau password salah.')
      }
    } catch {
      setLoginError('Koneksi bermasalah. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-5 transition-colors duration-300 ${geistSans.className}`}
      style={{ backgroundColor: isDark ? '#000000' : '#FFFFFF' }}
    >
      {/* Ambient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.14, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed -top-52 -left-52 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: '#804AC7',
          filter: 'blur(160px)',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: isDark ? [0.05, 0.09, 0.05] : [0.07, 0.10, 0.07],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="fixed -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: '#9BEC00',
          filter: 'blur(140px)',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm flex flex-col gap-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span
              className="text-sm font-medium tracking-tight"
              style={{ color: isDark ? '#FFFFFF' : '#000000' }}
            >
              TeduhTech
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest" style={{ color: '#404040' }}>
            Admin Panel
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-lg p-8"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <h2
            className="text-xl font-medium mb-6"
            style={{ color: isDark ? '#FFFFFF' : '#000000' }}
          >
            Masuk ke Dashboard
          </h2>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-xs uppercase mb-2" style={{ color: '#404040' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@teduhtech.id"
              className="w-full bg-transparent text-sm outline-none pb-2"
              style={{
                color: isDark ? '#FFFFFF' : '#000000',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = isDark ? 'rgba(128,74,199,0.3)' : 'rgba(128,74,199,0.2)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'
              }}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <label className="block text-xs uppercase mb-2" style={{ color: '#404040' }}>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm outline-none pb-2 pr-8"
              style={{
                color: isDark ? '#FFFFFF' : '#000000',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = isDark ? 'rgba(128,74,199,0.3)' : 'rgba(128,74,199,0.2)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-8"
              style={{ color: '#404040' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Error Message */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-md flex gap-3 items-start"
              style={{
                backgroundColor: 'rgba(249,77,99,0.08)',
                border: '1px solid rgba(249,77,99,0.20)',
              }}
            >
              <AlertCircle size={14} style={{ color: '#F94D63', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ color: '#F94D63', fontSize: '13px' }}>{loginError}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={!email.trim() || !password.trim() || isLoading}
            className="w-full py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: isLoading ? '#6BA000' : '#9BEC00',
              color: '#000000',
              opacity: !email.trim() || !password.trim() ? 0.5 : 1,
            }}
          >
            {isLoading && (
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  borderTop: '2px solid #000000',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
            )}
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </motion.div>

        {/* Footer Text */}
        <p className="text-center text-xs" style={{ color: '#404040' }}>
          Hanya admin yang dapat mengakses halaman ini.
        </p>
      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

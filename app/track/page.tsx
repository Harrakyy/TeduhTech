"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { Menu, X, Sun, Moon, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

const API_BASE_URL = "https://sistem-manajemen-proyek-agile-six.vercel.app"

type TrackingLog = {
  id: string
  status: string
  note: string
  created_at: string
}

type ProjectData = {
  name: string
  current_sprint: string
  done_tasks: number
  total_tasks: number
  sprint_progress_percent: number
}

type OrderData = {
  order_number: string
  customer_name: string
  ai_category: string
  status: string
  agreed_price: number | null
  agreed_duration: number | null
  created_at: string
  tracking_logs: TrackingLog[]
  project?: ProjectData | null
}

function TrackContent() {
  const searchParams = useSearchParams()
  const orderFromUrl = searchParams.get("order")
  
  const [isDark, setIsDark] = useState(true)
  const [inputOrderId, setInputOrderId] = useState("")
  const [state, setState] = useState<"input" | "loading" | "result">("input")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (orderFromUrl) {
      setInputOrderId(orderFromUrl)
      setTimeout(() => searchOrder(orderFromUrl), 500)
    }
  }, [orderFromUrl])

  const searchOrder = async (orderNum: string) => {
    setState("loading")
    setNotFound(false)

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/track/${orderNum.trim()}`)
      const data = await response.json()

      if (data.success) {
        setOrderData(data.data)
        setState("result")
      } else {
        setNotFound(true)
        setState("result")
      }
    } catch (err) {
      setNotFound(true)
      setState("result")
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      pending: { label: "Menunggu Konfirmasi", color: "#9BEC00" },
      in_progress: { label: "Sedang Dikerjakan", color: "#804AC7" },
      revision: { label: "Dalam Revisi", color: "#F94D63" },
      completed: { label: "Selesai", color: "#9BEC00" },
      rejected: { label: "Ditolak", color: "#F94D63" },
    }
    return statusMap[status] || { label: status, color: "#FFFFFF" }
  }

  const formatDate = (dateString: string, includeTime = false) => {
    const date = new Date(dateString)
    if (includeTime) {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#000000" : "#FFFFFF",
        color: isDark ? "#FFFFFF" : "#000000",
      }}
    >
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-10 border-b"
        style={{
          backgroundColor: isDark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span className="text-sm font-medium">TeduhTech</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm hover:text-white/70 transition-colors">
              Beranda
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                borderRadius: "6px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "transparent",
              }}
            >
              {isDark ? "☀" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.14, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-208px",
            left: "-208px",
            width: "384px",
            height: "384px",
            borderRadius: "50%",
            background: "#804AC7",
            filter: "blur(160px)",
            zIndex: 0,
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: isDark ? [0.05, 0.09, 0.05] : [0.07, 0.10, 0.07],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "-128px",
            right: "-128px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "#9BEC00",
            filter: "blur(140px)",
            zIndex: 0,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-20 px-10">
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          {state === "input" && (
            <div style={{ marginTop: "100px", textAlign: "center" }}>
              <h1 style={{ fontSize: "48px", fontWeight: 300, marginBottom: "16px" }}>Lacak Pesanan</h1>
              <p style={{ fontSize: "14px", color: isDark ? "#767676" : "#555555", marginBottom: "40px" }}>
                Masukkan nomor order Anda untuk melihat progress dan status terbaru.
              </p>

              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchOrder(inputOrderId)}
                  placeholder="Nomor Order (cth: TDH-2025-001)"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "6px",
                    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    color: isDark ? "#FFFFFF" : "#000000",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 200ms ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#804AC7"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                  }}
                />
                <Button
                  onClick={() => searchOrder(inputOrderId)}
                  disabled={!inputOrderId.trim()}
                  className="text-black font-medium"
                  style={{ backgroundColor: "#9BEC00" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7BC800")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9BEC00")}
                >
                  Cari
                </Button>
              </div>
            </div>
          )}

          {state === "loading" && (
            <div style={{ marginTop: "100px", textAlign: "center" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderTop: "2px solid #9BEC00",
                  borderRadius: "50%",
                  margin: "0 auto",
                }}
              />
              <p style={{ marginTop: "16px", color: isDark ? "#767676" : "#555555" }}>Mencari order...</p>
            </div>
          )}

          {state === "result" && notFound && (
            <div style={{ marginTop: "100px" }}>
              <div
                style={{
                  padding: "24px",
                  backgroundColor: "rgba(249,77,99,0.08)",
                  border: "1px solid rgba(249,77,99,0.20)",
                  borderRadius: "6px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <AlertCircle style={{ width: "24px", height: "24px", color: "#F94D63" }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#F94D63", marginBottom: "4px" }}>
                    Order Tidak Ditemukan
                  </p>
                  <p style={{ fontSize: "13px", color: isDark ? "#767676" : "#555555" }}>
                    Periksa kembali nomor order Anda dan coba lagi.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setState("input")
                  setInputOrderId("")
                }}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  backgroundColor: "transparent",
                  border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {state === "result" && orderData && !notFound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Order Header Card */}
              <div
                style={{
                  padding: "24px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888", marginBottom: "4px" }}>
                      NOMOR ORDER
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: 500 }}>{orderData.order_number}</p>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      backgroundColor:
                        getStatusLabel(orderData.status).color === "#9BEC00"
                          ? "rgba(155,236,0,0.10)"
                          : getStatusLabel(orderData.status).color === "#804AC7"
                          ? "rgba(128,74,199,0.10)"
                          : "rgba(249,77,99,0.10)",
                      border:
                        getStatusLabel(orderData.status).color === "#9BEC00"
                          ? "1px solid rgba(155,236,0,0.20)"
                          : getStatusLabel(orderData.status).color === "#804AC7"
                          ? "1px solid rgba(128,74,199,0.20)"
                          : "1px solid rgba(249,77,99,0.20)",
                      borderRadius: "4px",
                      color: getStatusLabel(orderData.status).color,
                      fontSize: "11px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {getStatusLabel(orderData.status).label}
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`, paddingTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888", marginBottom: "4px" }}>NAMA KLIEN</p>
                    <p style={{ fontSize: "14px" }}>{orderData.customer_name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888", marginBottom: "4px" }}>KATEGORI</p>
                    <p style={{ fontSize: "14px" }}>{orderData.ai_category || "—"}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888", marginBottom: "4px" }}>HARGA</p>
                    <p style={{ fontSize: "14px", color: "#9BEC00" }}>
                      {orderData.agreed_price ? `Rp ${orderData.agreed_price.toLocaleString("id-ID")}` : "Akan dikonfirmasi"}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888", marginBottom: "4px" }}>DURASI</p>
                    <p style={{ fontSize: "14px" }}>
                      {orderData.agreed_duration ? `${orderData.agreed_duration} minggu` : "Akan dikonfirmasi"}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888", marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}` }}>
                  Dibuat: {formatDate(orderData.created_at)}
                </p>
              </div>

              {/* Tracking Timeline */}
              {orderData.tracking_logs && orderData.tracking_logs.length > 0 && (
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", color: isDark ? "#404040" : "#888888", marginBottom: "16px" }}>
                    TIMELINE PROGRES
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {orderData.tracking_logs.map((log, idx) => (
                      <div key={log.id} style={{ display: "flex", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          {idx === 0 ? (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "#804AC7",
                                boxShadow: "0 0 8px rgba(128,74,199,0.5)",
                              }}
                            />
                          ) : (
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#9BEC00" }} />
                          )}
                          {idx < orderData.tracking_logs.length - 1 && (
                            <div
                              style={{
                                width: "2px",
                                height: "24px",
                                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                                marginTop: "4px",
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>
                            {getStatusLabel(log.status).label}
                          </p>
                          <p style={{ fontSize: "12px", color: isDark ? "#767676" : "#555555", marginBottom: "4px" }}>
                            {log.note}
                          </p>
                          <p style={{ fontSize: "11px", color: isDark ? "#404040" : "#888888" }}>
                            {formatDate(log.created_at, true)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Progress */}
              {orderData.project && (
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", color: isDark ? "#404040" : "#888888", marginBottom: "12px" }}>
                    PROGRESS PROYEK
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "16px" }}>{orderData.project.name}</p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "4px",
                        backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${orderData.project.sprint_progress_percent}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{
                          height: "100%",
                          background: "linear-gradient(90deg, #804AC7, #9BEC00)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888" }}>Sprint Aktif</p>
                      <p style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}>
                        {orderData.project.current_sprint || "—"}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888" }}>Task Selesai</p>
                      <p style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}>
                        {orderData.project.done_tasks}/{orderData.project.total_tasks}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888" }}>Progress</p>
                      <p style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px", color: "#9BEC00" }}>
                        {orderData.project.sprint_progress_percent}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackContent />
    </Suspense>
  )
}

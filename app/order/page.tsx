"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type AnalyzeResult = {
  category: string
  features: string[]
  price_min: number
  price_max: number
  duration_weeks: number
  complexity: string
}

const API_BASE_URL = "https://sistem-manajemen-proyek-agile-six.vercel.app"

interface OrderData {
  description: string
  analyzeResult: AnalyzeResult
  chatAnswers: {
    jenisBisnis: string
    kebutuhan: string[]
    sistemExisting: string
    budget: string
  }
}

export default function OrderPage() {
  const [isDark, setIsDark] = useState(true)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerCompany, setCustomerCompany] = useState("")
  const [budget, setBudget] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [whatsappMessage, setWhatsappMessage] = useState<string>("")

  useEffect(() => {
    const savedData = sessionStorage.getItem("orderData")
    if (savedData) {
      const data = JSON.parse(savedData) as OrderData
      setOrderData(data)
      setBudget(
        `Rp ${data.analyzeResult.price_min.toLocaleString("id-ID")} - Rp ${data.analyzeResult.price_max.toLocaleString("id-ID")}`
      )
    } else {
      window.location.href = "/"
    }
  }, [])

  const submitOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !budget.trim()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || undefined,
          customer_company: customerCompany || undefined,
          description: orderData?.description,
          ai_category: orderData?.analyzeResult.category,
          ai_features: orderData?.analyzeResult.features,
          ai_price_min: orderData?.analyzeResult.price_min,
          ai_price_max: orderData?.analyzeResult.price_max,
          ai_duration_weeks: orderData?.analyzeResult.duration_weeks,
          ai_complexity: orderData?.analyzeResult.complexity,
        }),
      })

      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem("lastOrderNumber", data.data.order_number)
        sessionStorage.setItem("whatsappMessage", data.data.whatsapp_message)
        sessionStorage.removeItem("orderData")

        setOrderNumber(data.data.order_number)
        setWhatsappMessage(data.data.whatsapp_message)
        setIsSuccess(true)
      } else {
        setSubmitError("Gagal memproses order. Silakan coba lagi.")
      }
    } catch (err) {
      setSubmitError("Koneksi bermasalah. Periksa internet Anda dan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!orderData) return null

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#000000" : "#FFFFFF",
        color: isDark ? "#FFFFFF" : "#000000",
      }}
    >
      {/* Navbar - simplified */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-10"
        style={{
          backgroundColor: isDark ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span className="text-sm font-medium">TeduhTech</span>
          </div>
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
      </nav>

      {/* Background orbs - same as landing page */}
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
        <div style={{ maxWidth: "560px", margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "32px" }}>
          {!isSuccess ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isDark ? "#404040" : "#888888",
                    marginBottom: "16px",
                  }}
                >
                  DETAIL ORDER
                </p>
                <h1 style={{ fontSize: "40px", fontWeight: 400, marginBottom: "16px" }}>
                  Lengkapi Detail Anda
                </h1>
                <p
                  style={{
                    fontSize: "14px",
                    color: isDark ? "#767676" : "#555555",
                  }}
                >
                  Kami akan segera menghubungi Anda untuk diskusi lebih lanjut.
                </p>
              </div>

              {/* Summary Card */}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "rgba(128,74,199,0.15)",
                    border: "1px solid rgba(128,74,199,0.30)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#804AC7",
                    minWidth: "fit-content",
                  }}
                >
                  {orderData.analyzeResult.category}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", color: "#9BEC00", marginBottom: "4px" }}>
                    Estimasi: Rp {orderData.analyzeResult.price_min.toLocaleString("id-ID")} - Rp{" "}
                    {orderData.analyzeResult.price_max.toLocaleString("id-ID")}
                  </p>
                  <p style={{ fontSize: "12px", color: isDark ? "#767676" : "#555555" }}>
                    Durasi: {orderData.analyzeResult.duration_weeks} minggu
                  </p>
                  <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888" }}>
                    Kompleksitas:{" "}
                    {orderData.analyzeResult.complexity === "simple"
                      ? "Sederhana"
                      : orderData.analyzeResult.complexity === "medium"
                      ? "Menengah"
                      : "Kompleks"}
                  </p>
                </div>
              </div>

              {/* Form Card */}
              <div
                style={{
                  padding: "32px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "6px",
                }}
              >
                {/* Nama Lengkap */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: isDark ? "#FFFFFF" : "#000000" }}>
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                      padding: "14px 0",
                      fontSize: "14px",
                      color: isDark ? "#FFFFFF" : "#000000",
                      outline: "none",
                      transition: "border-color 200ms ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#804AC7"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                    }}
                  />
                </div>

                {/* Nomor WhatsApp */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: isDark ? "#FFFFFF" : "#000000" }}>
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="08123456789"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                      padding: "14px 0",
                      fontSize: "14px",
                      color: isDark ? "#FFFFFF" : "#000000",
                      outline: "none",
                      transition: "border-color 200ms ease",
                      marginBottom: "8px",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#804AC7"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                    }}
                  />
                  <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888", marginTop: "8px" }}>
                    Kami akan menghubungi Anda melalui nomor ini.
                  </p>
                </div>

                {/* Email */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: isDark ? "#FFFFFF" : "#000000" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@bisnis.com"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                      padding: "14px 0",
                      fontSize: "14px",
                      color: isDark ? "#FFFFFF" : "#000000",
                      outline: "none",
                      transition: "border-color 200ms ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#804AC7"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                    }}
                  />
                </div>

                {/* Nama Bisnis */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: isDark ? "#FFFFFF" : "#000000" }}>
                    Nama Bisnis
                  </label>
                  <input
                    type="text"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder="PT Maju Bersama (opsional)"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                      padding: "14px 0",
                      fontSize: "14px",
                      color: isDark ? "#FFFFFF" : "#000000",
                      outline: "none",
                      transition: "border-color 200ms ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#804AC7"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                    }}
                  />
                </div>

                {/* Budget */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: isDark ? "#FFFFFF" : "#000000" }}>
                    Budget yang Disiapkan *
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="contoh: Rp 15.000.000"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                      padding: "14px 0",
                      fontSize: "14px",
                      color: isDark ? "#FFFFFF" : "#000000",
                      outline: "none",
                      transition: "border-color 200ms ease",
                      marginBottom: "8px",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#804AC7"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                    }}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={submitOrder}
                  disabled={!customerName.trim() || !customerPhone.trim() || !budget.trim() || isSubmitting}
                  className="w-full text-black font-medium text-sm transition-all"
                  style={{
                    backgroundColor: isSubmitting ? "#6BA000" : "#9BEC00",
                    transition: "background-color 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = "#7BC800"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSubmitting ? "#6BA000" : "#9BEC00"
                  }}
                >
                  {isSubmitting ? "Memproses..." : "Kirim & Hubungi Admin →"}
                </Button>

                {/* Error Message */}
                {submitError && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px 16px",
                      backgroundColor: "rgba(249,77,99,0.08)",
                      border: "1px solid rgba(249,77,99,0.20)",
                      borderRadius: "6px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <AlertCircle style={{ color: "#F94D63", width: "14px", height: "14px", marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ color: "#F94D63", fontSize: "13px" }}>{submitError}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  alignItems: "center",
                  textAlign: "center",
                  marginTop: "60px",
                }}
              >
                {/* Check Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(155,236,0,0.10)",
                    border: "1px solid rgba(155,236,0,0.30)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check style={{ width: "24px", height: "24px", color: "#9BEC00" }} />
                </motion.div>

                {/* Title */}
                <h2 style={{ fontSize: "28px", fontWeight: 400 }}>Order Berhasil Dikirim!</h2>

                {/* Order Number Card */}
                <div
                  style={{
                    padding: "16px 24px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "6px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: isDark ? "#404040" : "#888888", marginBottom: "4px" }}>
                    Nomor Order Anda
                  </p>
                  <p style={{ fontSize: "24px", fontWeight: 500, color: "#9BEC00", marginTop: "4px", marginBottom: "8px" }}>
                    {orderNumber}
                  </p>
                  <p style={{ fontSize: "12px", color: isDark ? "#404040" : "#888888" }}>
                    Simpan nomor ini untuk melacak status proyek Anda.
                  </p>
                </div>

                {/* Info Text */}
                <p
                  style={{
                    fontSize: "13px",
                    color: isDark ? "#767676" : "#555555",
                    maxWidth: "360px",
                    lineHeight: "1.6",
                  }}
                >
                  Email konfirmasi akan dikirimkan segera. Tim kami akan menghubungi Anda melalui WhatsApp dalam 1x24 jam.
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "24px" }}>
                  <a
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 text-black text-xs font-medium rounded-md transition-colors text-center"
                    style={{
                      backgroundColor: "#9BEC00",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7BC800")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9BEC00")}
                  >
                    Hubungi Admin via WhatsApp →
                  </a>
                </div>
                <button
                  onClick={() => (window.location.href = `/track?order=${orderNumber}`)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    backgroundColor: "transparent",
                    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
                    color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                    fontSize: "13px",
                    fontWeight: 500,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "#FFFFFF" : "#000000"
                    e.currentTarget.style.color = isDark ? "#FFFFFF" : "#000000"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
                  }}
                >
                  Lacak Status Order →
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

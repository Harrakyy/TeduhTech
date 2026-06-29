"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Star, Sun, Moon, BookOpen, Globe, Monitor, Server, Search, BarChart2, User, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Message = {
  role: "ai" | "user"
  content: string
}

type Step = 0 | 1 | 2 | 3 | 4

type AnalyzeResult = {
  category: string
  features: string[]
  price_min: number
  price_max: number
  duration_weeks: number
  complexity: string
}

const API_BASE_URL = "https://sistem-manajemen-proyek-agile-six.vercel.app"

export default function TeduhTech() {
  const [isDark, setIsDark] = useState(true)
  const [initialInput, setInitialInput] = useState("")
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState<Step>(0)
  const [selectedJenisBisnis, setSelectedJenisBisnis] = useState<string | null>(null)
  const [selectedKebutuhan, setSelectedKebutuhan] = useState<string[]>([])
  const [selectedSistem, setSelectedSistem] = useState<string | null>(null)
  const [budgetInput, setBudgetInput] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [chatAnswers, setChatAnswers] = useState<{
    jenisBisnis: string
    kebutuhan: string[]
    sistemExisting: string
    budget: string
  }>({
    jenisBisnis: "",
    kebutuhan: [],
    sistemExisting: "",
    budget: "",
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminInitials, setAdminInitials] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const token = localStorage.getItem("teduhtech_token")
    const userStr = localStorage.getItem("teduhtech_user")
    if (token && userStr) {
      setIsLoggedIn(true)
      const user = JSON.parse(userStr)
      const initials = user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
      setAdminInitials(initials)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMulai = async () => {
    if (!initialInput.trim()) return
    
    setIsAnalyzing(true)
    setAnalyzeError(null)
    setChatOpen(true)
    setMessages([{ role: "user", content: initialInput }])
    setStep(0)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: initialInput }),
      })

      const data = await response.json()

      if (data.success) {
        setAnalyzeResult(data.data)
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: "Halo! Saya akan bantu analisis kebutuhan sistem Anda. Pertama, jenis bisnis kamu apa?",
            },
          ])
        }, 300)
        setIsAnalyzing(false)
      } else {
        setAnalyzeError("Gagal menganalisis kebutuhan. Silakan coba lagi.")
        setIsAnalyzing(false)
      }
    } catch (err) {
      setAnalyzeError("Koneksi bermasalah. Periksa internet Anda dan coba lagi.")
      setIsAnalyzing(false)
    }
  }

  const handleJenisBisnis = (value: string) => {
    setSelectedJenisBisnis(value)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: value },
      {
        role: "ai",
        content: "Oke! Kebutuhan utama sistem yang ingin dibangun?",
      },
    ])
    setStep(1)
  }

  const toggleKebutuhan = (value: string) => {
    setSelectedKebutuhan((prev) =>
      prev.includes(value) ? prev.filter((k) => k !== value) : [...prev, value]
    )
  }

  const handleLanjutKebutuhan = () => {
    const kebutuhanText = selectedKebutuhan.join(" + ")
    setMessages((prev) => [
      ...prev,
      { role: "user", content: kebutuhanText },
      {
        role: "ai",
        content: "Apakah bisnis Anda sudah memiliki sistem digital sebelumnya?",
      },
    ])
    setStep(2)
  }

  const handleSistemExisting = (value: string) => {
    setSelectedSistem(value)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: value },
      {
        role: "ai",
        content: "Terakhir, berapa budget yang Anda siapkan untuk proyek ini?",
      },
    ])
    setStep(3)
  }

  const handleBudgetSubmit = () => {
    if (budgetInput.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: budgetInput },
        {
          role: "ai",
          content: "recommendation",
        },
      ])
      setStep(4)
    }
  }

  const handleRevisiKebutuhan = () => {
    setMessages([])
    setStep(0)
    setSelectedJenisBisnis(null)
    setSelectedKebutuhan([])
    setSelectedSistem(null)
    setBudgetInput("")
    setInitialInput("")
    setChatOpen(false)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  const jenisBisnisList = ["UMKM", "Perusahaan", "Startup"]
  const kebutuhanList = ["Website AI", "Order Tracking", "E-Commerce", "Dashboard", "Sistem Internal"]
  const sistemList = ["Ya, sudah ada", "Belum sama sekali"]

  const portfolioItems = [
    {
      badge: "E-Commerce",
      title: "Platform Toko Online UMKM Nusantara",
      desc: "Sistem e-commerce lengkap dengan manajemen inventory otomatis dan integrasi pembayaran.",
    },
    {
      badge: "Sistem Internal",
      title: "Dashboard Operasional PT Maju Bersama",
      desc: "Dashboard real-time untuk monitoring KPI, laporan harian, dan manajemen tim lintas divisi.",
    },
    {
      badge: "AI Integration",
      title: "Chatbot Layanan Pelanggan Klinik Sehat",
      desc: "Asisten AI untuk booking otomatis, reminder pasien, dan triage keluhan awal 24/7.",
    },
  ]

  const deliverableItems = [
    {
      icon: BookOpen,
      badge: "Termasuk",
      title: "Panduan Penggunaan",
      desc: "Dokumentasi lengkap aplikasi atau website yang kami bangun — siap digunakan oleh tim Anda tanpa perlu pelatihan teknis.",
    },
    {
      icon: Globe,
      badge: "Termasuk",
      title: "Domain (.com / .id)",
      desc: "Setup dan konfigurasi domain pilihan Anda — terhubung sempurna ke sistem yang kami bangun.",
    },
    {
      icon: Monitor,
      badge: "Termasuk",
      title: "Responsive Semua Device",
      desc: "Tampil sempurna di desktop, tablet, dan smartphone — tanpa kompromi pada tampilan maupun fungsi.",
    },
    {
      icon: Server,
      badge: "Termasuk",
      title: "Infrastruktur Terpisah & Scalable",
      desc: "Frontend dan backend berjalan di server independen — lebih cepat, lebih aman, dan siap tumbuh bersama bisnis Anda.",
    },
    {
      icon: Search,
      badge: "By Request",
      title: "SEO On-Page",
      desc: "Optimasi struktur konten, meta tags, dan performa halaman agar bisnis Anda mudah ditemukan di Google.",
    },
    {
      icon: BarChart2,
      badge: "By Request",
      title: "Integrasi Analytics",
      desc: "Pantau performa website dan perilaku pengunjung secara real-time dengan Google Analytics dan Search Console.",
    },
  ]

  const faqItems = [
    {
      q: "Berapa biaya untuk memulai?",
      a: "Konsultasi awal sepenuhnya gratis. Estimasi biaya diberikan setelah kami memahami kebutuhan bisnis Anda melalui sesi konsultasi.",
    },
    {
      q: "Berapa lama proses pengerjaannya?",
      a: "Rata-rata 4–5 minggu dari konsultasi hingga sistem live, tergantung kompleksitas fitur yang dibutuhkan.",
    },
    {
      q: "Sistem apa saja yang bisa TeduhTech bangun?",
      a: "Website terintegrasi AI, sistem order tracking, platform e-commerce, dashboard analitik, ERP, chatbot, dan sistem manajemen bisnis lainnya.",
    },
    {
      q: "Apakah bisnis saya perlu tim IT sendiri?",
      a: "Tidak. Kami menangani seluruh aspek teknis. Anda cukup fokus menjalankan bisnis.",
    },
    {
      q: "Bagaimana proses integrasi AI-nya?",
      a: "Kami analisis kebutuhan bisnis Anda, lalu integrasikan komponen AI yang relevan — mulai dari chatbot, rekomendasi otomatis, hingga analitik prediktif.",
    },
    {
      q: "Bagaimana cara memulai?",
      a: "Ceritakan kebutuhan Anda di form atas — AI kami akan langsung menganalisis dan tim kami menghubungi Anda dalam 1x24 jam.",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      {/* Fixed Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? isDark
              ? "rgba(0,0,0,0.85)"
              : "rgba(255,255,255,0.9)"
            : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled
            ? isDark
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(0,0,0,0.08)"
            : "none",
          boxShadow: scrolled && !isDark ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
          transition: "background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
        }}
      >
        <div className="max-w-6xl mx-auto px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span
              className="text-sm font-medium tracking-tight transition-colors duration-200"
              style={{ color: isDark ? "#FFFFFF" : "#000000" }}
            >
              TeduhTech
            </span>
          </div>

          {/* Center Nav - Desktop */}
          <div className="hidden md:flex gap-8">
            {["Portofolio", "FAQ", "Track Order"].map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (link === "Portofolio") scrollToSection("portofolio")
                  else if (link === "FAQ") scrollToSection("faq")
                  else if (link === "Track Order") window.location.href = "/track"
                }}
                className="text-xs transition-colors duration-200"
                style={
                  link === "Track Order"
                    ? { color: "#9BEC00" }
                    : {
                        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
                      }
                }
                onMouseEnter={(e) => {
                  if (link !== "Track Order") {
                    e.currentTarget.style.color = isDark ? "#FFFFFF" : "#000000"
                  }
                }}
                onMouseLeave={(e) => {
                  if (link !== "Track Order") {
                    e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)"
                  }
                }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Theme Toggle - Desktop */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="hidden md:flex w-9 h-9 rounded transition-all duration-200"
            style={{
              borderRadius: "6px",
              border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
              backgroundColor: isDark ? "transparent" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            {isDark ? (
              <Sun className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
            ) : (
              <Moon className="w-4 h-4" style={{ color: "rgba(0,0,0,0.5)" }} />
            )}
          </button>

          {/* Profile/Login Button */}
          <div
            ref={dropdownRef}
            className="relative inline-flex"
            style={{ position: "relative", display: "inline-flex" }}
          >
            {!isLoggedIn ? (
              <button
                onClick={() => (window.location.href = "/login")}
                className="hidden md:flex w-9 h-9 rounded transition-all duration-200"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  backgroundColor: "transparent",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid rgba(0,0,0,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <User
                  className="w-4 h-4"
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(0,0,0,0.5)",
                  }}
                />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hidden md:flex w-9 h-9 rounded-full transition-all duration-200"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(128,74,199,0.20)",
                    border: "1px solid rgba(128,74,199,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#804AC7",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(128,74,199,0.30)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(128,74,199,0.20)"
                  }}
                >
                  {adminInitials}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-11 right-0 z-100"
                      style={{
                        position: "absolute",
                        top: "44px",
                        right: 0,
                        zIndex: 100,
                        backgroundColor: isDark
                          ? "rgba(13,13,13,0.95)"
                          : "rgba(245,245,245,0.95)",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "6px",
                        backdropFilter: "blur(20px)",
                        padding: "8px",
                        width: "160px",
                      }}
                    >
                      {/* Dashboard Item */}
                      <button
                        onClick={() => {
                          window.location.href = "/admin"
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded transition-colors"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          color: isDark ? "#FFFFFF" : "#000000",
                          fontSize: "13px",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" style={{ color: "#804AC7" }} />
                        Dashboard
                      </button>

                      {/* Logout Item */}
                      <button
                        onClick={() => {
                          localStorage.removeItem("teduhtech_token")
                          localStorage.removeItem("teduhtech_user")
                          setIsLoggedIn(false)
                          setDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded transition-colors"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          color: "#F94D63",
                          fontSize: "13px",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(249,77,99,0.08)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <LogOut className="w-3.5 h-3.5" style={{ color: "#F94D63" }} />
                        Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Right - Contact Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection("contact")}
              className="hidden md:inline-flex text-xs transition-colors duration-200"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.15)",
                color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"
                e.currentTarget.style.color = isDark ? "#FFFFFF" : "#000000"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)"
                e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)"
              }}
            >
              Hubungi Kami
            </Button>
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              duration={0.2}
              className="fixed inset-0 z-40 pt-20 flex flex-col items-center justify-start gap-8 transition-colors duration-300"
              style={{
                backgroundColor: isDark ? "#000000" : "#FFFFFF",
              }}
            >
              {["Portofolio", "FAQ", "Track Order", "Hubungi Kami"].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (link === "Portofolio") scrollToSection("portofolio")
                    else if (link === "FAQ") scrollToSection("faq")
                    else if (link === "Track Order") window.location.href = "/track"
                    else if (link === "Hubungi Kami") scrollToSection("contact")
                    setMobileMenuOpen(false)
                  }}
                  className="text-xl transition-colors duration-200"
                  style={
                    link === "Track Order"
                      ? { color: "#9BEC00" }
                      : {
                          color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (link !== "Track Order") {
                      e.currentTarget.style.color = isDark ? "#FFFFFF" : "#000000"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (link !== "Track Order") {
                      e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"
                    }
                  }}
                >
                  {link}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section
        className="pt-32 pb-20 px-10 relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: isDark ? "#000000" : "#FFFFFF" }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Purple Ambient Orb */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: isDark ? [0.1, 0.14, 0.1] : [0.06, 0.08, 0.06],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-52 -left-52 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "#804AC7",
            filter: "blur(160px)",
            zIndex: 0,
          }}
        />

        {/* Lime Ambient Orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: isDark ? [0.05, 0.09, 0.05] : [0.07, 0.10, 0.07],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "#9BEC00",
            filter: "blur(140px)",
            zIndex: 0,
          }}
        />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 text-xs uppercase tracking-widest border border-white/8 rounded-full bg-white/3"
            style={{ color: "#9BEC00" }}
          >
            ✦ SOLUSI AI UNTUK BISNIS INDONESIA
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-light leading-tight tracking-tight"
          >
            Bangun Sistem Bisnis{" "}
            <span className="block" style={{ color: "#9BEC00" }}>
              Terintegrasi AI
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px" }}
          >
            Ceritakan kebutuhan sistem bisnis Anda — AI kami akan menganalisis dan memberikan rekomendasi yang tepat.
          </motion.p>
        </div>

        {/* Input Section */}
        <div id="contact" className="max-w-xl mx-auto mt-12 space-y-3 relative z-10">
          <div className="relative">
            {/* Glow Background */}
            <div
              style={{
                position: "absolute",
                inset: "-60px",
                background: `radial-gradient(ellipse at 50% 60%, ${
                  isDark
                    ? "rgba(155, 236, 0, 0.10) 0%, rgba(155, 236, 0, 0.05) 35%"
                    : "rgba(155, 236, 0, 0.12) 0%, rgba(155, 236, 0, 0.08) 35%"
                }, transparent 65%)`,
                filter: "blur(60px)",
                pointerEvents: "none",
                zIndex: 0,
                borderRadius: "inherit",
              }}
            />
            <Textarea
              value={initialInput}
              onChange={(e) => setInitialInput(e.target.value)}
              placeholder="Jelaskan kebutuhan sistem Anda... (contoh: saya butuh sistem order tracking untuk toko online saya)"
              className="min-h-28 text-sm placeholder:transition-colors duration-200 resize-none relative z-10"
              style={{
                borderRadius: "6px",
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                color: isDark ? "#FFFFFF" : "#000000",
                border: isDark
                  ? "1px solid rgba(155, 236, 0, 0.12)"
                  : "1px solid rgba(155, 236, 0, 0.25)",
                boxShadow: isDark
                  ? `0 0 60px rgba(155, 236, 0, 0.07), 0 0 120px rgba(155, 236, 0, 0.03)`
                  : `0 2px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06), 0 0 60px rgba(155, 236, 0, 0.08), 0 0 120px rgba(155, 236, 0, 0.04)`,
                placeholderColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                transition: "box-shadow 300ms ease, border-color 300ms ease",
              }}
            />
          </div>
          {analyzeError && (
            <div
              className="px-4 py-3 rounded-md flex gap-3 items-start"
              style={{
                backgroundColor: "rgba(249,77,99,0.08)",
                border: "1px solid rgba(249,77,99,0.20)",
              }}
            >
              <div style={{ color: "#F94D63", marginTop: "2px", flexShrink: 0 }}>
                ⚠
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#F94D63", fontSize: "13px", marginBottom: "6px" }}>
                  {analyzeError}
                </p>
                <button
                  onClick={handleMulai}
                  className="text-xs transition-colors"
                  style={{ color: "#F94D63", textDecoration: "underline" }}
                >
                  Coba lagi
                </button>
              </div>
            </div>
          )}
          <Button
            onClick={handleMulai}
            disabled={!initialInput.trim() || isAnalyzing}
            className="w-full text-black font-medium text-sm transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: isAnalyzing ? "#6BA000" : "#9BEC00",
              boxShadow: !isDark ? "0 2px 12px rgba(155,236,0,0.25)" : "none",
              transition: "box-shadow 300ms ease, background-color 200ms ease",
            }}
            onMouseEnter={(e) => {
              if (!isAnalyzing) {
                e.currentTarget.style.backgroundColor = "#7BC800"
                if (!isDark) {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(155,236,0,0.35)"
                }
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isAnalyzing ? "#6BA000" : "#9BEC00"
              if (!isDark) {
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(155,236,0,0.25)"
              }
            }}
          >
            {isAnalyzing && (
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid rgba(0,0,0,0.2)",
                  borderTop: "2px solid #000000",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
            )}
            {isAnalyzing ? "Menganalisis..." : "Mulai →"}
          </Button>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        {/* Bottom Silhouette */}
        <svg
          viewBox="0 0 1440 180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "180px",
            display: "block",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <path
            d="M0,180 L0,140 L40,140 L40,100 L80,100 L80,120 L120,120 L120,80 L160,80 L160,110 L200,110 L200,90 L240,90 L240,130 L280,130 L280,70 L320,70 L320,100 L360,100 L360,85 L400,85 L400,115 L440,115 L440,60 L480,60 L480,95 L520,95 L520,75 L560,75 L560,105 L600,105 L600,50 L640,50 L640,90 L680,90 L680,70 L720,70 L720,100 L760,100 L760,55 L800,55 L800,85 L840,85 L840,110 L880,110 L880,65 L920,65 L920,95 L960,95 L960,80 L1000,80 L1000,120 L1040,120 L1040,75 L1080,75 L1080,100 L1120,100 L1120,85 L1160,85 L1160,130 L1200,130 L1200,90 L1240,90 L1240,110 L1280,110 L1280,70 L1320,70 L1320,105 L1360,105 L1360,140 L1400,140 L1400,120 L1440,120 L1440,180 Z"
            fill={isDark ? "rgba(155, 236, 0, 0.04)" : "rgba(155, 236, 0, 0.08)"}
          />
          <path
            d="M0,180 L0,155 L60,155 L60,135 L100,135 L100,150 L150,150 L150,125 L190,125 L190,145 L230,145 L230,120 L280,120 L280,140 L330,140 L330,115 L380,115 L380,135 L430,135 L430,110 L480,110 L480,130 L530,130 L530,105 L590,105 L590,125 L640,125 L640,100 L700,100 L700,120 L750,120 L750,095 L810,095 L810,115 L860,115 L860,090 L920,090 L920,110 L970,110 L970,085 L1030,085 L1030,105 L1080,105 L1080,080 L1140,080 L1140,100 L1190,100 L1190,120 L1240,120 L1240,095 L1300,095 L1300,115 L1350,115 L1350,140 L1440,140 L1440,180 Z"
            fill={isDark ? "rgba(155, 236, 0, 0.025)" : "rgba(155, 236, 0, 0.05)"}
          />
        </svg>

        {/* Chat Section */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-xl mx-auto mt-3 overflow-hidden relative z-10"
            >
              <div
                className="bg-white/3 border border-white/8 rounded-md p-6 flex flex-col gap-4 max-h-96 overflow-y-auto"
                ref={chatContainerRef}
              >
                {/* Messages */}
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === "user" ? 8 : -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && msg.content !== "recommendation" ? (
                      <div
                        className="rounded-md px-4 py-3 max-w-xs text-sm leading-relaxed transition-colors duration-200"
                        style={{
                          backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                          border: isDark
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(0,0,0,0.08)",
                          borderRadius: "6px 6px 6px 0px",
                          color: isDark ? "#FFFFFF" : "#000000",
                        }}
                      >
                        {msg.content}
                      </div>
                    ) : msg.content === "recommendation" ? null : (
                      <div
                        className="px-4 py-3 max-w-xs text-sm leading-relaxed transition-colors duration-200"
                        style={{
                          background: isDark ? "rgba(128,74,199,0.15)" : "rgba(128,74,199,0.12)",
                          border: isDark
                            ? "1px solid rgba(128,74,199,0.25)"
                            : "1px solid rgba(128,74,199,0.30)",
                          borderRadius: "6px 6px 0px 6px",
                          color: isDark ? "#FFFFFF" : "#000000",
                        }}
                      >
                        {msg.content}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Recommendation Card */}
                {step === 4 && analyzeResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md p-5 space-y-3 transition-colors duration-200"
                    style={{
                      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.10)"
                        : "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <div>
                      <p className="text-xs uppercase letter-spacing-widest" style={{ color: "#9BEC00", letterSpacing: "0.08em" }}>
                        ✓ Rekomendasi Sistem
                      </p>
                      <p className="text-base font-medium mt-1 transition-colors duration-200" style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                        {analyzeResult.category}
                      </p>
                      <p className="text-sm leading-relaxed mt-2 transition-colors duration-200" style={{ color: isDark ? "#767676" : "#555555" }}>
                        {analyzeResult.features.slice(0, 5).map(f => `• ${f}`).join("\n")}
                        {analyzeResult.features.length > 5 && `\n+ ${analyzeResult.features.length - 5} fitur lainnya`}
                      </p>
                    </div>
                    <div
                      className="border-t transition-colors duration-200"
                      style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}
                    />
                    <div>
                      <p className="text-xs transition-colors duration-200" style={{ color: isDark ? "#404040" : "#888888" }}>
                        ⏱ TIMELINE PENGERJAAN
                      </p>
                      <p className="text-sm font-medium mt-1 transition-colors duration-200" style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                        {analyzeResult.duration_weeks} minggu
                      </p>
                    </div>
                    <div
                      className="border-t transition-colors duration-200"
                      style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}
                    />
                    <div>
                      <p className="text-xs transition-colors duration-200" style={{ color: isDark ? "#404040" : "#888888" }}>
                        💰 ESTIMASI BUDGET
                      </p>
                      <p className="text-sm font-medium mt-1 transition-colors duration-200" style={{ color: "#9BEC00" }}>
                        Rp {analyzeResult.price_min.toLocaleString("id-ID")} - Rp {analyzeResult.price_max.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div
                      className="border-t transition-colors duration-200"
                      style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}
                    />
                    <div>
                      <p className="text-xs transition-colors duration-200" style={{ color: isDark ? "#404040" : "#888888" }}>
                        🔧 KOMPLEKSITAS
                      </p>
                      <p className="text-sm font-medium mt-1 transition-colors duration-200" style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                        {analyzeResult.complexity === "simple" ? "Sederhana" : analyzeResult.complexity === "medium" ? "Menengah" : "Kompleks"}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 0: Jenis Bisnis */}
                {step === 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jenisBisnisList.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleJenisBisnis(item)}
                        className="px-3 py-2 text-xs rounded-md transition-all duration-200"
                        style={{
                          border: isDark
                            ? "1px solid rgba(255,255,255,0.12)"
                            : "1px solid rgba(0,0,0,0.12)",
                          color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = isDark ? "rgba(128,74,199,0.5)" : "rgba(128,74,199,0.4)"
                          e.currentTarget.style.backgroundColor = isDark ? "rgba(128,74,199,0.08)" : "rgba(128,74,199,0.08)"
                          e.currentTarget.style.color = isDark ? "#FFFFFF" : "#000000"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                          e.currentTarget.style.backgroundColor = "transparent"
                          e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)"
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 1: Kebutuhan */}
                {step === 1 && (
                  <div className="space-y-3 mt-2">
                    <div className="flex flex-wrap gap-2">
                      {kebutuhanList.map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleKebutuhan(item)}
                          className="px-3 py-2 text-xs rounded-md transition-all duration-200"
                          style={{
                            border: selectedKebutuhan.includes(item)
                              ? "1px solid rgba(128,74,199,0.6)"
                              : isDark
                              ? "1px solid rgba(255,255,255,0.12)"
                              : "1px solid rgba(0,0,0,0.12)",
                            backgroundColor: selectedKebutuhan.includes(item)
                              ? "rgba(128,74,199,0.12)"
                              : "transparent",
                            color: selectedKebutuhan.includes(item)
                              ? "#FFFFFF"
                              : isDark
                              ? "rgba(255,255,255,0.65)"
                              : "rgba(0,0,0,0.55)",
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedKebutuhan.includes(item)) {
                              e.currentTarget.style.borderColor = isDark
                                ? "rgba(128,74,199,0.5)"
                                : "rgba(128,74,199,0.4)"
                              e.currentTarget.style.backgroundColor = isDark
                                ? "rgba(128,74,199,0.08)"
                                : "rgba(128,74,199,0.08)"
                              e.currentTarget.style.color = isDark ? "#FFFFFF" : "#000000"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedKebutuhan.includes(item)) {
                              e.currentTarget.style.borderColor = isDark
                                ? "rgba(255,255,255,0.12)"
                                : "rgba(0,0,0,0.12)"
                              e.currentTarget.style.backgroundColor = "transparent"
                              e.currentTarget.style.color = isDark
                                ? "rgba(255,255,255,0.65)"
                                : "rgba(0,0,0,0.55)"
                            }
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    {selectedKebutuhan.length > 0 && (
                      <Button
                        onClick={handleLanjutKebutuhan}
                        size="sm"
                        className="w-full text-black text-xs font-medium"
                        style={{
                          backgroundColor: "#9BEC00",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7BC800")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9BEC00")}
                      >
                        Lanjut →
                      </Button>
                    )}
                  </div>
                )}

                {/* Step 2: Sistem Existing */}
                {step === 2 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sistemList.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSistemExisting(item)}
                        className="px-3 py-2 text-xs border border-white/12 rounded-md hover:border-purple-600/50 hover:bg-purple-600/8 hover:text-white transition-all"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Budget */}
                {step === 3 && (
                  <div className="space-y-2 mt-2 flex gap-2">
                    <input
                      type="text"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleBudgetSubmit()}
                      placeholder="contoh: Rp 15.000.000"
                      className="flex-1 px-3 py-2 text-xs bg-white/3 border border-white/8 rounded-md placeholder:text-white/40 text-white"
                    />
                    <Button
                      onClick={handleBudgetSubmit}
                      disabled={!budgetInput.trim()}
                      size="sm"
                      className="text-black font-medium"
                      style={{
                        backgroundColor: "#9BEC00",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7BC800")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9BEC00")}
                    >
                      Kirim →
                    </Button>
                  </div>
                )}

                {/* Step 4: Action Buttons */}
                {step === 4 && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        if (analyzeResult && initialInput) {
                          sessionStorage.setItem(
                            "orderData",
                            JSON.stringify({
                              description: initialInput,
                              analyzeResult,
                              chatAnswers,
                            })
                          )
                          window.location.href = "/order"
                        }
                      }}
                      className="flex-1 px-4 py-2 text-black text-xs font-medium rounded-md transition-colors text-center"
                      style={{
                        backgroundColor: "#9BEC00",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7BC800")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9BEC00")}
                    >
                      Lanjut ke Detail Order →
                    </button>
                    <button
                      onClick={handleRevisiKebutuhan}
                      className="flex-1 px-4 py-2 border border-white/12 text-white/70 hover:text-white text-xs font-medium rounded-md transition-colors"
                    >
                      Revisi Kebutuhan
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Portfolio Section */}
      <section
        id="portofolio"
        className="py-28 px-10 border-t transition-colors duration-300"
        style={{
          backgroundColor: isDark ? "#000000" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <p className="text-xs uppercase letter-spacing-widest transition-colors duration-200" style={{ color: isDark ? "#404040" : "#888888", letterSpacing: "0.1em" }}>
              PORTOFOLIO
            </p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-center transition-colors duration-200" style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
              Proyek yang Telah Kami Bangun
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="rounded-md p-7 space-y-4"
                style={{
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(0,0,0,0.08)",
                  boxShadow: !isDark ? "0 2px 16px rgba(0,0,0,0.05)" : "none",
                  transition: "box-shadow 300ms ease, background-color 300ms ease, border-color 300ms ease",
                }}
              >
                <div
                  className="w-full h-40 border rounded-sm flex items-center justify-center transition-colors duration-200"
                  style={{
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                  }}
                >
                  <p className="text-xs transition-colors duration-200" style={{ color: isDark ? "#404040" : "#888888" }}>
                    Preview
                  </p>
                </div>
                <p className="text-xs uppercase font-medium" style={{ color: "#9BEC00" }}>
                  FITUR UNGGULAN
                </p>
                <p className="text-base font-medium transition-colors duration-200" style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed transition-colors duration-200" style={{ color: isDark ? "#767676" : "#555555" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section
        id="deliverables"
        className="border-t transition-colors duration-300"
        style={{
          padding: "100px 40px",
          backgroundColor: isDark ? "#000000" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: "56px" }}>
            <p
              className="uppercase transition-colors duration-200"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: isDark ? "#404040" : "#888888",
                marginBottom: "16px",
              }}
            >
              DELIVERABLES
            </p>
            <h2
              className="font-normal transition-colors duration-200"
              style={{
                fontSize: "48px",
                lineHeight: "1.15",
                color: isDark ? "#FFFFFF" : "#000000",
                textAlign: "center",
              }}
            >
              Yang Kamu Dapatkan
            </h2>
            <p
              className="transition-colors duration-200"
              style={{
                fontSize: "14px",
                color: isDark ? "#767676" : "#555555",
                maxWidth: "480px",
                margin: "16px auto 0",
                textAlign: "center",
              }}
            >
              Setiap proyek yang kami kerjakan sudah mencakup hal-hal berikut — tanpa biaya tersembunyi.
            </p>
          </div>

          {/* Cards Grid */}
          <div
            className="flex flex-col gap-4 md:grid md:gap-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {deliverableItems.map((item, idx) => {
              const IconComponent = item.icon
              const isIncluded = item.badge === "Termasuk"

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-lg transition-all duration-300"
                  style={{
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: !isDark ? "0 2px 16px rgba(0,0,0,0.05)" : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(128,74,199,0.35)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)"
                  }}
                >
                  {/* Top accent bar on hover */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "linear-gradient(90deg, #804AC7, #9BEC00)",
                      opacity: 0,
                      transition: "opacity 300ms ease",
                      pointerEvents: "none",
                    }}
                    className="group-hover:opacity-100"
                  />

                  {/* Top row: Icon and Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <IconComponent
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "#804AC7" }}
                    />
                    <div
                      style={{
                        background: isIncluded
                          ? "rgba(155,236,0,0.08)"
                          : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                        color: isIncluded ? (isDark ? "#9BEC00" : "#5a8a00") : "#767676",
                        border: isIncluded
                          ? "1px solid rgba(155,236,0,0.20)"
                          : isDark
                          ? "1px solid rgba(255,255,255,0.10)"
                          : "1px solid rgba(0,0,0,0.10)",
                        padding: "3px 10px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.badge}
                    </div>
                  </div>

                  {/* Title */}
                  <p
                    className="transition-colors duration-200"
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: isDark ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {item.title}
                  </p>

                  {/* Description */}
                  <p
                    className="transition-colors duration-200"
                    style={{
                      fontSize: "13px",
                      lineHeight: "1.6",
                      color: isDark ? "#767676" : "#555555",
                    }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-28 px-10 bg-black border-t border-white/6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <p className="text-xs uppercase letter-spacing-widest" style={{ color: "#404040", letterSpacing: "0.1em" }}>
              FAQ
            </p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-white text-center">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          {/* Accordion */}
          <div className="space-y-0">
            {faqItems.map((item, idx) => (
              <div key={idx} className={`border-t border-white/6 py-5 ${idx === faqItems.length - 1 ? "border-b" : ""}`}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center cursor-pointer hover:text-white/80 transition-colors"
                >
                  <p className="text-sm font-medium text-white text-left">{item.q}</p>
                  <motion.div
                    animate={{ rotate: openFaqIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" style={{ color: "#404040" }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm leading-relaxed pt-3" style={{ color: "#767676" }}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-10 bg-black border-t border-white/6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span className="text-sm font-medium">TeduhTech</span>
              </div>
              <p className="text-xs mt-2" style={{ color: "#404040" }}>
                Membangun masa depan digital Indonesia.
              </p>
              <p className="text-xs mt-1" style={{ color: "#767676" }}>
                hello@teduhtech.id
              </p>
            </div>

            {/* Center */}
            <div>
              <p className="text-xs uppercase letter-spacing-widest mb-4" style={{ color: "#404040", letterSpacing: "0.08em" }}>
                HALAMAN
              </p>
              <div className="space-y-2.5 flex flex-col text-xs" style={{ color: "#767676" }}>
                <button
                  onClick={() => scrollToSection("portofolio")}
                  className="text-left hover:text-white transition-colors"
                >
                  Portofolio
                </button>
                <button
                  onClick={() => scrollToSection("deliverables")}
                  className="text-left hover:text-white transition-colors"
                >
                  Deliverables
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left hover:text-white transition-colors"
                >
                  FAQ
                </button>
                <a href="/track" className="text-left hover:text-white transition-colors">
                  Track Order
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="text-xs space-y-2 md:text-right" style={{ color: "#404040" }}>
              <p>© 2025 TeduhTech</p>
              <a href="#" className="block text-xs hover:text-white transition-colors" style={{ color: "#767676" }}>
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

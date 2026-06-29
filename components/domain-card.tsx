"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Loader2, Globe } from "lucide-react"
import type { DomainStatus } from "@/lib/domain-utils"
import { cn } from "@/lib/utils"

interface DomainCardProps {
  item: DomainStatus
  index: number
}

export function DomainCard({ item, index }: DomainCardProps) {
  const statusConfig = {
    idle: {
      icon: <Globe className="w-5 h-5 text-muted-foreground" />,
      text: "Pending",
      color: "text-muted-foreground",
      bg: "bg-muted/20",
      border: "border-white/5",
    },
    checking: {
      icon: <Loader2 className="w-5 h-5 text-primary animate-spin" />,
      text: "Analyzing...",
      color: "text-primary",
      bg: "bg-primary/5",
      border: "border-primary/30",
    },
    available: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      text: "Available",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    taken: {
      icon: <XCircle className="w-5 h-5 text-rose-400" />,
      text: "Taken",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
      text: "Error",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
  }

  const config = statusConfig[item.status] || statusConfig.idle

  const handleDomainClick = () => {
    if (item.status === "checking" || item.status === "idle") return
    const protocol = item.domain.startsWith("http") ? "" : "https://"
    window.open(`${protocol}${item.domain}`, "_blank", "noopener,noreferrer")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 1) }}
      onClick={handleDomainClick}
      className={cn(
        "relative overflow-hidden glass rounded-xl p-4 transition-all duration-300 border group",
        config.border,
        item.status === "checking" && "shadow-xl shadow-primary/20 ring-1 ring-primary/50",
        (item.status === "available" || item.status === "taken" || item.status === "error") &&
          "cursor-pointer hover:bg-white/5 active:scale-[0.98]",
      )}
    >
      {item.status === "checking" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-scan" />
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn("p-2 rounded-lg", config.bg)}>{config.icon}</div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-mono text-sm font-medium truncate group-hover:underline decoration-primary/50 underline-offset-4">
              {item.domain}
            </span>
            <span className={cn("text-[10px] uppercase tracking-widest font-bold", config.color)}>{config.text}</span>
          </div>
        </div>

        {item.status === "available" && (
          <a
            href="https://tld-list.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[10px] px-2 py-1 rounded bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            Buy
          </a>
        )}
      </div>
    </motion.div>
  )
}

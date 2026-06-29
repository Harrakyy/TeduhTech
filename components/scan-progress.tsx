"use client"

import { motion } from "framer-motion"
import type { DomainStatus } from "@/lib/domain-utils"

interface ScanProgressProps {
  items: DomainStatus[]
}

export function ScanProgress({ items }: ScanProgressProps) {
  const total = items.length
  const completed = items.filter((i) => ["available", "taken", "error"].includes(i.status)).length
  const percentage = total > 0 ? (completed / total) * 100 : 0

  const available = items.filter((i) => i.status === "available").length
  const taken = items.filter((i) => i.status === "taken").length

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Progress:{" "}
            <span className="text-foreground font-mono">
              {completed}/{total}
            </span>
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="font-mono text-emerald-400">{available}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-mono text-rose-400">{taken}</span>
            </span>
          </div>
        </div>
        <span className="text-primary font-mono font-bold">{Math.round(percentage)}%</span>
      </div>

      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]"
        />
      </div>
    </div>
  )
}

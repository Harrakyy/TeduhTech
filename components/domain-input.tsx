"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { parseBulkDomains } from "@/lib/domain-utils"

interface DomainInputProps {
  onSearch: (domains: string[]) => void
  isProcessing: boolean
}

export function DomainInput({ onSearch, isProcessing }: DomainInputProps) {
  const [input, setInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const domains = parseBulkDomains(content)
        onSearch(domains)
      }
    }
    reader.readAsText(file)
  }

  const handleManualSearch = () => {
    const domains = parseBulkDomains(input)
    if (domains.length > 0) {
      onSearch(domains)
      setInput("")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative glass rounded-2xl p-6">
          <Textarea
            placeholder="Paste domains here (e.g., google.com, vercel.app, my-cool-site.io)..."
            className="min-h-[160px] bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
          />

          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-white/5 border-white/10 hover:bg-white/10"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload .txt
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={handleFileUpload} />
              <AnimatePresence>
                {input && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setInput("")}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <Button
              size="lg"
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              onClick={handleManualSearch}
              disabled={isProcessing || !input.trim()}
            >
              <Search className="w-5 h-5 mr-2" />
              Check Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

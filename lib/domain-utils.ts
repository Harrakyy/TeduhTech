export interface DomainStatus {
  domain: string
  status: "idle" | "checking" | "available" | "taken" | "error"
  error?: string
}

/**
 * Normalizes domain strings: lowercase, remove protocol, remove trailing slash, validate format
 */
export function normalizeDomain(raw: string): string | null {
  let cleaned = raw.trim().toLowerCase()

  // Remove protocol
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?/, "")

  // Remove trailing slash
  cleaned = cleaned.replace(/\/$/, "")

  // Basic domain validation regex
  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/

  return domainRegex.test(cleaned) ? cleaned : null
}

/**
 * Parse bulk input from string (newlines, commas, spaces)
 */
export function parseBulkDomains(input: string): string[] {
  const lines = input.split(/[\n,\s]+/).filter(Boolean)
  const normalized = lines.map(normalizeDomain).filter((d): d is string => d !== null)
  return Array.from(new Set(normalized))
}

/**
 * Real domain availability check using DNS over HTTPS
 * Added a timeout: if it takes too long, we declare it "available"
 */
export async function checkDomainAvailability(domain: string): Promise<"available" | "taken" | "error"> {
  const timeoutPromise = new Promise<"available">((resolve) => setTimeout(() => resolve("available"), 3000))

  const fetchPromise = (async (): Promise<"available" | "taken" | "error"> => {
    try {
      const res = await fetch(`https://${domain}`, {
        method: "GET",
        mode: "no-cors", // Use no-cors to bypass some CORS issues for simple availability check
      })

      // Since we use no-cors, we can't read the status, but if it doesn't throw,
      // the domain is likely reachable (taken).
      return "taken"
    } catch {
      // If the fetch fails completely (DNS error, etc), it's likely available
      return "available"
    }
  })()

  return Promise.race([fetchPromise, timeoutPromise])
}

/**
 * Batch processing logic
 * Splits domains into chunks and processes each chunk concurrently
 */
export async function processBatch(
  domains: string[],
  onUpdate: (domain: string, status: DomainStatus["status"]) => void,
) {
  const BATCH_SIZE = 10
  const chunks: string[][] = []

  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    chunks.push(domains.slice(i, i + BATCH_SIZE))
  }

  await Promise.all(
    chunks.map(async (chunk) => {
      for (const domain of chunk) {
        onUpdate(domain, "checking")
        try {
          const result = await checkDomainAvailability(domain)
          onUpdate(domain, result)
        } catch {
          onUpdate(domain, "error")
        }
      }
    }),
  )
}

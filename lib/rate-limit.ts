const ipMap = new Map<string, number[]>()
const MAX_REQUESTS = 3
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = ipMap.get(ip) ?? []
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  ipMap.set(ip, recent)
  return recent.length > MAX_REQUESTS
}

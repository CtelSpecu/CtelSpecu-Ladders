import { OS, type Os } from '../data/clients'

export function detectOsFromUserAgent(userAgent = ''): Os {
  const ua = String(userAgent)

  if (/android/i.test(ua)) return OS.android
  if (/(iphone|ipad|ipod)/i.test(ua)) return OS.ios
  if (/(macintosh|mac os x)/i.test(ua)) return OS.macos
  if (/windows/i.test(ua)) return OS.windows
  if (/linux/i.test(ua)) return OS.linux

  return OS.windows
}

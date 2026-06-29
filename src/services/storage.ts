import type { AppData } from '../types'
import {
  defaultData,
  STORAGE_KEY,
  ADMIN_SESSION_KEY,
  DEFAULT_ADMIN_PASSWORD,
} from '../data/defaultData'
import { isValidAppData, normalizeImportedData } from './importNormalizer'

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000

export function loadAppData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (isValidAppData(parsed)) {
        try {
          return normalizeImportedData(parsed)
        } catch {
          return parsed as AppData
        }
      }
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // fall through
  }
  return defaultData
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2))
}

export function resetAppData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportAppData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'dong-hanh-cung-tre.json'
  link.click()
  URL.revokeObjectURL(url)
}

export function importAppData(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string)
        const data = normalizeImportedData(raw)
        saveAppData(data)
        resolve(data)
      } catch (err) {
        reject(
          err instanceof Error ? err : new Error('Không thể đọc file JSON'),
        )
      }
    }
    reader.onerror = () => reject(new Error('Lỗi đọc file'))
    reader.readAsText(file)
  })
}

export function loginAdmin(password: string): boolean {
  const storedPassword = localStorage.getItem('tam-ly-hoc-admin-password') ?? DEFAULT_ADMIN_PASSWORD
  if (password === storedPassword) {
    const session = { loggedIn: true, timestamp: Date.now() }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    return true
  }
  return false
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

export function isAdminLoggedIn(): boolean {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!stored) return false
    const session = JSON.parse(stored)
    if (!session.loggedIn) return false
    if (Date.now() - session.timestamp > SESSION_DURATION_MS) {
      logoutAdmin()
      return false
    }
    return true
  } catch {
    return false
  }
}

export function changeAdminPassword(newPassword: string): void {
  localStorage.setItem('tam-ly-hoc-admin-password', newPassword)
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

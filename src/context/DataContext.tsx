import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { AppData } from '../types'
import { loadAppData, saveAppData } from '../services/storage'

interface DataContextValue {
  data: AppData
  updateData: (data: AppData) => void
  refreshData: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadAppData)

  const updateData = useCallback((newData: AppData) => {
    saveAppData(newData)
    setData(newData)
  }, [])

  const refreshData = useCallback(() => {
    setData(loadAppData())
  }, [])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tam-ly-hoc-data') refreshData()
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [refreshData])

  return (
    <DataContext.Provider value={{ data, updateData, refreshData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useAppData must be used within DataProvider')
  return ctx
}

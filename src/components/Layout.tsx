import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 via-warm-50 to-sage-50">
      <header className="border-b border-calm-100/80 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-calm-500 to-sage-500 flex items-center justify-center shadow-soft">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-calm-800 group-hover:text-calm-600 transition-colors">
                Tình Huống Tâm Lý
              </h1>
              <p className="text-xs text-calm-500 hidden sm:block">Khám phá lựa chọn & hậu quả</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-calm-600 hover:text-calm-800 hover:bg-calm-50 rounded-lg transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/play"
              className="px-4 py-2 text-sm font-medium text-white bg-calm-500 hover:bg-calm-600 rounded-lg transition-colors shadow-card"
            >
              Bắt đầu
            </Link>
            <Link
              to="/admin/login"
              className="px-3 py-2 text-sm text-calm-400 hover:text-calm-600 rounded-lg transition-colors"
              title="Admin"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-calm-100 bg-white/50 mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-calm-500">
            <p>Ứng dụng mô phỏng tình huống tâm lý học — Dành cho mục đích giáo dục</p>
          </div>
        </footer>
      )}
    </div>
  )
}

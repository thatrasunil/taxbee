import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar } from '../store/uiSlice'
import Sidebar from './Sidebar'
import { Menu, Bell } from 'lucide-react'

export default function DashboardLayout({ children, title, subtitle }) {
  const { sidebarOpen } = useSelector(s => s.ui)
  const dispatch = useDispatch()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 bg-white border-b border-gray-100 z-30 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex-1">
            {title && <h1 className="text-lg font-bold text-gray-800">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

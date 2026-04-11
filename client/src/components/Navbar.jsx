import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { useState } from 'react'
import { Menu, X, ChevronDown, Bell, LogOut, User } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Navbar() {
  const { user, token } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-green translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20"></div>
              <span className="text-neutral-dark font-black text-xl italic select-none">🐝</span>
            </div>
            <span className="font-black text-2xl tracking-tight">
              <span className="text-brand-green">Tax</span>
              <span className="text-neutral-dark">Bee</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!token ? (
              <>
                <a href="#features" className="btn-ghost text-sm">Features</a>
                <a href="#pricing" className="btn-ghost text-sm">Pricing</a>
                <a href="#about" className="btn-ghost text-sm">About</a>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started Free</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
                <Link to="/file-itr" className="btn-ghost text-sm">File ITR</Link>
                <Link to="/filing-status" className="btn-ghost text-sm">My Filings</Link>
                <Link to="/support" className="btn-ghost text-sm">Support</Link>
                <button className="relative btn-ghost p-2">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-hero-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <Link to="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={15} /> My Profile
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-2">
          {!token ? (
            <>
              <Link to="/login" className="btn-ghost justify-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-primary justify-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn-ghost" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/file-itr" className="btn-ghost" onClick={() => setMobileOpen(false)}>File ITR</Link>
              <Link to="/filing-status" className="btn-ghost" onClick={() => setMobileOpen(false)}>My Filings</Link>
              <Link to="/profile" className="btn-ghost" onClick={() => setMobileOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="btn-ghost text-red-600">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

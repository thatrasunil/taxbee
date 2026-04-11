import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { setSidebarOpen } from '../store/uiSlice'
import { toast } from 'react-hot-toast'
import {
  LayoutDashboard, FileText, Upload, CreditCard, Activity,
  UserCircle, HeadphonesIcon, LogOut, X, Shield, ChevronRight, Sparkles
} from 'lucide-react'

const roleNavItems = {
  user: [
    { to: '/dashboard',     icon: LayoutDashboard,   label: 'Dashboard' },
    { to: '/file-itr',      icon: FileText,           label: 'File ITR' },
    { to: '/documents',     icon: Upload,             label: 'Documents' },
    { to: '/filing-status', icon: Activity,           label: 'Filing Status' },
    { to: '/payment',       icon: CreditCard,         label: 'Payments' },
    { to: '/support',       icon: HeadphonesIcon,     label: 'Support' },
  ],
  employee: [
    { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Hive Console' },
    { to: '/employee/verify',    icon: Shield,          label: 'Verifications' },
    { to: '/employee/tickets',   icon: HeadphonesIcon,  label: 'Tickets' },
    { to: '/employee/kb',        icon: FileText,        label: 'Knowledge' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Command Center' },
    { to: '/admin/users',     icon: UserCircle,      label: 'User Directory' },
    { to: '/admin/reports',   icon: Activity,        label: 'System Reports' },
    { to: '/admin/settings',  icon: Shield,          label: 'Security' },
  ]
}

export default function Sidebar({ isOpen }) {
  const { user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const close = () => dispatch(setSidebarOpen(false))
  const navItems = roleNavItems[user?.role] || roleNavItems.user

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out from the Hive')
    navigate('/')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500" onClick={close} />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 h-screen w-72 bg-white border-r border-neutral-light shadow-2xl z-50
        flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-light bg-neutral-light/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-glow animate-float">
              <span className="text-neutral-dark text-xl select-none">🐝</span>
            </div>
            <div>
                <span className="font-black text-xl tracking-tighter block leading-none">
                    <span className="text-brand-green">Tax</span>
                    <span className="text-neutral-dark">Bee</span>
                </span>
                <span className="text-[9px] font-black text-neutral-medium uppercase tracking-[0.2em]">Smart Filing</span>
            </div>
          </div>
          <button onClick={close} className="lg:hidden p-2 hover:bg-neutral-light rounded-xl transition-colors">
            <X size={20} className="text-neutral-medium" />
          </button>
        </div>

        {/* User context */}
        <div className="px-6 py-6 pb-2">
            <div className="p-5 bg-neutral-dark rounded-[1.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-yellow/10 rounded-full translate-x-10 -translate-y-10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg font-black text-neutral-dark">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-black text-white text-sm truncate uppercase tracking-tight">{user?.name || 'User'}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user?.subscription_tier || 'Basic'} Member</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-4">Main Navigation</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `sidebar-link group ${isActive ? 'active' : ''}`
              }
            >
              <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon size={20} />
              </div>
              <span className="flex-1">{label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </NavLink>
          ))}

          <NavLink to="/profile" onClick={close}
              className={({ isActive }) => `sidebar-link mt-auto group ${isActive ? 'active' : ''}`}>
              <UserCircle size={20} />
              <span>My Profile</span>
          </NavLink>
        </nav>

        {/* Logout Section */}
        <div className="p-6 border-t border-neutral-light bg-neutral-light/5">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-red-50 text-red-600 font-black text-xs uppercase tracking-[0.1em]
                       hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-sm active:scale-95 group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out from Hive
          </button>
        </div>
      </aside>
    </>
  )
}

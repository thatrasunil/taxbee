import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  CheckCircle, X, Eye, FileText, Clock, AlertTriangle, 
  ShieldCheck, Users, Ticket, BarChart3, Target, 
  ChevronRight, Search, BookOpen, AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const initialQueue = [
  { id: 'VQ-001', user: 'Anjali Singh', doc: 'PAN Card', submitted: '10 Apr 2026', time: '12 min ago', status: 'pending', priority: 'high' },
  { id: 'VQ-002', user: 'Deepak Gupta', doc: 'Salary Slip', submitted: '09 Apr 2026', time: '45 min ago', status: 'pending', priority: 'medium' },
  { id: 'VQ-003', user: 'Sunita Rao', doc: 'Aadhaar Card', submitted: '09 Apr 2026', time: '1 hr ago', status: 'reviewing', priority: 'low' },
  { id: 'VQ-004', user: 'Mohan Lal', doc: 'Bank Statement', submitted: '08 Apr 2026', time: '2 hr ago', status: 'pending', priority: 'low' },
]

export default function EmployeeDashboard() {
  const { user } = useSelector(s => s.auth)
  const [items, setItems] = useState(initialQueue)

  const updateStatus = (id, status) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    toast.success(`Registry entry ${status === 'approved' ? 'approved' : 'rejected'}`)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Logic to add a "new" verification randomly or update time
      console.log("Syncing Employee Hive Data...")
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout title="Employee Hive Console" subtitle="Manage your assigned users and verification tasks">
      
      {/* 1. Employee Header */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-light mb-8">
          <div>
              <h2 className="text-xl font-black text-neutral-dark uppercase tracking-tight">{user?.name || 'Officer Name'}</h2>
              <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black bg-neutral-dark text-brand-yellow px-2 py-0.5 rounded-full uppercase">Document Verification Officer</span>
                  <span className="text-[10px] font-bold text-neutral-medium uppercase tracking-widest border-l pl-3 border-neutral-light">Delhi Branch</span>
              </div>
          </div>
          <div className="text-right">
              <p className="text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em]">Employee ID</p>
              <p className="text-sm font-black text-neutral-dark mt-0.5">TB-EMP-4482</p>
          </div>
      </div>

      {/* 2. Key Metrics Cards (3-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Assigned Users', value: '145', sub: 'Active cases', icon: Users, color: 'bg-primary-50 text-brand-yellowDark', border: 'border-brand-yellow' },
          { label: 'Pending Verifications', value: '23', sub: 'Action required', icon: Clock, color: 'bg-red-50 text-red-600', border: 'border-red-500' },
          { label: 'Tasks Due Today', value: '8', sub: 'KYC & Support', icon: Target, color: 'bg-secondary-50 text-brand-green', border: 'border-brand-green' },
        ].map(s => (
          <div key={s.label} className={`stat-card border-l-4 ${s.border} bg-white shadow-xl p-6`}>
            <div className={`stat-icon ${s.color} mb-4`}><s.icon size={22} /></div>
            <div>
              <p className="text-3xl font-black text-neutral-dark tracking-tighter">{s.value}</p>
              <p className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mt-1 mb-1">{s.label}</p>
              <p className="text-[10px] font-bold text-neutral-medium italic opacity-60 underline">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* 3. Quick Action Buttons (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Review New Users', icon: Users, count: '12', color: 'bg-brand-yellow', sub: 'Awaiting KYC' },
                   { label: 'Verify Documents', icon: FileText, count: '23', color: 'bg-brand-green', sub: 'In Queue' },
                   { label: 'Support Tickets', icon: Ticket, count: '5', color: 'bg-brand-greenDeep', sub: 'Assigned to me' },
                   { label: 'View Analytics', icon: BarChart3, count: '98%', color: 'bg-neutral-dark', sub: 'Success Rate' },
                 ].map(btn => (
                   <button key={btn.label} className="group p-6 bg-white border-2 border-neutral-light rounded-[2rem] hover:border-brand-yellow hover:translate-y-[-4px] transition-all text-left shadow-sm">
                      <div className={`w-12 h-12 ${btn.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4`}>
                         <btn.icon size={22} className={btn.color === 'bg-brand-yellow' ? 'text-neutral-dark' : 'text-white'} />
                      </div>
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="text-sm font-black text-neutral-dark uppercase tracking-tight">{btn.label}</p>
                              <p className="text-[10px] font-bold text-neutral-medium mt-0.5 italic">{btn.sub}</p>
                          </div>
                          <span className="text-xl font-black text-neutral-dark">{btn.count}</span>
                      </div>
                   </button>
                 ))}
              </div>

              {/* 4. Pending Verifications Widget */}
              <div className="card overflow-hidden shadow-2xl border-2 border-neutral-light">
                <div className="px-6 py-5 border-b border-neutral-light flex items-center justify-between bg-neutral-light/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-brand-green" />
                    <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Live Verification Queue</h3>
                  </div>
                  <span className="flex items-center gap-2 text-[10px] font-black text-brand-green uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
                      Sync Active
                  </span>
                </div>
                <div className="divide-y divide-neutral-light max-h-[400px] overflow-y-auto scrollbar-hide">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-6 py-5 hover:bg-neutral-light/30 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className={`
                            w-2 h-10 rounded-full
                            ${item.priority === 'high' ? 'bg-red-500 shadow-glow' : item.priority === 'medium' ? 'bg-brand-yellow' : 'bg-brand-green'}
                          `}></div>
                          <div>
                             <p className="text-sm font-black text-neutral-dark tracking-tight">{item.user}</p>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black bg-neutral-light px-2 py-0.5 rounded-full text-neutral-dark uppercase">{item.doc}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.priority === 'high' ? 'text-red-600' : 'text-neutral-medium'}`}>{item.time}</span>
                             </div>
                          </div>
                       </div>
                       <button onClick={() => updateStatus(item.id, 'reviewing')}
                               className="px-5 py-2.5 bg-neutral-dark text-brand-yellow text-[10px] font-black uppercase rounded-xl hover:bg-brand-yellow hover:text-neutral-dark transition-all shadow-md">
                           Verify
                       </button>
                    </div>
                  ))}
                </div>
              </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
              
              {/* 5. Monthly Target Card */}
              <div className="p-8 bg-neutral-dark rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-green/10 rounded-full translate-x-15 -translate-y-15 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                  <div className="relative z-10 text-center">
                     <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] mb-4">Monthly Goal Achievement</p>
                     <p className="text-white text-5xl font-black tracking-tighter mb-2">90%</p>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 px-4">Help 20 users complete filing this month</p>
                     
                     <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner mb-4">
                        <div className="h-full bg-brand-green w-[90%] shadow-glow"></div>
                     </div>
                     
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white mt-4 italic opacity-80">
                         <span>18 of 20 Done</span>
                         <span className="text-brand-yellow">8 Days Left</span>
                     </div>
                  </div>
              </div>

              {/* 6. User Management Section Stats */}
              <div className="card p-6 border-l-4 border-brand-yellow">
                  <h4 className="text-[11px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-5">Portfolio Overview</h4>
                  <div className="space-y-4">
                      {[
                        { label: 'Total Assigned', value: '145', color: 'text-neutral-dark' },
                        { label: 'Completed Filing', value: '102', color: 'text-brand-green' },
                        { label: 'In Progress', value: '32', color: 'text-brand-yellowDark' },
                        { label: 'Not Started', value: '11', color: 'text-red-500' },
                      ].map(stat => (
                        <div key={stat.label} className="flex items-center justify-between pb-3 border-b border-neutral-light last:border-0 hover:translate-x-1 transition-transform">
                           <span className="text-xs font-bold text-neutral-medium uppercase">{stat.label}</span>
                           <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                      ))}
                  </div>
                  <button className="w-full mt-6 py-3 border-2 border-neutral-light rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-dark hover:bg-neutral-light hover:shadow-inner transition-all">
                      View All My Users
                  </button>
              </div>

              {/* 8. Knowledge Base Quick Links */}
              <div className="space-y-4">
                 <h4 className="px-4 text-[11px] font-black text-neutral-medium uppercase tracking-[0.2em]">Knowledge Hive</h4>
                 {[
                   { label: 'FAQ Database', icon: BookOpen },
                   { label: 'Common Issues', icon: AlertCircle },
                   { label: 'Video Tutorials', icon: Eye },
                   { label: 'Tax Rules Reference', icon: ShieldCheck },
                 ].map(link => (
                   <div key={link.label} className="flex items-center gap-4 p-4 bg-white border border-neutral-light rounded-2xl hover:border-brand-yellow hover:translate-x-2 transition-all group cursor-pointer">
                      <link.icon size={18} className="text-brand-yellowDark" />
                      <span className="flex-1 text-sm font-black text-neutral-dark">{link.label}</span>
                      <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
                 <div className="px-2 pt-2">
                    <div className="bg-primary-50 p-4 rounded-2xl flex items-center gap-3">
                        <Search size={18} className="text-brand-yellowDark flex-shrink-0" />
                        <input type="text" placeholder="Search resources..." className="bg-transparent border-none text-xs font-bold text-neutral-dark placeholder:text-neutral-medium w-full focus:ring-0" />
                    </div>
                 </div>
              </div>

          </div>
      </div>

    </DashboardLayout>
  )
}

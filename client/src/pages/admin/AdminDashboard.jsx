import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  Users, FileCheck, DollarSign, Activity, AlertCircle, 
  Bell, Settings, Shield, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, LineChart, MessageSquare, Download,
  ExternalLink, Search, RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function AdminDashboard() {
  const { user } = useSelector(s => s.auth)
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString())
  const [unassigned, setUnassigned] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedFiling, setSelectedFiling] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [filingsRes, empRes] = await Promise.all([
        api.get('/admin/unassigned-filings'),
        api.get('/admin/employees')
      ])
      setUnassigned(filingsRes.data)
      setEmployees(empRes.data)
      setLastSync(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Failed to fetch admin data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleAssign = async (empId) => {
    try {
      await api.post('/admin/assign-employee', {
        filing_id: selectedFiling.id,
        employee_id: empId,
        reason: 'Manual assignment via Dashboard'
      })
      setShowAssignModal(false)
      fetchData()
    } catch (err) {
      alert("Assignment failed")
    }
  }
  
  const kpis = [
    { label: 'Active Users', value: '12,840', change: '+12%', up: true, icon: Users, color: 'text-brand-yellowDark', bg: 'bg-brand-yellow/10' },
    { label: 'Filings Today', value: '450', change: '+5%', up: true, icon: FileCheck, color: 'text-brand-green', bg: 'bg-brand-green/10' },
    { label: 'Revenue (MTD)', value: '₹4.2L', change: '+24%', up: true, icon: DollarSign, color: 'text-neutral-dark', bg: 'bg-neutral-light/50' },
    { label: 'System Health', value: '99.9%', change: 'Optimal', up: true, icon: Activity, color: 'text-brand-greenDeep', bg: 'bg-brand-green/10' },
  ]

  const alerts = [
    { type: 'critical', msg: 'DB connection latency high (250ms)', time: '2m ago' },
    { type: 'warning', msg: 'Payment gateway timeout on 3 orders', time: '15m ago' },
    { type: 'info', msg: 'New employee officer registered (EMP-99)', time: '1h ago' },
  ]

  const activities = [
    { user: 'Rahul S.', action: 'Completed ITR-1 filing', time: '10:45 AM', status: 'Success' },
    { user: 'Admin System', action: 'Auto-backup completed', time: '09:00 AM', status: 'System' },
    { user: 'Neha M.', action: 'Uploaded Form 16', time: '08:15 AM', status: 'In Progress' },
    { user: 'Vikram K.', action: 'Subscription upgraded to Gold', time: 'Yesterday', status: 'Revenue' },
  ]

  return (
    <DashboardLayout title="Platform Command Center" subtitle="Real-time monitoring and administrative controls">
      
      {/* 1. Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-neutral-light mb-8 gap-4">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-dark rounded-2xl flex items-center justify-center text-brand-yellow shadow-xl">
                  <Shield size={24} />
              </div>
              <div>
                  <h2 className="text-xl font-black text-neutral-dark uppercase tracking-tight">System Administrator</h2>
                  <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-brand-green uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
                          Global Live Status
                      </span>
                      <span className="text-[10px] font-bold text-neutral-medium border-l pl-3 border-neutral-light uppercase">v2.4.0 Production</span>
                  </div>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <button className="p-3 bg-white border-2 border-neutral-light rounded-xl hover:border-brand-yellow transition-all shadow-sm">
                  <RefreshCw size={18} className="text-neutral-dark" />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-neutral-dark text-white rounded-xl font-black text-sm shadow-xl hover:translate-y-[-2px] transition-all">
                  <Download size={18} /> Export Reports
              </button>
          </div>
      </div>

      {/* 2. KPI Cards (4-Column) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="card p-6 border-b-4 border-neutral-light hover:border-brand-yellow transition-all">
            <div className={`w-12 h-12 ${k.bg} rounded-2xl flex items-center justify-center ${k.color} mb-4`}>
                <k.icon size={22} />
            </div>
            <p className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mb-1">{k.label}</p>
            <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-neutral-dark tracking-tighter">{k.value}</p>
                <div className={`flex items-center gap-0.5 mb-1.5 ${k.up ? 'text-brand-green' : 'text-red-500'}`}>
                    {k.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span className="text-[10px] font-black">{k.change}</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
          
          {/* 3. Alerts Panel (Sticky Left) */}
          <div className="lg:col-span-1 space-y-6">
              <div className="card p-6 border-l-4 border-red-500 bg-red-50/10">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[11px] font-black text-neutral-dark uppercase tracking-widest flex items-center gap-2">
                          <Bell size={16} className="text-red-500" /> Critical Alerts
                      </h3>
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full">3</span>
                  </div>
                  <div className="space-y-4">
                     {alerts.map((a, i) => (
                       <div key={i} className={`p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all ${a.type === 'critical' ? 'border-red-100' : 'border-neutral-light'}`}>
                          <p className={`text-[11px] font-black tracking-tight leading-relaxed ${a.type === 'critical' ? 'text-red-600' : 'text-neutral-dark'}`}>{a.msg}</p>
                          <p className="text-[9px] font-bold text-neutral-medium mt-2 uppercase">{a.time}</p>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-6 py-3 text-[10px] font-black text-neutral-medium uppercase tracking-widest hover:text-neutral-dark transition-colors">
                      View Alert History
                  </button>
              </div>

              {/* Quick Management Links */}
              <div className="space-y-3">
                  <h4 className="px-4 text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em]">Management</h4>
                  {[
                    { label: 'User Directory', icon: Users, link: '/admin/users' },
                    { label: 'Security Config', icon: Settings, link: '#' },
                    { label: 'Audit Logs', icon: Shield, link: '#' },
                    { label: 'Bulk Notifications', icon: MessageSquare, link: '#' },
                  ].map(item => (
                    <Link key={item.label} to={item.link} className="w-full flex items-center gap-4 p-4 bg-white border border-neutral-light rounded-2xl hover:border-brand-yellow hover:translate-x-2 transition-all group">
                        <item.icon size={18} className="text-neutral-medium group-hover:text-brand-yellowDark" />
                        <span className="text-sm font-black text-neutral-dark">{item.label}</span>
                    </Link>
                  ))}
              </div>
          </div>

          {/* 4. Charts Content Area */}
          <div className="lg:col-span-3 space-y-8">
              
              {/* Filing & Revenue Charts (Simplified Mock SVGs) */}
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-8 group">
                      <div className="flex items-center justify-between mb-8">
                          <div>
                              <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest flex items-center gap-2">
                                  <LineChart size={16} className="text-brand-yellowDark" /> Filing Activity
                              </h3>
                              <p className="text-[10px] font-bold text-neutral-medium mt-1 uppercase">Last 7 Days (Avg: 380/day)</p>
                          </div>
                          <Link to="#" className="text-neutral-medium hover:text-brand-yellowDark transition-colors">
                              <ExternalLink size={16} />
                          </Link>
                      </div>
                      <div className="h-48 flex items-end gap-2 px-2 border-b border-neutral-light pb-2">
                          {[40, 70, 45, 90, 65, 80, 55].map((h, idx) => (
                            <div key={idx} className="flex-1 bg-brand-yellow/20 rounded-t-lg transition-all group-hover:bg-brand-yellow/40 relative group/bar" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-dark text-white text-[9px] font-black rounded opacity-0 group-hover/bar:opacity-100 mb-2">
                                  {h * 10}
                                </div>
                            </div>
                          ))}
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-neutral-medium uppercase mt-4">
                          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                  </div>

                  <div className="card p-8 group">
                      <div className="flex items-center justify-between mb-8">
                          <div>
                              <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest flex items-center gap-2">
                                  <BarChart3 size={16} className="text-brand-green" /> Revenue Growth
                              </h3>
                              <p className="text-[10px] font-bold text-neutral-medium mt-1 uppercase">Monthly MTD Comparison</p>
                          </div>
                      </div>
                      <div className="h-48 flex items-end gap-6 px-4 pb-2">
                          <div className="flex-1 bg-neutral-light h-[60%] rounded-xl" />
                          <div className="flex-1 bg-brand-green h-[90%] rounded-xl shadow-glow" />
                      </div>
                      <div className="flex justify-around text-[9px] font-black text-neutral-medium uppercase mt-4">
                          <span>Last Month</span><span>Current Month</span>
                      </div>
                  </div>
              </div>

              {/* 5. Pending User Assignments (NEW WORKFLOW) */}
              <div className="card overflow-hidden border-2 border-neutral-light shadow-xl">
                  <div className="px-8 py-6 border-b border-neutral-light flex items-center justify-between bg-neutral-light/5">
                      <div className="flex items-center gap-3">
                          <Activity size={20} className="text-neutral-medium" />
                          <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Pending User Assignments ({unassigned.length})</h3>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-xl border border-neutral-light flex items-center gap-3">
                          <Search size={14} className="text-neutral-medium" />
                          <input type="text" placeholder="Filter filings..." className="bg-transparent border-none text-xs font-bold w-40 focus:ring-0" />
                      </div>
                  </div>
                  <div className="divide-y divide-neutral-light">
                      {loading ? (
                          <div className="p-8 text-center text-neutral-medium font-bold uppercase text-xs animate-pulse">Loading queue...</div>
                      ) : unassigned.length === 0 ? (
                          <div className="p-12 text-center text-neutral-medium font-bold uppercase text-xs">No pending assignments! ✓</div>
                      ) : unassigned.map((f, i) => (
                        <div key={i} className="flex items-center justify-between px-8 py-5 hover:bg-neutral-light/20 transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm uppercase ${f.priority === 'High' ? 'bg-red-500' : f.priority === 'Medium' ? 'bg-brand-yellowDark' : 'bg-brand-green'}`}>
                                    {f.priority[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-neutral-dark tracking-tight">{f.user_name} ({f.itr_form_type})</p>
                                    <p className="text-[10px] font-bold text-neutral-medium mt-0.5 uppercase tracking-widest">Submitted: {new Date(f.submitted_date).toLocaleString()}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setSelectedFiling(f); setShowAssignModal(true) }}
                                className="px-4 py-2 bg-neutral-dark text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-brand-yellow hover:text-neutral-dark transition-all"
                            >
                                Assign
                            </button>
                        </div>
                      ))}
                  </div>
              </div>

              {/* Assignment Modal */}
              {showAssignModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-dark/80 backdrop-blur-sm p-4">
                      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                          <div className="p-8 border-b border-neutral-light">
                              <h3 className="text-xl font-black text-neutral-dark uppercase tracking-tight">Assign Employee</h3>
                              <p className="text-xs font-bold text-neutral-medium mt-1 uppercase">Filing: {selectedFiling?.user_name} ({selectedFiling?.itr_form_type}) - {selectedFiling?.priority} Priority</p>
                          </div>
                          <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                              <p className="text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-4">Recommended Employees</p>
                              {employees.map(emp => (
                                  <div key={emp.id} className="p-4 border border-neutral-light rounded-2xl flex items-center justify-between group hover:border-brand-yellow transition-all">
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <span className="text-sm font-black text-neutral-dark">{emp.employee_name}</span>
                                              <span className="text-[9px] font-bold bg-neutral-light px-2 py-0.5 rounded-full uppercase">{emp.specialization}</span>
                                          </div>
                                          <div className="flex items-center gap-4 mt-1.5">
                                              <span className="text-[10px] font-bold text-neutral-medium uppercase">Load: {emp.current_workload_percentage}%</span>
                                              <span className="text-[10px] font-bold text-brand-green uppercase">Success: {emp.success_rate}%</span>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => handleAssign(emp.id)}
                                          className="px-4 py-2 bg-neutral-light text-neutral-dark text-[10px] font-black rounded-lg uppercase group-hover:bg-brand-yellow transition-all"
                                      >
                                          Select
                                      </button>
                                  </div>
                              ))}
                          </div>
                          <div className="p-8 bg-neutral-light/5 flex justify-end gap-3">
                              <button onClick={() => setShowAssignModal(false)} className="px-6 py-2 text-[10px] font-black text-neutral-medium uppercase tracking-widest">Cancel</button>
                          </div>
                      </div>
                  </div>
              )}

          </div>
      </div>

    </DashboardLayout>
  )
}

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import DashboardLayout from '../components/DashboardLayout'
import { 
  FileText, Upload, CreditCard, Activity, TrendingUp, 
  ArrowRight, Clock, CheckCircle, AlertCircle, Plus,
  ChevronDown, Download, ExternalLink, Calendar
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useSelector(s => s.auth)
  const currentYear = "FY 2025-2026"
  const [filing, setFiling] = useState(null)
  const [rejectedDocs, setRejectedDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const fetchData = async () => {
      try {
        const uid = user.id
        // Filings
        const filingsQ = query(collection(db, 'filings'), where('user_id', '==', uid))
        const filingsSnap = await getDocs(filingsQ)
        const filings = filingsSnap.docs.map(d => d.data()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setFiling(filings[0] || null)
        // Documents
        const docsQ = query(collection(db, 'documents'), where('user_id', '==', uid))
        const docsSnap = await getDocs(docsQ)
        const docs = docsSnap.docs.map(d => d.data())
        setRejectedDocs(docs.filter(d => d.verification_status === 'rejected'))
      } catch (err) {
        console.error("Dashboard sync failed", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const getStepStatus = (stepIdx) => {
    if (!filing) return stepIdx === 0 ? 'in-progress' : 'pending'
    const statusMap = {
      'DRAFT': 1,
      'AWAITING_EMPLOYEE_ASSIGNMENT': 2,
      'ASSIGNED_TO_EMPLOYEE': 3,
      'EMPLOYEE_VERIFIED': 4,
      'GOVERNMENT_SUBMITTED': 5
    }
    const currentStep = statusMap[filing.status] || 1
    if (stepIdx < currentStep - 1) return 'completed'
    if (stepIdx === currentStep - 1) return 'in-progress'
    return 'pending'
  }

  const steps = [
    { title: 'Personal Information', desc: 'PAN, Aadhaar & Profile details' },
    { title: 'Income & Deductions', desc: 'Salary, Interest & 80C/80D' },
    { title: 'Upload Documents', desc: 'Form 16, Bank Statements' },
    { title: 'Verification', desc: 'Review by TaxBee Experts' },
    { title: 'Submission', desc: 'E-Verify & Government File' },
  ].map((s, i) => ({ ...s, status: getStepStatus(i) }))

  const stats = [
    { label: 'Filing Status', value: filing?.status?.replace(/_/g, ' ') || 'Not Started', sub: filing ? `Priority: ${filing.priority}` : 'Start now', color: 'text-brand-yellowDark' },
    { label: 'Est. Refund', value: '₹12,450', sub: 'Expected by Aug', color: 'text-brand-green' },
    { label: 'Tax Liability', value: '₹0', sub: 'No pending dues', color: 'text-neutral-dark' },
    { label: 'Tax Paid (TDS)', value: '₹45,200', sub: 'As per Form 26AS', color: 'text-brand-greenDeep' },
  ]

  return (
    <DashboardLayout title="Taxpayer Workspace" subtitle="Manage your ITR filing and view tax summaries">
      
      {/* 1. Header with Year Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-neutral-light mb-8 gap-4">
          <div>
              <h2 className="text-xl font-black text-neutral-dark uppercase tracking-tight">Welcome Back, {user?.name || 'User'}</h2>
              <p className="text-[10px] font-bold text-neutral-medium uppercase tracking-widest mt-1">PAN: {user?.pan ? `${user.pan.substring(0, 5)}****${user.pan.substring(9)}` : 'AABPP****K'}</p>
          </div>
          <div className="flex items-center gap-3">
              <div className="relative group">
                  <button className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-neutral-light rounded-xl font-black text-sm text-neutral-dark hover:border-brand-yellow transition-all shadow-sm">
                      <Calendar size={18} className="text-brand-yellowDark" />
                      {currentYear}
                      <ChevronDown size={14} className="text-neutral-medium group-hover:rotate-180 transition-transform" />
                  </button>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-neutral-dark text-white rounded-xl font-black text-sm shadow-xl hover:translate-y-[-2px] transition-all">
                  <Download size={18} /> Download Draft
              </button>
          </div>
      </div>

      {/* 2. Top Stats & Alerts */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
                <div key={s.label} className="card p-5 border-l-4 border-neutral-light hover:border-brand-yellow transition-all">
                    <p className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mb-2">{s.label}</p>
                    <p className={`text-2xl font-black ${s.color} tracking-tighter`}>{s.value}</p>
                    <p className="text-[9px] font-bold text-neutral-medium mt-1 uppercase italic">{s.sub}</p>
                </div>
            ))}
          </div>
          
          {/* Deadline Countdown */}
          <div className="card bg-neutral-dark p-5 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/10 rounded-full translate-x-8 -translate-y-8 blur-xl group-hover:scale-150 transition-all duration-700"></div>
              <p className="text-[9px] font-black text-brand-yellow uppercase tracking-[0.2em] mb-1">Tax Deadline</p>
              <p className="text-xl font-black text-white tracking-tighter">31 July 2026</p>
              <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Remaining:</span>
                  <span className="text-[10px] font-black text-brand-green uppercase animate-pulse">112 Days</span>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Contextual Alert */}
              {rejectedDocs.length > 0 ? (
                <div className="p-5 bg-red-50 border-2 border-red-200 rounded-[1.5rem] flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-red-600 tracking-tight">ATTENTION: {rejectedDocs.length} Document(s) Rejected</p>
                        <p className="text-xs font-bold text-neutral-medium mt-0.5 leading-relaxed">Our experts found issues with your {rejectedDocs.map(d => d.document_type).join(', ')}. Please review comments and re-upload.</p>
                        <Link to="/documents" className="inline-block mt-2 text-[10px] font-black text-red-500 uppercase border-b border-red-500 pb-0.5 hover:opacity-70 transition-opacity">
                            Fix Documents Now
                        </Link>
                    </div>
                </div>
              ) : !filing ? (
                <div className="p-5 bg-brand-yellow/10 border-2 border-brand-yellow/20 rounded-[1.5rem] flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-neutral-dark shadow-sm">
                        <Plus size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-neutral-dark tracking-tight">Ready to start your ITR filing?</p>
                        <p className="text-xs font-bold text-neutral-medium mt-0.5 leading-relaxed">Let's get your taxes sorted for {currentYear}. It only takes a few minutes to start.</p>
                        <Link to="/file-itr" className="inline-block mt-2 text-[10px] font-black text-brand-yellowDark uppercase border-b border-brand-yellowDark pb-0.5 hover:opacity-70 transition-opacity">
                            Start Filing
                        </Link>
                    </div>
                </div>
              ) : (
                <div className="p-5 bg-brand-green/10 border-2 border-brand-green/20 rounded-[1.5rem] flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-sm">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-neutral-dark tracking-tight">Filing is on track!</p>
                        <p className="text-xs font-bold text-neutral-medium mt-0.5 leading-relaxed">Your current status is {filing.status.replace(/_/g, ' ')}. We'll notify you once it moves to the next stage.</p>
                    </div>
                </div>
              )}

              {/* 3. Filing Progress Timeline */}
              <div className="card shadow-2xl overflow-hidden border-2 border-neutral-light">
                <div className="px-8 py-6 border-b border-neutral-light flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity size={20} className="text-brand-green" />
                        <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Filing Milestone Progress</h3>
                    </div>
                    <span className="text-[10px] font-black bg-brand-green/10 text-brand-green px-3 py-1 rounded-full uppercase tracking-widest font-black">40% Complete</span>
                </div>
                <div className="p-8 space-y-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex gap-6 relative group">
                            {/* Connector Line */}
                            {idx !== steps.length - 1 && (
                                <div className={`absolute top-10 left-5 w-0.5 h-10 ${step.status === 'completed' ? 'bg-brand-green' : 'bg-neutral-light'}`}></div>
                            )}
                            {/* Step Indicator */}
                            <div className={`
                                w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all z-10
                                ${step.status === 'completed' ? 'bg-brand-green text-white shadow-glowGreen' : 
                                  step.status === 'in-progress' ? 'bg-brand-yellow text-neutral-dark animate-float shadow-glow' : 
                                  'bg-white border-2 border-neutral-light text-neutral-medium'}
                            `}>
                                {step.status === 'completed' ? <CheckCircle size={22} /> : idx + 1}
                            </div>
                            {/* Content */}
                            <div className="flex-1">
                                <p className="text-sm font-black text-neutral-dark uppercase tracking-tight">{step.title}</p>
                                <p className="text-[11px] font-bold text-neutral-medium mt-0.5 tracking-wide">{step.desc}</p>
                                {step.status === 'in-progress' && (
                                    <button className="mt-2 flex items-center gap-2 text-[10px] font-black text-brand-yellowDark uppercase tracking-widest hover:translate-x-1 transition-transform">
                                        Continue <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
              </div>

          </div>

          {/* Sidebar Tools Column */}
          <div className="space-y-8">
              
              {/* 4. Action Cards (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                  {[
                      { label: 'Calculators', icon: TrendingUp, count: '3 Free', color: 'bg-brand-yellow' },
                      { label: 'Upload Hub', icon: Upload, count: 'New UI', color: 'bg-brand-green' },
                  ].map(tool => (
                      <div key={tool.label} className="p-6 bg-white border-2 border-neutral-light rounded-[2rem] hover:border-brand-yellow transition-all shadow-sm group">
                         <div className={`w-10 h-10 ${tool.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            <tool.icon size={18} className="text-neutral-dark" />
                         </div>
                         <p className="text-xs font-black text-neutral-dark uppercase tracking-tight">{tool.label}</p>
                         <p className="text-[9px] font-bold text-neutral-medium mt-0.5">{tool.count}</p>
                      </div>
                  ) )}
              </div>

              {/* 5. Support Hive Widget (Already handled by AI Chatbot mostly, but still good to have) */}
              <div className="p-8 bg-neutral-dark rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                  <div className="relative z-10">
                      <p className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.2em] mb-4">Dedicated Support</p>
                      <h4 className="text-white text-xl font-black tracking-tight mb-2 leading-tight">Need expert tax assistance?</h4>
                      <p className="text-gray-400 text-xs font-bold leading-relaxed mb-6">Talk to our verified tax professionals and get your queries resolved in minutes.</p>
                      <button className="w-full flex items-center justify-center gap-2 py-4 bg-brand-yellow text-neutral-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow">
                          Start Consult <ExternalLink size={14} />
                      </button>
                  </div>
              </div>

              {/* 6. The ToolBox (Linking to the new pages) */}
              <div className="space-y-3">
                  <h4 className="px-4 text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-4">The ToolBox</h4>
                  {[
                    { label: 'Document Checklist', icon: CheckCircle, to: '/document-checklist' },
                    { label: 'ITR-1 Form Preview', icon: FileText, to: '/itr-form-preview' },
                    { label: 'Bank Revalidation', icon: CreditCard, to: '/bank-revalidation' },
                    { label: 'Support Tickets', icon: AlertCircle, to: '/support' },
                  ].map(link => (
                      <Link key={link.label} to={link.to} className="w-full flex items-center gap-4 p-4 bg-white border border-neutral-light rounded-2xl hover:border-brand-yellow hover:translate-x-2 transition-all group">
                          <link.icon size={18} className="text-brand-yellowDark" />
                          <span className="text-xs font-black text-neutral-dark text-left flex-1">{link.label}</span>
                          <ArrowRight size={14} className="text-neutral-medium opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                  ))}
              </div>

          </div>
      </div>

    </DashboardLayout>
  )
}

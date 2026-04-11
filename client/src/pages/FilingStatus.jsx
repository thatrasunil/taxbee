import DashboardLayout from '../components/DashboardLayout'
import { CheckCircle, Clock, AlertCircle, Download, RefreshCw, ExternalLink } from 'lucide-react'

const filings = [
  {
    id: 'ITR-2025-001', year: 'AY 2025-26', type: 'ITR-1', status: 'processing',
    submittedDate: '08 Apr 2026', ackNo: 'PENDING', refund: '₹18,400',
    timeline: [
      { label: 'ITR Filed', date: '08 Apr 2026', done: true },
      { label: 'Acknowledgment Generated', date: '08 Apr 2026', done: true },
      { label: 'ITR Under Processing', date: 'In Progress', done: false, active: true },
      { label: 'Verified by CPC', date: 'Expected: 15 Apr 2026', done: false },
      { label: 'Refund Initiated', date: 'Expected: 25 Apr 2026', done: false },
      { label: 'Refund Credited', date: 'Expected: 01 May 2026', done: false },
    ]
  },
  {
    id: 'ITR-2024-001', year: 'AY 2024-25', type: 'ITR-1', status: 'filed',
    submittedDate: '28 Jul 2024', ackNo: 'AP280720240001234', refund: '₹12,400',
    timeline: [
      { label: 'ITR Filed', date: '28 Jul 2024', done: true },
      { label: 'Acknowledgment Generated', date: '28 Jul 2024', done: true },
      { label: 'Verified by CPC', date: '02 Aug 2024', done: true },
      { label: 'Refund Initiated', date: '10 Aug 2024', done: true },
      { label: 'Refund Credited', date: '15 Aug 2024', done: true },
    ]
  },
]

const statusMap = {
  filed: { color: 'bg-secondary-100 text-secondary-800', label: 'Filed ✓', icon: CheckCircle, iconColor: 'text-brand-green' },
  processing: { color: 'bg-primary-100 text-primary-900', label: 'Processing...', icon: Clock, iconColor: 'text-brand-yellowDark' },
  rejected: { color: 'bg-red-100 text-red-600', label: 'Rejected', icon: AlertCircle, iconColor: 'text-red-500' },
}

export default function FilingStatus() {
  return (
    <DashboardLayout title="Track Filing" subtitle="Real-time timeline of your ITR submissions">
      <div className="space-y-6">
        {filings.map(f => {
          const st = statusMap[f.status]
          return (
            <div key={f.id} className="card overflow-hidden border-l-4 border-brand-yellow">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-neutral-light bg-neutral-light/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-black text-neutral-dark text-lg">{f.year}</h3>
                    <span className="text-[10px] font-black bg-neutral-dark text-white px-2 py-0.5 rounded-lg">{f.type}</span>
                    <span className={`${st.color} text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest`}>{st.label}</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-medium">Filing ID: <span className="text-neutral-dark">{f.id}</span></p>
                  <p className="text-xs font-bold text-neutral-medium mt-1">Submitted: <span className="text-neutral-dark">{f.submittedDate}</span></p>
                  {f.ackNo !== 'PENDING' && (
                    <p className="text-[10px] font-black text-brand-green mt-2 px-2 py-1 bg-white border border-secondary-100 rounded-lg w-fit">Ack No: {f.ackNo}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mb-1">Tax Refund</p>
                    <p className="text-3xl font-black text-brand-green tracking-tighter">{f.refund}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="bg-neutral-dark text-white py-2 px-4 rounded-xl text-xs font-black shadow-md hover:bg-black transition-all flex items-center justify-center gap-2">
                      <Download size={14} /> Receipt
                    </button>
                    <button className="bg-white text-neutral-dark border-2 border-neutral-light py-2 px-4 rounded-xl text-xs font-black hover:border-brand-yellow transition-all flex items-center justify-center gap-2">
                      <ExternalLink size={14} /> IT Portal
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6">
                <h4 className="text-xs font-black text-neutral-medium uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Activity size={14} className="text-brand-yellow" /> Status Timeline
                </h4>
                <div className="space-y-0 ml-2">
                  {f.timeline.map((t, i) => (
                    <div key={t.label} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all
                          ${t.done ? 'bg-brand-green' : t.active ? 'bg-brand-yellow shadow-glow' : 'bg-neutral-light border border-neutral-light'}`}>
                          {t.done ? <CheckCircle size={20} className="text-white" /> :
                           t.active ? <RefreshCw size={18} className="text-neutral-dark animate-spin" style={{animationDuration:'3s'}} /> :
                           <Clock size={18} className="text-neutral-medium" />}
                        </div>
                        {i < f.timeline.length - 1 && (
                          <div className={`w-1 rounded-full flex-1 my-2 transition-all duration-500 ${t.done ? 'bg-brand-green/30' : 'bg-neutral-light'}`} style={{ minHeight: '32px' }} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`text-sm font-black tracking-tight ${t.done ? 'text-neutral-dark' : t.active ? 'text-brand-yellowDark' : 'text-neutral-medium'}`}>
                          {t.label}
                        </p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${t.done ? 'text-brand-green' : t.active ? 'text-neutral-dark animate-pulse' : 'text-neutral-light'}`}>
                          {t.date}
                        </p>
                        {t.active && (
                            <div className="mt-2 bg-primary-100/50 border border-brand-yellow/20 rounded-lg px-3 py-1.5 text-[10px] font-bold text-neutral-dark italic">
                                Our tax bees are currently validating this stage with the IT Department.
                            </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}

function Activity({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
    )
}

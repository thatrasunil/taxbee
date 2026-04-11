import { useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '../components/DashboardLayout'
import { 
  FileText, CheckCircle, Download, Send, 
  Printer, ArrowLeft, ArrowRight, ShieldCheck, 
  AlertCircle, ChevronDown, Activity, User
} from 'lucide-react'

export default function ITRFormPreview() {
  const { user } = useSelector(s => s.auth)
  const [activeSegment, setActiveSegment] = useState('personal')

  const segments = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'income', label: 'Income Details', icon: Activity },
    { id: 'tax', label: 'Tax Computations', icon: ShieldCheck },
    { id: 'final', label: 'Refund/Net Tax', icon: CheckCircle },
  ]

  return (
    <DashboardLayout title="ITR-1 Form Preview" subtitle={"Preview your draft for Financial Year 2025-26"}>
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-neutral-light mb-8 gap-4">
          <div className="flex items-center gap-2 p-1 bg-neutral-light/30 rounded-2xl border-2 border-neutral-light">
              {segments.map(s => (
                  <button 
                    key={s.id} onClick={() => setActiveSegment(s.id)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeSegment === s.id ? 'bg-neutral-dark text-brand-yellow shadow-lg' : 'text-neutral-medium hover:bg-white'
                    }`}>
                      <s.icon size={14} /> {s.label}
                  </button>
              ))}
          </div>
          <div className="flex gap-3">
              <button className="p-3 bg-white border-2 border-neutral-light rounded-xl hover:border-brand-yellow shadow-sm transition-all"><Printer size={18} /></button>
              <button className="flex items-center gap-2 px-6 py-3 bg-neutral-dark text-white rounded-xl font-black text-sm shadow-xl hover:translate-y-[-2px] transition-all">
                  <Download size={18} /> Export PDF
              </button>
          </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-3">
              <div className="bg-white border-2 border-neutral-light rounded-[3rem] shadow-2xl overflow-hidden min-h-[1000px] flex flex-col relative">
                  
                  {/* Form Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden h-full">
                      <p className="text-[200px] font-black uppercase text-neutral-dark -rotate-12 whitespace-nowrap">PREVIEW DRAFT PREVIEW DRAFT</p>
                  </div>

                  {/* Form Header */}
                  <div className="p-12 border-b-2 border-neutral-light bg-neutral-light/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-neutral-dark rounded-[2rem] flex items-center justify-center text-brand-yellow font-black text-2xl shadow-xl">ITR-1</div>
                        <div>
                            <h2 className="text-2xl font-black text-neutral-dark tracking-tighter uppercase leading-none mb-1">Income Tax Return</h2>
                            <p className="text-[10px] font-black text-neutral-medium uppercase tracking-[0.3em]">Individual Resident High-Fidelity Draft</p>
                        </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[9px] font-black text-brand-green uppercase tracking-widest mb-1 underline">Validation Passed ✓</p>
                          <p className="text-2xl font-black text-neutral-dark tracking-tighter uppercase leading-none">{user?.pan || 'AABPP****K'}</p>
                      </div>
                  </div>

                  {/* Form Sections */}
                  <div className="p-12 space-y-12 relative z-10">
                      
                      {/* Segment: Personal */}
                      {activeSegment === 'personal' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                           <h3 className="text-sm font-black text-neutral-dark uppercase tracking-[0.2em] mb-8 pb-4 border-b border-neutral-light">A. Personal Details</h3>
                           <div className="grid md:grid-cols-2 gap-12">
                                <FormRow label="Full Name as per PAN" value={user?.name || 'Rahul Sharma'} />
                                <FormRow label="Aadhaar Enrollment ID" value="5123 **** **** 9102" />
                                <FormRow label="Filing Status" value="On Time (Section 139/1)" />
                                <FormRow label="Residential Status" value="Resident" />
                                <FormRow label="Assessing Officer" value="WARD 12 (1) NEW DELHI" />
                                <FormRow label="Mobile Number" value="+91 98*** **321" />
                           </div>
                        </div>
                      )}

                      {/* Segment: Income (Mock) */}
                      {activeSegment === 'income' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                           <h3 className="text-sm font-black text-neutral-dark uppercase tracking-[0.2em] mb-8 pb-4 border-b border-neutral-light">B. Gross Total Income</h3>
                           <div className="space-y-6">
                                <FormTable title="I. Income from Salary">
                                    <FormTableCell label="Gross Salary (Part A)" value="₹8,45,200" />
                                    <FormTableCell label="Standard Deduction (16ia)" value="-₹50,000" />
                                    <FormTableCell label="Income under head Salaries" value="₹7,95,200" bold />
                                </FormTable>
                                <FormTable title="II. Income from Other Sources">
                                    <FormTableCell label="Savings Bank Interest" value="₹12,400" />
                                    <FormTableCell label="FD Interest Income" value="₹4,500" />
                                    <FormTableCell label="Total Other Income" value="₹16,900" bold />
                                </FormTable>
                                <div className="p-6 bg-neutral-dark text-white rounded-2xl flex items-center justify-between mt-12 shadow-xl">
                                    <p className="text-xs font-black uppercase tracking-widest text-brand-yellow">Gross Total Income (I + II)</p>
                                    <p className="text-2xl font-black tracking-tighter">₹8,12,100</p>
                                </div>
                           </div>
                        </div>
                      )}

                      {/* Default empty sections for now */}
                      {(activeSegment === 'tax' || activeSegment === 'final') && (
                        <div className="text-center py-32 opacity-30">
                            <AlertCircle size={48} className="mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest">Calculations in Progress...</p>
                            <p className="text-[10px] font-bold uppercase mt-2">Finish upload hub sections 3 & 4 to see full tax computation.</p>
                        </div>
                      )}

                  </div>

                  {/* Form Footer */}
                  <div className="mt-auto p-12 bg-neutral-light/10 border-t-2 border-neutral-light flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4 p-5 bg-white border-2 border-brand-green/20 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                              <ShieldCheck size={20} />
                          </div>
                          <div>
                              <p className="text-xs font-black text-neutral-dark uppercase tracking-tight">Security Checksum: TB-88219-KJ4</p>
                              <p className="text-[10px] font-bold text-neutral-medium mt-0.5">Verified by TaxBee Hive System Engine</p>
                          </div>
                      </div>
                      <div className="space-y-2">
                           <button className="flex items-center gap-2 px-10 py-5 bg-neutral-dark text-white rounded-[2rem] font-black text-sm shadow-2xl hover:translate-y-[-2px] hover:shadow-glow transition-all">
                               E-Verify & Submit <Send size={18} className="text-brand-yellow" />
                           </button>
                      </div>
                  </div>

              </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
              <div className="card p-8 bg-neutral-dark text-white relative overflow-hidden group">
                  <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-20 transition-all rotate-12">
                      <AlertCircle size={150} />
                  </div>
                  <h4 className="text-[11px] font-black text-brand-yellow uppercase tracking-widest mb-4">Verification Alert</h4>
                  <p className="text-xs font-bold leading-relaxed mb-6">Your draft shows a refund of **₹12,450**. Please ensure your bank account is re-validated to avoid delays.</p>
                  <button className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-neutral-dark transition-all">Go to Bank Hub</button>
              </div>

              <div className="space-y-4">
                  <h4 className="px-4 text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-4">Filing Guidelines</h4>
                  {[
                    'Review all personal details.',
                    'Check Interest from Savings/FD.',
                    'Match 26AS with these entries.',
                    'Keep ITR confirmation PDF safe.'
                  ].map((tip, idx) => (
                      <div key={idx} className="flex gap-4 p-5 bg-white border-2 border-neutral-light rounded-[1.5rem] hover:border-brand-yellow transition-all group">
                         <div className="w-8 h-8 bg-neutral-light/50 rounded-lg flex items-center justify-center text-neutral-medium group-hover:bg-brand-yellow group-hover:text-neutral-dark transition-all">
                            <span className="text-[10px] font-black">{idx+1}</span>
                         </div>
                         <p className="text-[11px] font-black text-neutral-dark uppercase tracking-tight mt-1">{tip}</p>
                      </div>
                  ) )}
              </div>
          </div>

      </div>

    </DashboardLayout>
  )
}

function FormRow({ label, value }) {
    return (
        <div>
            <p className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mb-2 ml-1">{label}</p>
            <div className="p-4 bg-neutral-light/5 border-2 border-neutral-light rounded-xl font-black text-sm text-neutral-dark">{value}</div>
        </div>
    )
}

function FormTable({ title, children }) {
    return (
        <div className="space-y-3">
             <h5 className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mb-2 ml-1">{title}</h5>
             <div className="border-2 border-neutral-light rounded-2xl overflow-hidden divide-y divide-neutral-light">
                 {children}
             </div>
        </div>
    )
}

function FormTableCell({ label, value, bold }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white">
            <span className="text-xs font-bold text-neutral-medium uppercase tracking-tight">{label}</span>
            <span className={`text-sm tracking-tighter ${bold ? 'font-black text-neutral-dark' : 'font-bold text-neutral-dark'}`}>{value}</span>
        </div>
    )
}

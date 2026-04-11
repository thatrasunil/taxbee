import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { 
  Landmark, CheckCircle, AlertCircle, RefreshCw, 
  ExternalLink, ArrowRight, Shield, Plus,
  ChevronDown, Activity, Clock, Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const initialBanks = [
  { id: 1, name: 'HDFC Bank Ltd', account: '**** 5002', status: 'validated', ifsc: 'HDFC0001234', branch: 'New Delhi' },
  { id: 2, name: 'ICICI Bank', account: '**** 1122', status: 'action-required', ifsc: 'ICIC0008821', branch: 'Mumbai' },
]

export default function BankRevalidation() {
  const [banks, setBanks] = useState(initialBanks)

  const handleRevalidate = (id) => {
    toast.success('Initiating re-validation with NPCI...')
    setTimeout(() => {
        setDocs(prev => prev.map(b => b.id === id ? { ...b, status: 'validated' } : b))
        toast.success('Bank Account re-validated successfully!')
    }, 2000)
  }

  // Helper because I was using setDocs by mistake in the thought
  const setBankList = (id, status) => {
    setBanks(banks.map(b => b.id === id ? { ...b, status } : b))
  }

  return (
    <DashboardLayout title="Bank Hub & Revalidation" subtitle="Verify your bank accounts for instant refund credit">
      
      {/* 1. Primary Refund Account Banner */}
      <div className="card p-12 bg-neutral-dark text-white mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/5 rounded-full translate-x-40 -translate-y-40 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center text-neutral-dark shadow-glow">
                          <Landmark size={24} />
                      </div>
                      <h2 className="text-3xl font-black tracking-tighter uppercase">Primary Refund Account</h2>
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed max-w-xl">Your primary bank account for tax refunds is **HDFC Bank (**** 5002)**. Ensure it is currently validated to receive your expected refund of ₹12,450.</p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex-shrink-0">
                  <p className="text-[10px] font-black text-brand-yellow uppercase tracking-widest mb-2">Hive Refund Status</p>
                  <p className="text-4xl font-black tracking-tighter animate-pulse">ELIDIGLE</p>
                  <p className="text-[9px] font-black text-brand-green uppercase mt-2 tracking-[0.2em]">Bank Matched ✓</p>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Linked Banks Area */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Your Linked Bank Accounts</h3>
                  <button className="flex items-center gap-2 px-6 py-3 bg-neutral-dark text-brand-yellow rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                      <Plus size={16} /> Link New Bank
                  </button>
              </div>

              <div className="space-y-4">
                  {banks.map(bank => (
                      <div key={bank.id} className="card p-8 border-2 border-neutral-light hover:border-brand-yellow transition-all group">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-neutral-light rounded-[1.5rem] flex items-center justify-center text-neutral-dark group-hover:bg-brand-yellow transition-colors">
                                    <Landmark size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-neutral-dark tracking-tight uppercase">{bank.name}</h4>
                                    <p className="text-[10px] font-bold text-neutral-medium uppercase tracking-widest">{bank.account} • {bank.branch}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                bank.status === 'validated' ? 'bg-brand-green/10 text-brand-green' : 'bg-red-50 text-red-600 animate-pulse'
                            }`}>
                                {bank.status === 'validated' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                                {bank.status === 'validated' ? 'Validated' : 'Action Required'}
                            </div>
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-neutral-light/10 rounded-2xl mb-8">
                            <BankMetric label="IFSC Code" value={bank.ifsc} />
                            <BankMetric label="Account Type" value="Savings" />
                            <BankMetric label="KYC Status" value="Completed" />
                            <BankMetric label="Linked PAN" value="AABPP****K" />
                         </div>

                         <div className="flex flex-col md:flex-row gap-4">
                            <button 
                                onClick={() => { toast.success('Re-validation started...'); setTimeout(() => setBankList(bank.id, 'validated'), 1500); }}
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-neutral-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-glow transition-all">
                                <RefreshCw size={14} className="text-brand-yellow" /> Re-validate Account
                            </button>
                            <button className="px-6 py-4 bg-white border border-neutral-light rounded-2xl font-black text-[10px] uppercase text-neutral-medium hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                                <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
              
              {/* FAQ Section */}
              <div className="card p-8 bg-white border-2 border-neutral-light shadow-xl">
                  <div className="flex items-center gap-3 mb-8">
                      <Activity size={20} className="text-brand-yellowDark" />
                      <h4 className="text-[10px] font-black text-neutral-dark uppercase tracking-[0.2em]">Bank Validation FAQ</h4>
                  </div>
                  <div className="space-y-8">
                      <FAQItem question="Why should I re-validate?" answer="Re-validation ensures your account details match NPCI records for instant refund processing." />
                      <FAQItem question="How long does it take?" answer="Usually takes 24-48 hours to sync with the IT Department records." />
                      <FAQItem question="What if my bank is not listed?" answer="You can manually link any scheduled commercial bank using IFSC and Account No." />
                  </div>
              </div>

              {/* Secure Token */}
              <div className="p-8 bg-neutral-dark text-white rounded-[2.5rem] text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                  <Shield size={32} className="mx-auto mb-6 text-brand-yellow opacity-40" />
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Member E-Sign Token</p>
                  <p className="text-xl font-black tracking-widest bg-white/5 py-4 rounded-xl border border-white/10 uppercase mb-8 group-hover:bg-brand-yellow group-hover:text-neutral-dark transition-all">TB-SEC-9221</p>
                  <button className="text-[10px] font-black text-brand-yellow uppercase underline italic hover:opacity-70 transition-opacity">Regenerate Token</button>
              </div>

          </div>
      </div>

    </DashboardLayout>
  )
}

function BankMetric({ label, value }) {
    return (
        <div>
            <p className="text-[8px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-[11px] font-black text-neutral-dark tracking-tight">{value}</p>
        </div>
    )
}

function FAQItem({ question, answer }) {
    return (
        <div className="space-y-2 group cursor-help">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-neutral-dark uppercase tracking-tight group-hover:text-brand-yellowDark transition-colors">{question}</p>
                <ChevronDown size={14} className="text-neutral-light group-hover:rotate-180 transition-transform" />
            </div>
            <p className="text-[10px] font-bold text-neutral-medium leading-relaxed uppercase">{answer}</p>
        </div>
    )
}

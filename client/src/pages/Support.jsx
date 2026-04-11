import { useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '../components/DashboardLayout'
import { 
  MessageSquare, Search, Plus, Filter, 
  ChevronRight, Clock, AlertCircle, Send,
  Headphones, Star, CheckCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const initialTickets = [
  { id: 'TB-T-9921', subject: 'Refund delay for FY 24-25', status: 'open', priority: 'high', category: 'Refund', date: '2 days ago' },
  { id: 'TB-T-9882', subject: 'Aadhaar linking error', status: 'resolved', priority: 'medium', category: 'KYC', date: '5 days ago' },
]

export default function Support() {
  const { user } = useSelector(s => s.auth)
  const [tickets, setTickets] = useState(initialTickets)
  const [isCreating, setIsCreating] = useState(false)

  const handleNewTicket = () => {
    toast.success('Analyzing your request...')
    setTimeout(() => {
        setIsCreating(false)
        toast.success('Ticket TB-T-1002 raised! A TaxBee will reply soon.')
    }, 1500)
  }

  return (
    <DashboardLayout title="Member Support Hub" subtitle="Raise tickets and get expert tax assistance in minutes">
      
      {/* 1. Stats Counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Tickets', value: '01', icon: MessageSquare, color: 'text-brand-yellowDark' },
            { label: 'Avg. Response', value: '12m', icon: Clock, color: 'text-brand-green' },
            { label: 'Member Rating', value: '4.9', icon: Star, color: 'text-brand-yellowDark' },
            { label: 'Resolved', value: '128', icon: CheckCircle, color: 'text-brand-greenDeep' },
          ].map(stat => (
              <div key={stat.label} className="card p-6 border-l-4 border-neutral-light hover:border-brand-yellow transition-all">
                  <div className="flex items-center justify-between mb-4">
                      <p className="text-[9px] font-black text-neutral-medium uppercase tracking-[0.2em]">{stat.label}</p>
                      <stat.icon size={16} className={stat.color} />
                  </div>
                  <p className="text-3xl font-black text-neutral-dark tracking-tighter">{stat.value}</p>
              </div>
          ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Tickets Column */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Table Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest ml-1">Your Support History</h3>
                  <div className="flex items-center gap-3">
                      <div className="bg-white border-2 border-neutral-light rounded-xl flex items-center px-4 py-2 focus-within:border-brand-yellow transition-all shadow-sm">
                          <Search size={14} className="text-neutral-medium" />
                          <input type="text" placeholder="Search tickets..." className="bg-transparent border-none text-[10px] font-bold focus:ring-0 ml-2 uppercase" />
                      </div>
                      <button 
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-neutral-dark text-brand-yellow rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                          <Plus size={16} /> New Ticket
                      </button>
                  </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                  {tickets.map(t => (
                      <div key={t.id} className="card p-8 border-2 border-neutral-light hover:border-brand-yellow transition-all group flex items-center gap-8 relative overflow-hidden">
                          {/* Corner Tag */}
                          <div className={`absolute top-0 right-0 px-6 py-1 text-[8px] font-black uppercase tracking-widest ${
                              t.status === 'open' ? 'bg-brand-yellow text-neutral-dark' : 'bg-brand-green text-white'
                          }`}>{t.status}</div>

                          <div className="w-14 h-14 bg-neutral-light/50 rounded-[1.5rem] flex items-center justify-center text-neutral-medium group-hover:bg-neutral-dark group-hover:text-brand-yellow transition-all">
                              <MessageSquare size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                  <span className="text-[9px] font-black text-neutral-medium uppercase tracking-widest">{t.id}</span>
                                  <span className={`w-1.5 h-1.5 rounded-full ${t.priority === 'high' ? 'bg-red-500 animate-pulse' : 'bg-brand-green'}`}></span>
                                  <span className="text-[9px] font-black text-neutral-medium uppercase">{t.category}</span>
                              </div>
                              <h4 className="text-sm font-black text-neutral-dark uppercase tracking-tight truncate group-hover:text-brand-yellowDark transition-colors">{t.subject}</h4>
                              <p className="text-[10px] font-bold text-neutral-medium uppercase italic mt-1">Last activity: {t.date}</p>
                          </div>
                          <button className="p-4 bg-neutral-light/30 rounded-2xl text-neutral-medium hover:bg-neutral-dark hover:text-white transition-all">
                              <ChevronRight size={20} />
                          </button>
                      </div>
                  ))}
              </div>

          </div>

          {/* Sidebar / Quick Assistance */}
          <div className="space-y-8">
              
              {/* Call Expert Banner */}
              <div className="p-8 bg-neutral-dark text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                  <Headphones size={32} className="text-brand-yellow mb-6 opacity-40" />
                  <h4 className="text-xl font-black tracking-tight mb-2 uppercase">Connect with a CA</h4>
                  <p className="text-[11px] font-bold text-gray-400 uppercase leading-relaxed mb-8 tracking-wide">Get complex queries resolved by our verified Chartered Accountants over a secure call.</p>
                  <button className="w-full py-4 bg-brand-yellow text-neutral-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-glow">
                      Book Slot (₹299/call)
                  </button>
              </div>

              {/* Help Center Shortcut */}
              <div className="card p-8 bg-white border-2 border-neutral-light shadow-xl">
                  <h4 className="text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-6">Popular Help Topics</h4>
                  <div className="space-y-4">
                      {[
                        'How to track refund status?',
                        'Linking PAN with Aadhaar',
                        'Forgotten transaction PIN',
                        'Section 80D Deductions Guide'
                      ].map(topic => (
                          <button key={topic} className="w-full text-left p-4 bg-neutral-light/20 rounded-xl hover:bg-neutral-dark hover:text-white transition-all group">
                              <p className="text-[10px] font-black uppercase tracking-tight flex items-center justify-between">
                                  {topic} <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />
                              </p>
                          </button>
                      ))}
                  </div>
              </div>

          </div>
      </div>

      {/* New Ticket Modal */}
      {isCreating && (
          <div className="fixed inset-0 bg-neutral-dark/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full translate-x-10 -translate-y-10 blur-2xl"></div>
                  <div className="relative z-10">
                      <h3 className="text-2xl font-black text-neutral-dark uppercase tracking-tighter mb-2">Raise Support Ticket</h3>
                      <p className="text-xs font-bold text-neutral-medium uppercase tracking-widest mb-8">Tell us about your concern in detail</p>
                      
                      <div className="space-y-6">
                          <div>
                              <label className="text-[10px] font-black text-neutral-medium uppercase tracking-widest block ml-1 mb-2">Subject</label>
                              <input type="text" placeholder="e.g., Refund Matched but not Received" className="w-full p-4 bg-neutral-light/10 border-2 border-neutral-light rounded-2xl text-sm font-bold focus:border-brand-yellow focus:ring-0 transition-all" />
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-neutral-medium uppercase tracking-widest block ml-1 mb-2">Description</label>
                              <textarea placeholder="Describe your issue..." className="w-full p-4 bg-neutral-light/10 border-2 border-neutral-light rounded-2xl text-sm font-bold focus:border-brand-yellow focus:ring-0 transition-all h-32 resize-none" />
                          </div>
                          <div className="flex gap-4 pt-4">
                              <button onClick={() => setIsCreating(false)} className="flex-1 py-4 bg-neutral-light text-neutral-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-dark hover:text-white transition-all">Cancel</button>
                              <button onClick={handleNewTicket} className="flex-1 py-4 bg-brand-yellow text-neutral-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-glow">Raise Ticket</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </DashboardLayout>
  )
}

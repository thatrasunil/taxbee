import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  MessageSquare, Search, Filter, ChevronRight, 
  Clock, AlertCircle, Bot, User, Send 
} from 'lucide-react'

const initialTickets = [
  { id: 'TKT-001', user: 'Rahul Sharma', subject: 'Refund delay', priority: 'high', status: 'open', lastMsg: 'I haven\'t received my refund...' },
  { id: 'TKT-002', user: 'Neha Gupta', subject: 'Document rejection', priority: 'medium', status: 'open', lastMsg: 'Why was my PAN rejected?' },
  { id: 'TKT-003', user: 'Vikram Singh', subject: 'Password reset', priority: 'low', status: 'closed', lastMsg: 'Thanks for the help!' },
]

export default function EmployeeTickets() {
  const [tickets, setTickets] = useState(initialTickets)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Syncing Support Tickets...")
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout title="Support Hive Dashboard" subtitle="Reply to user queries and technical support tickets">
      
      <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-280px)]">
          
          {/* Ticket List */}
          <div className="lg:col-span-1 border-2 border-neutral-light rounded-[2.5rem] bg-white overflow-hidden flex flex-col shadow-sm">
             <div className="p-6 border-b border-neutral-light bg-neutral-light/5 flex items-center justify-between">
                <h3 className="text-xs font-black text-neutral-dark uppercase tracking-widest">Active Tickets</h3>
                <span className="bg-brand-yellow text-neutral-dark px-2 py-0.5 rounded-full text-[9px] font-black uppercase">3 Total</span>
             </div>
             <div className="flex-1 overflow-y-auto divide-y divide-neutral-light scrollbar-hide">
                {tickets.map(t => (
                  <button 
                    key={t.id} onClick={() => setSelected(t)}
                    className={`w-full p-6 text-left hover:bg-neutral-light/30 transition-all ${selected?.id === t.id ? 'bg-primary-50 border-r-4 border-brand-yellow' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-neutral-medium uppercase tracking-widest">{t.id}</span>
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                          t.priority === 'high' ? 'bg-red-500 text-white shadow-glowRed' : 
                          t.priority === 'medium' ? 'bg-brand-yellow text-neutral-dark' : 'bg-brand-green text-white'
                        }`}>
                          {t.priority}
                        </div>
                    </div>
                    <p className="text-sm font-black text-neutral-dark truncate">{t.subject}</p>
                    <p className="text-[10px] font-bold text-neutral-medium mt-1 truncate">{t.lastMsg}</p>
                    <div className="flex items-center gap-1.5 mt-4 text-[9px] font-black text-neutral-medium uppercase italic">
                        <Clock size={10} /> 12m ago
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Ticket Chat Area */}
          <div className="lg:col-span-2 border-2 border-neutral-light rounded-[2.5rem] bg-white overflow-hidden flex flex-col shadow-xl">
             {selected ? (
               <>
                 <div className="p-6 border-b border-neutral-light flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-dark rounded-xl flex items-center justify-center text-white font-black text-sm">
                            {selected.user[0]}
                        </div>
                        <div>
                            <p className="text-sm font-black text-neutral-dark">{selected.user}</p>
                            <p className="text-[10px] font-bold text-neutral-medium uppercase tracking-widest">{selected.subject}</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-neutral-light rounded-xl text-[10px] font-black uppercase text-neutral-dark hover:bg-neutral-dark hover:text-white transition-all">
                        Resolve Ticket
                    </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-neutral-light/5">
                    <div className="flex justify-start">
                        <div className="max-w-[80%] bg-white border border-neutral-light p-4 rounded-2xl rounded-bl-none shadow-sm">
                            <p className="text-xs font-bold text-neutral-dark leading-relaxed">{selected.lastMsg}</p>
                            <p className="text-[9px] font-black text-neutral-medium mt-2 uppercase">10:45 AM</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="max-w-[80%] bg-brand-yellow text-neutral-dark p-4 rounded-2xl rounded-br-none shadow-sm">
                            <p className="text-xs font-bold leading-relaxed">Hello! I am looking into this right now. Please allow me a moment.</p>
                            <p className="text-[9px] font-black text-neutral-dark/60 mt-2 uppercase">Just Now</p>
                        </div>
                    </div>
                 </div>

                 <div className="p-6 border-t border-neutral-light bg-white">
                    <div className="bg-neutral-light/30 p-2 rounded-2xl flex items-center gap-2 border border-transparent focus-within:border-brand-yellow transition-all">
                        <input 
                            type="text" placeholder="Type your reply..." 
                            className="bg-transparent border-none text-sm font-bold w-full focus:ring-0 ml-2"
                        />
                        <button className="w-10 h-10 bg-neutral-dark text-brand-yellow rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                            <Send size={18} />
                        </button>
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-medium opacity-50">
                   <div className="w-16 h-16 bg-neutral-light rounded-2xl flex items-center justify-center mb-4">
                       <MessageSquare size={32} />
                   </div>
                   <p className="text-sm font-black uppercase tracking-widest">Select a ticket to join the buzzing conversation</p>
               </div>
             )}
          </div>
      </div>

    </DashboardLayout>
  )
}

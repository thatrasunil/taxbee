import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { Search, Filter, UserCheck, UserX, Mail, Phone, MoreHorizontal } from 'lucide-react'

const users = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', pan: 'ABCDE1234F', plan: 'Professional', status: 'active', filings: 3, joined: '01 Feb 2026' },
  { id: 2, name: 'Priya Mehta', email: 'priya@example.com', phone: '8765432109', pan: 'PQRST5678G', plan: 'Premium', status: 'active', filings: 5, joined: '15 Feb 2026' },
  { id: 3, name: 'Vikram Patel', email: 'vikram@example.com', phone: '7654321098', pan: 'VWXYZ9012H', plan: 'Basic', status: 'inactive', filings: 1, joined: '20 Mar 2026' },
  { id: 4, name: 'Anita Verma', email: 'anita@example.com', phone: '6543210987', pan: 'ANITA1234I', plan: 'Professional', status: 'active', filings: 2, joined: '05 Apr 2026' },
  { id: 5, name: 'Rohit Kumar', email: 'rohit@example.com', phone: '9123456789', pan: 'ROHIT5678J', plan: 'Basic', status: 'active', filings: 0, joined: '10 Apr 2026' },
]

const planColor = { 
    Basic: 'bg-neutral-light text-neutral-medium font-bold', 
    Professional: 'bg-primary-50 text-brand-yellowDark font-black', 
    Premium: 'bg-secondary-50 text-brand-green font-black' 
}

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.pan.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout title="Identity Registry" subtitle="Global list of taxpayers protected by TaxBee">
      <div className="card overflow-hidden shadow-2xl border-b-4 border-neutral-light">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-neutral-light bg-neutral-light/10">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-medium" />
            <input className="input-field pl-11 py-3 text-sm font-bold shadow-sm" placeholder="Search by name, email or secure PAN..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="bg-neutral-dark text-white py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:bg-black transition-all">
              <Filter size={14} /> Filter Hive
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-light/50 border-b border-neutral-light">
                {['Registry Info', 'Communication', 'ITR Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-neutral-medium uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-neutral-light/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-transform group-hover:scale-110">
                        <span className="text-neutral-dark font-black text-sm">{u.name[0]}</span>
                      </div>
                      <div>
                          <p className="text-sm font-black text-neutral-dark whitespace-nowrap">{u.name}</p>
                          <p className="text-[10px] font-mono text-neutral-medium font-bold uppercase tracking-tighter">{u.pan}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-bold text-neutral-dark flex items-center gap-2 group-hover:text-brand-green transition-colors"><Mail size={12} className="text-neutral-medium" />{u.email}</p>
                        <p className="text-xs text-neutral-medium flex items-center gap-2 font-medium"><Phone size={12} className="opacity-50" />{u.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-widest ${planColor[u.plan]}`}>{u.plan}</span>
                        <div className="text-center px-3 border-l border-neutral-light">
                            <p className="text-sm font-black text-neutral-dark leading-none">{u.filings}</p>
                            <p className="text-[9px] font-bold text-neutral-medium uppercase tracking-tighter mt-1">ITRs</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <p className="text-[10px] font-black text-neutral-dark bg-neutral-light px-3 py-1 rounded-lg w-fit whitespace-nowrap">{u.joined}</p>
                     <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 block ${u.status === 'active' ? 'text-brand-green' : 'text-neutral-medium opacity-50'}`}>● {u.status}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                       <button className="w-9 h-9 border-2 border-neutral-light rounded-xl flex items-center justify-center text-neutral-medium hover:border-brand-green hover:text-brand-green transition-all" title="Verify User">
                        <UserCheck size={18} />
                      </button>
                      <button className="w-9 h-9 border-2 border-neutral-light rounded-xl flex items-center justify-center text-neutral-medium hover:border-red-500 hover:text-red-500 transition-all" title="Suspend User">
                        <UserX size={18} />
                      </button>
                      <button className="w-9 h-9 border-2 border-neutral-light rounded-xl flex items-center justify-center text-neutral-medium hover:border-neutral-dark hover:text-neutral-dark transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-neutral-light/5">
              <div className="w-20 h-20 bg-neutral-light rounded-full flex items-center justify-center mx-auto mb-4 opacity-50 shadow-inner">
                <Search size={32} className="text-neutral-medium" />
              </div>
              <p className="text-neutral-medium font-bold uppercase tracking-widest text-xs">No taxpayers found matching your query</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 bg-neutral-light/20 gap-4">
          <p className="text-xs font-black text-neutral-medium uppercase tracking-widest">Displaying {filtered.length} of {users.length} authenticated users</p>
          <div className="flex gap-2">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm ${p === 1 ? 'bg-brand-yellow text-neutral-dark border-2 border-brand-yellowDark' : 'bg-white border-2 border-neutral-light text-neutral-medium hover:bg-neutral-light hover:text-neutral-dark'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

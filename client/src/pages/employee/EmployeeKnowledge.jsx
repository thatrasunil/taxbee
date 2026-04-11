import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  BookOpen, Search, FileText, Play, ExternalLink, 
  ArrowRight, Sparkles, HelpCircle, ShieldCheck
} from 'lucide-react'

const categories = [
  { label: 'Filing Basics', desc: 'Understanding ITR forms and process', icon: BookOpen, count: '12 Articles', color: 'bg-brand-yellow' },
  { label: 'Technical Guide', desc: 'Solving portal and login errors', icon: HelpCircle, count: '8 Guides', color: 'bg-brand-green' },
  { label: 'Legal & Policy', desc: 'Tax laws and compliance rules', icon: ShieldCheck, count: '5 Papers', color: 'bg-neutral-dark' },
]

export default function EmployeeKnowledge() {
  return (
    <DashboardLayout title="Officer Knowledge Hub" subtitle="Official tax resource library and internal guidelines">
      
      {/* 1. Header Search Area */}
      <div className="relative p-12 bg-neutral-dark rounded-[3rem] shadow-2xl overflow-hidden mb-12 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full translate-x-32 -translate-y-32 blur-3xl group-hover:scale-125 transition-all duration-1000"></div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">What are you looking for today?</h2>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex items-center gap-3">
                  <Search size={22} className="text-brand-yellow mx-2" />
                  <input 
                    type="text" placeholder="Search keywords like 'HRA', 'ITR-2', '80C'..." 
                    className="bg-transparent border-none text-white font-bold w-full focus:ring-0 placeholder:text-gray-500"
                  />
                  <button className="px-6 py-3 bg-brand-yellow text-neutral-dark rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Search</button>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
              
              {/* Featured Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map(cat => (
                  <div key={cat.label} className="card p-6 border-b-4 border-neutral-light hover:border-brand-yellow transition-all group">
                      <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-6`}>
                         <cat.icon size={22} className={cat.color === 'bg-brand-yellow' ? 'text-neutral-dark' : 'text-white'} />
                      </div>
                      <h4 className="text-sm font-black text-neutral-dark uppercase tracking-tight">{cat.label}</h4>
                      <p className="text-[10px] font-bold text-neutral-medium mt-1 leading-relaxed">{cat.desc}</p>
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-light">
                          <span className="text-[9px] font-black text-neutral-medium uppercase tracking-widest">{cat.count}</span>
                          <ArrowRight size={14} className="text-brand-yellowDark" />
                      </div>
                  </div>
                ))}
              </div>

              {/* Recent Articles List */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Recently Added Articles</h3>
                    <Link to="#" className="text-[10px] font-black text-brand-yellowDark uppercase">See All</Link>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Guide to ITR-3 for Business', time: '2 days ago', type: 'Filing' },
                      { title: 'New 80C Deductions FY 25-26', time: '1 week ago', type: 'Tax Law' },
                      { title: 'Optimizing Refund Processing', time: '5 days ago', type: 'Technical' },
                      { title: 'Cybersecurity for Officers', time: '2 weeks ago', type: 'Mandatory' },
                    ].map(art => (
                      <div key={art.title} className="p-5 bg-white border border-neutral-light rounded-[1.5rem] hover:bg-neutral-light/20 transition-all group cursor-pointer">
                         <div className="flex items-center justify-between mb-3">
                            <span className="text-[8px] font-black bg-neutral-dark text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">{art.type}</span>
                            <span className="text-[8px] font-bold text-neutral-medium uppercase italic">{art.time}</span>
                         </div>
                         <h5 className="text-xs font-black text-neutral-dark group-hover:text-brand-yellowDark transition-colors line-clamp-1">{art.title}</h5>
                      </div>
                    ))}
                 </div>
              </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
              
              {/* Training Resources */}
              <div className="card p-8 bg-neutral-light/30 border-2 border-dashed border-neutral-light">
                  <div className="flex items-center gap-3 mb-6">
                      <Play size={20} className="text-brand-green" />
                      <h4 className="text-[11px] font-black text-neutral-dark uppercase tracking-widest">Video Tutorials</h4>
                  </div>
                  <div className="space-y-4">
                     {[1, 2, 3].map(v => (
                       <div key={v} className="bg-white rounded-xl overflow-hidden shadow-sm group cursor-pointer">
                          <div className="h-24 bg-neutral-dark flex items-center justify-center overflow-hidden">
                              <Play size={24} className="text-white opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                          </div>
                          <div className="p-3">
                              <p className="text-[10px] font-bold text-neutral-dark line-clamp-1 uppercase tracking-tight">System Training Module {v}</p>
                          </div>
                       </div>
                     ))}
                  </div>
              </div>

              {/* Internal Guidelines PDF */}
              <div className="p-8 bg-brand-green text-white rounded-[2.5rem] shadow-xl text-center">
                  <Sparkles size={32} className="mx-auto mb-4 opacity-50" />
                  <h4 className="text-sm font-black uppercase tracking-widest mb-2">Hive Standard SOP</h4>
                  <p className="text-[10px] font-bold opacity-80 uppercase leading-relaxed mb-6">Download the latest standard operating procedure for FY 2026</p>
                  <button className="w-full py-4 bg-white text-brand-green rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-light transition-all flex items-center justify-center gap-2">
                       Download PDF <ExternalLink size={14} />
                  </button>
              </div>

          </div>
      </div>

    </DashboardLayout>
  )
}
function Link({ to, children, className }) {
    return <a href={to} className={className}>{children}</a>
}

import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { 
  CheckCircle, AlertCircle, Upload, Shield, 
  Search, Filter, ChevronRight, FileText, Download,
  CloudUpload, ArrowRight, Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const initialChecklist = [
  { id: 1, name: 'PAN Card', category: 'Identity', status: 'available', lastUpdated: '10 Jan 2026' },
  { id: 2, name: 'Aadhaar Card', category: 'Identity', status: 'available', lastUpdated: '10 Jan 2026' },
  { id: 3, name: 'Form 16 (Part A & B)', category: 'Income', status: 'missing', lastUpdated: '-' },
  { id: 4, name: 'Bank Interest Certificates', category: 'Income', status: 'missing', lastUpdated: '-' },
  { id: 5, name: 'Rent Receipts (HRA)', category: 'Deductions', status: 'uploaded', lastUpdated: '11 Apr 2026' },
  { id: 6, name: 'Investment Proofs (80C)', category: 'Deductions', status: 'missing', lastUpdated: '-' },
]

export default function DocumentChecklist() {
  const [items, setItems] = useState(initialChecklist)

  const handleUpload = (id) => {
    toast.success('Analyzing document integrity...')
    setTimeout(() => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'uploaded', lastUpdated: 'Today' } : i))
        toast.success('Document synced to the Hive सुरक्षित रूप से!')
    }, 1500)
  }

  return (
    <DashboardLayout title="Document Hub & Checklist" subtitle="Ensure all records are synced for error-free filing">
      
      {/* 1. Progress Status */}
      <div className="card p-8 bg-neutral-dark text-white mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full translate-x-32 -translate-y-32 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-md">
                  <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Checklist Completion: 50%</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase leading-relaxed">You have 3 missing documents required for ITR-1 filing. Upload them to proceed to final review.</p>
              </div>
              <div className="w-full md:w-64 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-brand-yellow w-1/2 shadow-glow animate-pulse"></div>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Checklist Column */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Required Documents Library</h3>
                  <div className="flex gap-2">
                      <button className="p-2 bg-white border border-neutral-light rounded-lg hover:border-brand-yellow transition-colors"><Search size={16} /></button>
                      <button className="p-2 bg-white border border-neutral-light rounded-lg hover:border-brand-yellow transition-colors"><Filter size={16} /></button>
                  </div>
              </div>

              <div className="space-y-4">
                  {items.map(item => (
                      <div key={item.id} className="card p-5 border-2 border-neutral-light hover:border-brand-yellow transition-all group flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                              item.status === 'available' ? 'bg-brand-green/10 text-brand-green' : 
                              item.status === 'uploaded' ? 'bg-brand-yellow/10 text-brand-yellowDark' : 
                              'bg-neutral-light/30 text-neutral-medium'
                          }`}>
                              {item.status === 'available' ? <CheckCircle size={24} /> : <FileText size={24} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-neutral-dark uppercase tracking-tight truncate">{item.name}</p>
                              <div className="flex items-center gap-3 mt-1 text-[9px] font-black uppercase tracking-widest text-neutral-medium">
                                  <span>{item.category}</span>
                                  <span className="w-1 h-1 bg-neutral-light rounded-full"></span>
                                  <span>Last Updated: {item.lastUpdated}</span>
                              </div>
                          </div>

                          <div className="flex items-center gap-3">
                              {item.status === 'missing' ? (
                                  <button 
                                    onClick={() => handleUpload(item.id)}
                                    className="px-6 py-2.5 bg-neutral-dark text-brand-yellow rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2">
                                      <CloudUpload size={14} /> Upload
                                  </button>
                              ) : (
                                  <div className="flex gap-2">
                                      <button className="p-2.5 bg-neutral-light/50 rounded-xl text-neutral-medium hover:bg-neutral-dark hover:text-white transition-all"><Eye size={16} /></button>
                                      <button className="p-2.5 bg-neutral-light/50 rounded-xl text-neutral-medium hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
              
              {/* Security Banner */}
              <div className="p-8 bg-brand-green/5 border-2 border-brand-green/20 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                  <Shield size={32} className="text-brand-green mb-4 opacity-50" />
                  <h4 className="text-xs font-black text-neutral-dark uppercase tracking-widest mb-2">Military Grade Encryption</h4>
                  <p className="text-[10px] font-bold text-neutral-medium leading-relaxed uppercase">Your data is stored in the Hive with AES-256 encryption. Only you and authorized officers can access it.</p>
              </div>

              {/* Tips Section */}
              <div className="card p-8 bg-white border-2 border-neutral-light shadow-xl">
                  <h4 className="text-[10px] font-black text-neutral-medium uppercase tracking-[0.2em] mb-6">Filing Success Tips</h4>
                  <div className="space-y-6">
                      {[
                        'Upload Form 16 in original PDF format for AI parsing.',
                        'Ensure Bank details are linked with your Aadhaar.',
                        'Claim all 80C deductions to maximize your refund.'
                      ].map((tip, idx) => (
                          <div key={idx} className="flex gap-3">
                              <div className="w-5 h-5 bg-brand-yellow rounded-lg flex items-center justify-center text-neutral-dark flex-shrink-0">
                                  <ArrowRight size={10} />
                              </div>
                              <p className="text-[11px] font-bold text-neutral-dark leading-tight uppercase tracking-tight">{tip}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Download Draft */}
              <button className="w-full flex items-center justify-center gap-3 py-5 bg-neutral-dark text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:translate-y-[-2px] hover:shadow-glow transition-all">
                  <Download size={20} /> Download My Vault (.zip)
              </button>

          </div>
      </div>

    </DashboardLayout>
  )
}

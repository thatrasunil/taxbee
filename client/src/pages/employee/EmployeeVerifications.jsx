import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { 
  ShieldCheck, Search, Filter, CheckCircle, X, Eye, 
  FileText, Calendar, Clock, ArrowRight, Download 
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../api/axios'
import { useSearchParams } from 'react-router-dom'

export default function EmployeeVerifications() {
  const [searchParams] = useSearchParams()
  const filingId = searchParams.get('filing')
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [previewDoc, setPreviewDoc] = useState(null)

  const fetchDocs = async () => {
    try {
      setLoading(true)
      const url = filingId ? `/employee/filing-documents/${filingId}` : '/documents'
      const res = await api.get(url)
      setDocs(res.data)
    } catch (err) {
      console.error("Failed to fetch documents", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [filingId])

  const handleAction = async (id, action) => {
    const comments = action === 'REJECTED' ? prompt("Please enter reason for rejection:") : "Approved"
    if (action === 'REJECTED' && !comments) return

    try {
      await api.post('/employee/verify-document', {
        document_id: id,
        action,
        comments
      })
      toast.success(`Document ${action === 'APPROVED' ? 'Approved' : 'Rejected'}`)
      fetchDocs()
    } catch (err) {
      toast.error("Action failed")
    }
  }

  return (
    <DashboardLayout title="Document Verification Hive" subtitle="Approve or reject taxpayer documents in real-time">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="bg-white border-2 border-neutral-light rounded-2xl flex items-center px-4 py-3 w-full md:w-96 focus-within:border-brand-yellow transition-all shadow-sm">
          <Search size={18} className="text-neutral-medium" />
          <input 
            type="text" placeholder="Search by user or ID..." 
            className="bg-transparent border-none text-sm font-bold w-full focus:ring-0 ml-2"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-neutral-light rounded-xl font-black text-sm text-neutral-dark hover:border-brand-yellow transition-all shadow-sm">
            <Filter size={18} /> Filters
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-dark text-white rounded-xl font-black text-sm shadow-xl hover:translate-y-[-2px] transition-all">
            <Download size={18} /> Export List
          </button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full p-20 text-center text-neutral-medium font-black uppercase text-xs animate-pulse">Scanning documents...</div>
        ) : docs.length === 0 ? (
             <div className="col-span-full p-20 text-center text-neutral-medium font-black uppercase text-xs">No documents found for this filing.</div>
        ) : docs.filter(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.document_type?.toLowerCase().includes(searchTerm.toLowerCase())).map(doc => (
          <div key={doc.id} className="card p-6 min-h-[320px] hover:translate-y-[-4px] transition-all group border-b-4 border-neutral-light hover:border-brand-yellow relative overflow-hidden">
            {/* Background Icon Watermark */}
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <FileText size={120} />
            </div>

            <div className="flex items-start justify-between mb-6 relative z-10">
                <button 
                  onClick={() => setPreviewDoc(doc)}
                  className="w-12 h-12 bg-neutral-light rounded-2xl flex items-center justify-center text-neutral-dark group-hover:bg-brand-yellow transition-colors shadow-sm">
                    <Eye size={22} />
                </button>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  doc.verification_status === 'verified' ? 'bg-brand-green/10 text-brand-green' : 
                  doc.verification_status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-neutral-light text-neutral-medium'
                }`}>
                  {doc.verification_status}
                </div>
            </div>
            
            <div className="relative z-10">
                <h4 className="text-sm font-black text-neutral-dark uppercase tracking-tight truncate">{doc.document_type}</h4>
                <p className="text-[10px] font-bold text-neutral-medium mt-1 uppercase tracking-widest">File: {doc.file_name}</p>
                
                <div className="flex items-center justify-between mt-6 text-[10px] font-black text-neutral-medium uppercase">
                    <div className="flex items-center gap-1.5 font-bold">
                        <Calendar size={12} /> {new Date(doc.created_at || Date.now()).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                        <Clock size={12} /> {(doc.file_size / 1024 / 1024).toFixed(1)} MB
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-neutral-light relative z-10">
                <button 
                  onClick={() => handleAction(doc.id, 'APPROVED')}
                  className="flex items-center justify-center gap-2 py-3 bg-brand-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                   <CheckCircle size={14} /> Approve
                </button>
                <button 
                  onClick={() => handleAction(doc.id, 'REJECTED')}
                  className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">
                   <X size={14} /> Reject
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-neutral-dark/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewDoc(null)}>
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-neutral-light flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">{previewDoc.document_type}</h3>
                        <p className="text-[10px] font-bold text-neutral-medium uppercase tracking-widest">ID: {previewDoc.id} • Filename: {previewDoc.file_name}</p>
                    </div>
                    <button onClick={() => setPreviewDoc(null)} className="p-3 bg-neutral-light rounded-xl hover:bg-brand-yellow transition-colors">
                        <X size={20} className="text-neutral-dark" />
                    </button>
                </div>
                <div className="flex-1 bg-neutral-light/20 p-8 flex items-center justify-center overflow-auto">
                    {/* Mock Document Image/PDF Preview */}
                    <div className="w-[600px] h-[800px] bg-white shadow-2xl rounded-xl border border-neutral-light flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-20 bg-neutral-dark/5 border-b border-neutral-light flex items-center px-12">
                             <span className="font-black text-xs uppercase tracking-widest">TaxBee Secure Document Viewer</span>
                        </div>
                        <FileText size={80} className="text-brand-yellow mb-6 opacity-40 animate-pulse" />
                        <h2 className="text-2xl font-black text-neutral-dark uppercase tracking-tight mb-2">{previewDoc.document_type} Preview</h2>
                        <p className="text-sm font-bold text-neutral-medium max-w-xs uppercase leading-relaxed">This is a high-security preview of the document submitted.</p>
                        
                        <div className="mt-12 w-full p-8 border-2 border-dashed border-neutral-light rounded-2xl">
                             <div className="flex justify-between mb-4 pb-2 border-b border-neutral-light">
                                 <span className="text-[10px] font-black uppercase text-neutral-medium">Verification Key</span>
                                 <span className="text-[10px] font-black uppercase text-neutral-dark">TB-(DOC-{previewDoc.id})</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-[10px] font-black uppercase text-neutral-medium">Data Integrity</span>
                                 <span className="text-[10px] font-black uppercase text-brand-green">Checked ✓</span>
                             </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white border-t border-neutral-light flex gap-4">
                    <button 
                      onClick={() => { handleAction(previewDoc.id, 'APPROVED'); setPreviewDoc(null); }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-green text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                        <CheckCircle size={18} /> Confirm Approval
                    </button>
                    <button 
                      onClick={() => { handleAction(previewDoc.id, 'REJECTED'); setPreviewDoc(null); }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all">
                        <X size={18} /> Reject Document
                    </button>
                </div>
            </div>
        </div>
      )}
    </DashboardLayout>
  )
}

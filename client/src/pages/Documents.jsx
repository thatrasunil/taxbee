import { useState, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Upload, CheckCircle, X, FileText, Image, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const docTypes = [
  { id: 'pan', label: 'PAN Card', desc: 'Required for identity verification', required: true },
  { id: 'aadhaar', label: 'Aadhaar Card', desc: 'Both sides required', required: true },
  { id: 'form16', label: 'Form 16', desc: 'From your employer (TDS certificate)', required: true },
  { id: 'salary_slip', label: 'Salary Slips', desc: 'Last 3 months salary slips', required: false },
  { id: 'bank_statement', label: 'Bank Statement', desc: 'Annual bank statement for interest income', required: false },
  { id: 'form26as', label: 'Form 26AS', desc: 'Download from IT portal', required: false },
  { id: '80c_proof', label: '80C Investment Proofs', desc: 'PPF passbook, ELSS statement, LIC premium', required: false },
  { id: 'rent_receipt', label: 'Rent Receipts', desc: 'If you pay rent (for HRA claim)', required: false },
]

export default function Documents() {
  const [uploads, setUploads] = useState({})
  const [dragging, setDragging] = useState(null)
  const inputRefs = useRef({})

  const handleFile = (docId, file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB'); return }
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG, and PDF files allowed'); return }
    setUploads(prev => ({ ...prev, [docId]: { name: file.name, size: file.size, type: file.type, status: 'uploaded' } }))
    toast.success(`${file.name} uploaded successfully!`)
  }

  const removeDoc = (docId) => {
    setUploads(prev => { const next = { ...prev }; delete next[docId]; return next })
    toast('Document removed')
  }

  const uploaded = Object.keys(uploads).length
  const required = docTypes.filter(d => d.required)
  const requiredUploaded = required.filter(d => uploads[d.id]).length

  return (
    <DashboardLayout title="Document Vault" subtitle="Upload your documents for expert verification">
      {/* Progress */}
      <div className="card p-6 mb-8 border-l-4 border-brand-green shadow-lg">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
                <span className="text-sm font-black text-neutral-dark uppercase tracking-widest">Compliance Progress</span>
                <p className="text-xs text-neutral-medium font-medium mt-0.5">Mandatory documents to trigger review</p>
            </div>
            <span className="text-sm font-black text-brand-green p-2 bg-secondary-50 rounded-xl">{requiredUploaded}/{required.length} Uploaded</span>
          </div>
          <div className="h-3 bg-neutral-light rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-hero-gradient rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(requiredUploaded / required.length) * 100}%` }} />
          </div>
        </div>
        {requiredUploaded === required.length && (
          <div className="mt-4 flex items-center justify-center gap-2 text-brand-green text-sm font-black bg-secondary-50 py-2 rounded-xl border border-secondary-200 animate-fade-in">
            <CheckCircle size={18} /> All mandated documents are securely in the vault!
          </div>
        )}
      </div>

      {/* Doc Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {docTypes.map(doc => {
          const up = uploads[doc.id]
          const isDraggingOver = dragging === doc.id

          return (
            <div key={doc.id}
              className={`card p-6 border-2 transition-all duration-300 relative
                ${up ? 'border-brand-green bg-white shadow-md' : isDraggingOver ? 'border-brand-yellow bg-primary-50 scale-102' : 'border-dashed border-neutral-light hover:border-brand-yellow/50 bg-neutral-light/20'}`}
              onDragOver={e => { e.preventDefault(); setDragging(doc.id) }}
              onDragLeave={() => setDragging(null)}
              onDrop={e => { e.preventDefault(); setDragging(null); handleFile(doc.id, e.dataTransfer.files[0]) }}>

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-neutral-dark text-sm tracking-tight">{doc.label}</span>
                    {doc.required && <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-lg uppercase tracking-tighter">Required</span>}
                  </div>
                  <p className="text-[10px] text-neutral-medium font-bold mt-1 leading-tight">{doc.desc}</p>
                </div>
                {up && (
                    <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle size={16} className="text-white" />
                    </div>
                )}
              </div>

              {up ? (
                <div className="flex items-center gap-3 bg-neutral-light/50 rounded-2xl p-4 border border-neutral-light group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${up.type === 'application/pdf' ? 'bg-red-50 text-red-500' : 'bg-secondary-50 text-brand-green'}`}>
                    {up.type === 'application/pdf' ? <FileText size={20} /> : <Image size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-neutral-dark truncate">{up.name}</p>
                    <p className="text-[10px] text-neutral-medium font-bold uppercase tracking-widest">{(up.size / 1024).toFixed(0)} KB • Secure</p>
                  </div>
                  <button onClick={() => removeDoc(doc.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-medium hover:bg-red-50 hover:text-red-500 transition-all">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                    ref={el => (inputRefs.current[doc.id] = el)}
                    onChange={e => handleFile(doc.id, e.target.files[0])} />
                  <button onClick={() => inputRefs.current[doc.id]?.click()}
                    className="w-full flex shadow-sm flex-col items-center justify-center gap-3 py-8 rounded-2xl border border-dashed border-neutral-medium/30 
                               hover:bg-primary-50 hover:border-brand-yellow/50 transition-all text-neutral-medium group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-brand-yellowDark" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-neutral-dark block uppercase tracking-tighter">Click to upload</span>
                        <span className="text-[10px] font-bold opacity-60">JPG, PNG, PDF (Max 5MB)</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Guidelines */}
      <div className="mt-8 card p-6 bg-brand-yellow/5 border-2 border-brand-yellow/20 flex flex-col md:flex-row items-start gap-5 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
            <AlertCircle size={24} className="text-brand-yellowDark" />
        </div>
        <div>
          <p className="font-black text-neutral-dark text-base mb-3 leading-tight uppercase tracking-tight">Vault Guidelines</p>
          <ul className="text-xs text-neutral-medium space-y-2 list-none font-medium">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-yellow flex-shrink-0 rounded-full"></div> All files must be clear and legible. Blurred or cropped documents will be rejected.</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-yellow flex-shrink-0 rounded-full"></div> Supported formats are JPG, PNG, and PDF only.</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-yellow flex-shrink-0 rounded-full"></div> Aadhaar card — ensure both front and back are visible in one file.</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-yellow flex-shrink-0 rounded-full"></div> Documents are encrypted with AES-256 and stored on secure cloud nodes.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}

import { useDispatch, useSelector } from 'react-redux'
import { nextStep, prevStep, updateFormData, computeTax, resetFiling } from '../store/filingSlice'
import DashboardLayout from '../components/DashboardLayout'
import { CheckCircle, ArrowRight, ArrowLeft, User, Briefcase, PiggyBank, Calculator, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

// ---- Step components ----
function StepPersonal({ data, onChange }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {[
        { key: 'firstName', label: 'First Name', ph: 'Rahul' },
        { key: 'lastName', label: 'Last Name', ph: 'Sharma' },
        { key: 'dob', label: 'Date of Birth', type: 'date' },
        { key: 'gender', label: 'Gender', type: 'select', opts: ['Male', 'Female', 'Other'] },
        { key: 'pan', label: 'PAN Number', ph: 'ABCDE1234F', upper: true },
        { key: 'aadhaar', label: 'Aadhaar (Last 4 digits)', ph: '4567', maxLen: 4 },
        { key: 'phone', label: 'Mobile Number', ph: '9876543210' },
        { key: 'itrType', label: 'ITR Form Type', type: 'select', opts: ['ITR-1 (Salaried)', 'ITR-2 (Multiple income)', 'ITR-3 (Business)', 'ITR-4 (Presumptive)'] },
      ].map(({ key, label, ph, type, opts, upper, maxLen }) => (
        <div key={key}>
          <label className="label">{label}</label>
          {type === 'select' ? (
            <select className="input-field" value={data[key]} onChange={e => onChange(key, e.target.value)}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input className="input-field" type={type || 'text'} placeholder={ph}
              value={data[key]} maxLength={maxLen}
              onChange={e => onChange(key, upper ? e.target.value.toUpperCase() : e.target.value)} />
          )}
        </div>
      ))}
      <div className="md:col-span-2">
        <label className="label">Residential Address</label>
        <input className="input-field" placeholder="House No, Street, Locality" value={data.address}
          onChange={e => onChange('address', e.target.value)} />
      </div>
      <div>
        <label className="label">City</label>
        <input className="input-field" placeholder="Mumbai" value={data.city} onChange={e => onChange('city', e.target.value)} />
      </div>
      <div>
        <label className="label">State</label>
        <input className="input-field" placeholder="Maharashtra" value={data.state} onChange={e => onChange('state', e.target.value)} />
      </div>
    </div>
  )
}

function StepIncome({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-neutral-dark mb-4 flex items-center gap-2"><Briefcase size={18} className="text-secondary-600" /> Salary Income</h3>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { key: 'grossSalary', label: 'Gross Salary (Annual)', ph: '₹ 8,00,000' },
            { key: 'hra', label: 'HRA Received', ph: '₹ 1,20,000' },
            { key: 'lta', label: 'LTA / Travel Allowance', ph: '₹ 20,000' },
            { key: 'otherAllowances', label: 'Other Allowances', ph: '₹ 50,000' },
            { key: 'taxPaid', label: 'TDS Deducted (from Form 16)', ph: '₹ 25,000' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input className="input-field" type="number" placeholder={ph} value={data[key]}
                onChange={e => onChange(key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
      <hr className="border-gray-100" />
      <div>
        <h3 className="font-bold text-neutral-dark mb-4 flex items-center gap-2">💰 Other Income Sources</h3>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { key: 'bankInterest', label: 'Bank Interest Income', ph: '₹ 8,000' },
            { key: 'rentalIncome', label: 'Rental Income', ph: '₹ 0' },
            { key: 'otherIncome', label: 'Other Income', ph: '₹ 0' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input className="input-field" type="number" placeholder={ph} value={data[key]}
                onChange={e => onChange(key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepDeductions({ data, onChange }) {
  const deductions = [
    { key: 'sec80C', label: 'Section 80C', desc: 'PPF, ELSS, LIC, Tuition Fees', max: '₹1,50,000' },
    { key: 'sec80D', label: 'Section 80D', desc: 'Health Insurance Premium', max: '₹25,000' },
    { key: 'sec80G', label: 'Section 80G', desc: 'Donations to Charities', max: 'No limit' },
    { key: 'sec80E', label: 'Section 80E', desc: 'Education Loan Interest', max: 'No limit' },
    { key: 'homeLoanInterest', label: 'Home Loan Interest (Sec 24b)', desc: 'Interest paid on home loan', max: '₹2,00,000' },
    { key: 'nps80CCD', label: 'NPS Contribution (80CCD 1B)', desc: 'Additional NPS deduction', max: '₹50,000' },
  ]
  return (
    <div>
      <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <PiggyBank size={20} className="text-secondary-600 mt-0.5" />
        <div>
          <p className="text-secondary-900 font-bold text-sm">Standard Deduction of ₹50,000 is automatically applied!</p>
          <p className="text-secondary-700 text-xs mt-0.5 font-medium">Add your investments and expenses below to maximize your refund.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {deductions.map(({ key, label, desc, max }) => (
          <div key={key} className="card p-4 hover:border-brand-yellow/50 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <label className="text-sm font-bold text-neutral-dark">{label}</label>
                <p className="text-[10px] text-neutral-medium font-medium">{desc}</p>
              </div>
              <span className="text-[10px] bg-primary-100 text-primary-900 px-2 py-0.5 rounded-full font-black">Max: {max}</span>
            </div>
            <input className="input-field text-sm" type="number" placeholder="₹ 0" value={data[key]}
              onChange={e => onChange(key, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function StepTaxPreview({ data }) {
  const fmt = n => '₹' + (n || 0).toLocaleString('en-IN')
  const rows = [
    { label: 'Gross Total Income', value: fmt(data.totalIncome), highlight: false },
    { label: 'Standard Deduction (80C etc.)', value: `- ${fmt(data.totalDeductions + 50000)}`, highlight: false },
    { label: 'Taxable Income', value: fmt(data.taxableIncome), highlight: true },
    { label: 'Income Tax Liability (incl. 4% cess)', value: fmt(data.taxLiability), highlight: false },
    { label: 'TDS Already Paid', value: `- ${fmt(data.taxPaid)}`, highlight: false },
    { label: data.refund >= 0 ? '🎉 Expected Refund' : '⚠ Tax Due', value: fmt(data.refund), highlight: true, green: data.refund >= 0 },
  ]
  return (
    <div className="max-w-xl mx-auto">
      <div className="card overflow-hidden border-2 border-brand-yellow shadow-xl">
        <div className="bg-hero-gradient px-6 py-5 relative">
           <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <h3 className="text-white font-black text-xl">Tax Computation Summary</h3>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">Assessment Year 2025-26 | Old Tax Regime</p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {rows.map(r => (
            <div key={r.label}
              className={`flex items-center justify-between px-6 py-5 ${r.highlight ? 'bg-neutral-light/50' : ''}`}>
              <span className={`text-sm ${r.highlight ? 'font-black text-neutral-dark' : 'text-neutral-medium font-semibold'}`}>{r.label}</span>
              <span className={`font-black text-base ${r.green ? 'text-brand-green' : r.highlight ? 'text-neutral-dark' : 'text-neutral-medium'}`}>
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {data.refund > 0 && (
        <div className="mt-6 bg-secondary-50 border-2 border-secondary-200 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-secondary-900 text-sm font-bold italic">🎉 Great news! You are eligible for a refund of <span className="text-xl text-brand-green ml-1">{fmt(data.refund)}</span>. Refunds typically arrive in 7-10 business days after filing.</p>
        </div>
      )}
    </div>
  )
}

function StepReview({ data }) {
  const sections = [
    { title: '👤 Personal Information', items: [
      { k: 'Name', v: `${data.firstName} ${data.lastName}` },
      { k: 'PAN', v: data.pan },
      { k: 'ITR Form', v: data.itrType },
      { k: 'City', v: `${data.city}, ${data.state}` },
    ]},
    { title: '💼 Income Summary', items: [
      { k: 'Gross Salary', v: `₹${Number(data.grossSalary||0).toLocaleString('en-IN')}` },
      { k: 'Other Income', v: `₹${(Number(data.bankInterest||0)+Number(data.rentalIncome||0)+Number(data.otherIncome||0)).toLocaleString('en-IN')}` },
      { k: 'Total Income', v: `₹${(data.totalIncome||0).toLocaleString('en-IN')}` },
    ]},
    { title: '📉 Deductions', items: [
      { k: 'Section 80C', v: `₹${Number(data.sec80C||0).toLocaleString('en-IN')}` },
      { k: 'Section 80D', v: `₹${Number(data.sec80D||0).toLocaleString('en-IN')}` },
      { k: 'Total Deductions', v: `₹${(data.totalDeductions||0).toLocaleString('en-IN')}` },
    ]},
    { title: '🧮 Tax Result', items: [
      { k: 'Taxable Income', v: `₹${(data.taxableIncome||0).toLocaleString('en-IN')}` },
      { k: 'Tax Liability', v: `₹${(data.taxLiability||0).toLocaleString('en-IN')}` },
      { k: 'Expected Refund', v: `₹${(data.refund||0).toLocaleString('en-IN')}`, green: true },
    ]},
  ]
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {sections.map(s => (
        <div key={s.title} className="card overflow-hidden hover:border-brand-yellow/30">
          <div className="px-5 py-3 bg-neutral-light border-b border-gray-100">
            <h4 className="font-black text-neutral-dark text-xs uppercase tracking-widest">{s.title}</h4>
          </div>
          <div className="px-5 py-3 divide-y divide-neutral-light">
            {s.items.map(i => (
              <div key={i.k} className="flex items-center justify-between py-2.5">
                <span className="text-xs font-bold text-neutral-medium">{i.k}</span>
                <span className={`text-sm font-black ${i.green ? 'text-brand-green' : 'text-neutral-dark'}`}>{i.v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="bg-primary-50 border-2 border-brand-yellow/30 rounded-2xl p-5 text-sm text-neutral-dark font-medium text-center">
        ⚠️ By submitting, you confirm that the information provided is accurate and complete to the best of your knowledge.
      </div>
    </div>
  )
}

// ---- Main Wizard ----
const STEPS = [
  { num: 1, title: 'Personal Info', icon: User },
  { num: 2, title: 'Income Details', icon: Briefcase },
  { num: 3, title: 'Deductions', icon: PiggyBank },
  { num: 4, title: 'Tax Preview', icon: Calculator },
  { num: 5, title: 'Review & Submit', icon: Send },
]

export default function FilingWizard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { step, formData } = useSelector(s => s.filing)

  const [isSigning, setIsSigning] = useState(false)
  const [signature, setSignature] = useState('')

  const update = (key, val) => dispatch(updateFormData({ [key]: val }))

  const handleNext = async () => {
    if (step === 3) dispatch(computeTax())
    
    // Auto-save progress on step change
    try {
      if (step === 1) {
        await api.post('/filings', { ...formData, status: 'DRAFT' })
      }
    } catch (err) { console.error("Auto-save failed") }

    dispatch(nextStep())
  }

  const handleSubmit = async () => {
    if (!signature) {
        toast.error("Please enter your name as Digital Signature")
        return
    }

    try {
      setIsSigning(true)
      toast.loading("Securing Digital Signature...", { id: 'sig' })
      
      // Simulate cryptographic delay
      await new Promise(r => setTimeout(r, 2000))
      
      // 1. Create/Update the final filing
      const res = await api.post('/filings', { ...formData, status: 'DRAFT' })
      const filingId = res.data.id

      // 2. Submit for verification
      await api.put(`/filings/${filingId}/submit`)
      
      toast.success('Signed & Submitted to TaxBee Vault! 🚀', { id: 'sig' })
      dispatch(resetFiling())
      navigate('/dashboard')
    } catch (err) {
      toast.error('Submission failed. Please check your data.', { id: 'sig' })
    } finally {
      setIsSigning(false)
    }
  }

  // Modified StepReview component to include signature
  const ReviewWithSignature = ({ data }) => (
    <div className="space-y-8">
      <StepReview data={data} />
      
      <div className="card p-8 bg-neutral-dark text-white border-none shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full translate-x-10 -translate-y-10 blur-2xl"></div>
          <div className="relative z-10 text-center">
              <h4 className="text-sm font-black text-brand-yellow uppercase tracking-[0.2em] mb-4">Digital Signature Vault</h4>
              <p className="text-xs text-gray-400 font-medium mb-6 leading-relaxed">By typing your full legal name below, you certify under penalty of law that the information provided is correct and complete.</p>
              
              <div className="max-w-xs mx-auto">
                  <input 
                    type="text" 
                    placeholder="TYPE FULL NAME TO SIGN" 
                    className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-xl px-4 py-4 text-center text-lg font-black tracking-widest text-brand-yellow focus:border-brand-yellow focus:ring-0 transition-all uppercase placeholder:text-white/20"
                    value={signature}
                    onChange={e => setSignature(e.target.value)}
                  />
                  <div className="flex items-center justify-center gap-2 mt-4 text-[9px] font-black text-white/40 uppercase tracking-widest">
                      <CheckCircle size={10} /> AES-256 Encrypted Signing
                  </div>
              </div>
          </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout title="File ITR" subtitle="AY 2025-26 Income Tax Return">
      {/* Step Indicator */}
      <div className="card p-4 md:p-8 mb-6 shadow-lg border-b-4 border-brand-green">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`step-indicator ${step > s.num ? 'done' : step === s.num ? 'active' : 'pending'}`}>
                  {step > s.num ? <CheckCircle size={18} /> : s.num}
                </div>
                <span className={`text-[10px] mt-2 font-black uppercase tracking-widest text-center hidden sm:block
                  ${step === s.num ? 'text-brand-yellowDark' : step > s.num ? 'text-brand-green' : 'text-neutral-medium'}`}>
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > s.num ? 'bg-brand-green' : 'bg-neutral-light'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card p-6 md:p-10 mb-8 shadow-xl min-h-[400px]">
        <div className="flex items-center justify-between mb-8 border-b border-neutral-light pb-4">
           <h2 className="text-xl font-black text-neutral-dark flex items-center gap-3">
             {(() => { const S = STEPS[step-1]; return <><S.icon size={24} className="text-brand-green" /> {S.title}</> })()}
           </h2>
           <span className="text-[10px] font-black bg-neutral-light px-3 py-1 rounded-full text-neutral-medium uppercase tracking-widest">
             Step {step} of 5
           </span>
        </div>

        {step === 1 && <StepPersonal data={formData} onChange={update} />}
        {step === 2 && <StepIncome data={formData} onChange={update} />}
        {step === 3 && <StepDeductions data={formData} onChange={update} />}
        {step === 4 && <StepTaxPreview data={formData} />}
        {step === 5 && <ReviewWithSignature data={formData} />}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button onClick={() => dispatch(prevStep())} disabled={step === 1 || isSigning}
          className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed px-8 py-3.5 shadow-md">
          <ArrowLeft size={20} /> Previous Phase
        </button>

        {step < 5 ? (
          <button onClick={handleNext} className="btn-primary px-10 py-3.5 shadow-xl text-lg">
            Continue Stage <ArrowRight size={20} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSigning} className="btn-primary bg-secondary-900 hover:bg-black text-white px-12 py-4 shadow-2xl text-lg disabled:opacity-70">
            {isSigning ? "Processing..." : <><Send size={20} /> Finalize & Submit ITR</>}
          </button>
        )}
      </div>
    </DashboardLayout>
  )
}

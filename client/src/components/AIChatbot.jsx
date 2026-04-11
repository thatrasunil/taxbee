import { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, 
  ChevronRight, FileText, Landmark, ShieldCheck, 
  HelpCircle, CreditCard, Headphones, Calculator 
} from 'lucide-react'
import axios from '../api/axios'

const INITIAL_OPTIONS = [
  { id: 'itr', label: 'ITR Filing', icon: FileText, color: 'text-brand-yellowDark' },
  { id: 'docs', label: 'Documents', icon: ShieldCheck, color: 'text-brand-green' },
  { id: 'savings', label: 'Tax Savings', icon: Calculator, color: 'text-brand-yellowDark' },
  { id: 'refund', label: 'Refund Status', icon: Landmark, color: 'text-brand-greenDeep' },
  { id: 'account', label: 'Account Help', icon: User, color: 'text-neutral-dark' },
  { id: 'tech', label: 'General Info', icon: HelpCircle, color: 'text-neutral-medium' },
  { id: 'expert', label: 'Custom Question', icon: Sparkles, color: 'text-brand-green' },
]

const SUB_OPTIONS = {
  itr: [
    { id: 'itr_form', label: 'Choose Form', msg: 'I can help you choose between ITR-1 to ITR-4. Do you have business income?' },
    { id: 'itr_deadline', label: 'Deadline', msg: 'The deadline for AY 2025-26 is 31st July 2026.' },
    { id: 'itr_mistakes', label: 'Mistakes', msg: 'Common errors are PAN-Aadhaar mismatch and incorrect bank details.' },
    { id: 'itr_amend', label: 'Amendment', msg: 'You can file a revised return under Section 139(5).' },
    { id: 'itr_pass', label: 'Password', msg: 'You can reset your e-filing password using Aadhaar OTP.' },
  ],
  docs: [
    { id: 'doc_upload', label: 'Won\'t Upload', msg: 'Ensure the file is < 5MB and in PDF/JPG format.' },
    { id: 'doc_format', label: 'Format Error', msg: 'We support PDF, JPEG, and PNG only.' },
    { id: 'doc_rejected', label: 'Docs Rejected', msg: 'Check if the image is clear and the name matches your PAN.' },
    { id: 'doc_aadhaar', label: 'Aadhaar Link', msg: 'PAN-Aadhaar linking is mandatory for filing.' },
  ],
  refund: [
    { id: 'ref_track', label: 'Track Refund', msg: 'Visit the NSDL portal or our Refund Tracker page.' },
    { id: 'ref_delay', label: 'Delayed?', msg: 'Refunds usually take 20-45 days after verification.' },
    { id: 'ref_bank', label: 'Wrong Account', msg: 'You can update bank details on the e-filing portal via "Bank Revalidation".' },
  ],
  savings: [
    { id: 'sav_80c', label: '80C Deductions', msg: 'Claim up to ₹1.5L for ELSS, PPF, LIC, and Tuition fees.' },
    { id: 'sav_80d', label: 'Medical (80D)', msg: 'Claim up to ₹25k (self) and ₹50k (seniors) for health insurance.' },
    { id: 'sav_hra', label: 'HRA Exemption', msg: 'Available if you stay in rented accommodation.' },
  ],
  payment: [
    { id: 'pay_failed', label: 'Payment Failed', msg: 'Don\'t worry. If money was debited, it will be refunded in 7 days.' },
    { id: 'pay_receipt', label: 'Receipt Info', msg: 'You can download the filing receipt from the "History" tab.' },
  ],
  tech: [
    { id: 'tech_login', label: 'Login Issues', msg: 'Clear your browser cache or try Incognito mode.' },
    { id: 'tech_slow', label: 'Slow Website', msg: 'Our hive is busy. Please wait 30 seconds and refresh.' },
  ],
  account: [
     { id: 'acc_update', label: 'Update Info', msg: 'Go to Profile -> Edit to update your details.' },
     { id: 'acc_pass', label: 'Change Pass', msg: 'Use the "Forgot Password" link on the login page.' },
  ]
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I am TaxBee, your AI companion. How can I assist you today?', options: INITIAL_OPTIONS }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleOptionClick = (opt) => {
    const userMsg = { role: 'user', text: opt.label || opt.id }
    setMessages(prev => [...prev, userMsg])
    
    setLoading(true)
    setTimeout(() => {
        let botResponse = { role: 'bot' }
        if (SUB_OPTIONS[opt.id]) {
            botResponse.text = `Sure! Here are some common questions about ${opt.label}:`
            botResponse.options = SUB_OPTIONS[opt.id]
        } else if (opt.msg) {
            botResponse.text = opt.msg
        } else {
            botResponse.text = `You selected ${opt.label}. I'm here to help! Feel free to ask more specific questions below.`
        }
        setMessages(prev => [...prev, botResponse])
        setLoading(false)
    }, 600)
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await axios.post('/ai/chat', { message: input })
      setMessages(prev => [...prev, { role: 'bot', text: data.response }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having a little trouble connecting to my hive. Please try again later!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-neutral-dark rounded-[1.5rem] flex items-center justify-center text-brand-yellow shadow-2xl hover:scale-110 active:scale-95 transition-all group overflow-hidden">
        <div className="absolute inset-0 bg-brand-yellow opacity-0 group-hover:opacity-10 transition-opacity"></div>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="animate-wiggle" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green border-4 border-white rounded-full"></div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-neutral-light flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="p-6 bg-neutral-dark text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-neutral-dark shadow-glow">
                  <Bot size={22} />
               </div>
               <div>
                  <h3 className="text-sm font-black tracking-widest uppercase">TaxBee Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
                     <span className="text-[9px] font-black uppercase text-brand-green">Always Buzzzing</span>
                  </div>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
               <ChevronRight size={20} className="rotate-90" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-neutral-light/5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className="max-w-[85%] space-y-2">
                  <div className={`
                    p-4 rounded-[1.5rem] text-sm font-bold leading-relaxed shadow-sm
                    ${m.role === 'user' ? 'bg-brand-yellow text-neutral-dark rounded-br-none' : 'bg-white border border-neutral-light text-neutral-dark rounded-bl-none'}
                  `}>
                    {m.text}
                  </div>
                  
                  {/* Option Buttons */}
                  {m.options && (
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {m.options.map(opt => (
                        <button key={opt.id || opt.label} onClick={() => handleOptionClick(opt)}
                          className="flex items-center justify-between p-3 bg-white border border-neutral-light rounded-xl hover:border-brand-yellow hover:translate-x-2 transition-all group text-left shadow-sm">
                          <div className="flex items-center gap-3">
                            {opt.icon && <opt.icon size={16} className={opt.color} />}
                            <span className="text-xs font-black text-neutral-dark">{opt.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-neutral-medium opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-light p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                   {[0, 1, 2].map(d => (
                     <div key={d} className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: `${d * 0.1}s` }}></div>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-neutral-light">
             <form onSubmit={handleSend} className="bg-neutral-light/30 p-2 rounded-2xl flex items-center gap-2 border border-transparent focus-within:border-brand-yellow transition-all">
                <input 
                  type="text" value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything about taxes..."
                  className="bg-transparent border-none text-sm font-bold w-full focus:ring-0 placeholder:text-neutral-medium"
                />
                <button type="submit" disabled={loading}
                  className="w-10 h-10 bg-neutral-dark text-brand-yellow rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                  <Send size={18} />
                </button>
             </form>
             <p className="text-[9px] font-bold text-neutral-medium text-center mt-3 uppercase tracking-widest">
                Powered by Groq Intelligence • Llama-3-70B
             </p>
          </div>

        </div>
      )}
    </div>
  )
}

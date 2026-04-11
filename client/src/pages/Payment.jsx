import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { CheckCircle, CreditCard, Shield, Tag, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const plans = [
  { id: 'basic', name: 'Basic', price: 499, features: ['ITR-1 & ITR-2', 'AI Tax Calculator', 'Email Support'] },
  { id: 'professional', name: 'Professional', price: 899, popular: true, features: ['All ITR Forms', 'Deduction Optimizer', '1 Expert Session', 'Priority Support'] },
  { id: 'premium', name: 'Premium', price: 1499, features: ['Everything in Pro', '3 Expert Sessions', 'Phone Support', 'Business Tax Planning'] },
]

export default function Payment() {
  const [selected, setSelected] = useState('professional')
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()

  const plan = plans.find(p => p.id === selected)
  const finalAmount = plan.price - discount

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'TAXBEE50') {
      setDiscount(Math.round(plan.price * 0.5))
      toast.success('50% discount applied! 🎉')
    } else if (promoCode.toUpperCase() === 'WELCOME100') {
      setDiscount(100)
      toast.success('₹100 off applied!')
    } else {
      toast.error('Invalid promo code')
    }
  }

  const handlePay = async () => {
    setPaying(true)
    await new Promise(r => setTimeout(r, 2000))
    setPaying(false)
    toast.success(`Payment of ₹${finalAmount} successful! 🎉 Receipt sent to your email.`)
    navigate('/filing-status')
  }

  return (
    <DashboardLayout title="Payment" subtitle="Choose your plan and pay securely">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan selection */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-black text-neutral-dark mb-4 flex items-center gap-2">
               <span className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center text-sm">🐝</span>
               Select Your Filing Plan
            </h2>
            {plans.map(p => (
              <div key={p.id}
                onClick={() => { setSelected(p.id); setDiscount(0) }}
                className={`card p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group
                  ${selected === p.id ? 'border-2 border-brand-yellow bg-primary-50/20 shadow-lg' : 'border border-gray-100 hover:border-brand-yellow/30'}`}>
                {p.popular && (
                  <span className="absolute -top-0 -right-0 bg-brand-yellow text-neutral-dark text-[10px] font-black px-6 py-1 rotate-45 translate-x-4 translate-y-2 shadow-sm border-b border-brand-yellowDark">POPULAR</span>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${selected === p.id ? 'border-brand-yellow bg-brand-yellow' : 'border-gray-300'}`}>
                      {selected === p.id && <div className="w-2.5 h-2.5 bg-neutral-dark rounded-full" />}
                    </div>
                    <div>
                        <span className="font-black text-neutral-dark text-lg">{p.name} Plan</span>
                        <p className="text-[10px] uppercase font-bold text-neutral-medium tracking-widest">AY 2025-26 Covered</p>
                    </div>
                  </div>
                  <div className="text-right">
                      <span className="text-3xl font-black text-neutral-dark tracking-tighter">₹{p.price}</span>
                      <p className="text-[10px] font-bold text-neutral-medium">Flat Fee</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 ml-10">
                  {p.features.map(f => (
                    <span key={f} className="flex items-center gap-1.5 text-xs font-bold text-neutral-dark bg-white px-3 py-1 rounded-full shadow-sm border border-gray-50">
                      <CheckCircle size={14} className="text-brand-green" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card p-6 border-b-4 border-brand-green">
              <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest mb-6 pb-2 border-b border-neutral-light">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-light/30 p-3 rounded-xl border border-neutral-light">
                  <span className="text-xs font-bold text-neutral-medium">Selected Plan</span>
                  <span className="text-sm font-black text-neutral-dark">{plan.name}</span>
                </div>
                <div className="flex justify-between px-1">
                  <span className="text-xs font-bold text-neutral-medium">Filing Fee</span>
                  <span className="text-sm font-black text-neutral-dark">₹{plan.price}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between px-1 text-brand-green">
                    <span className="text-xs font-bold">Promo Discount</span>
                    <span className="text-sm font-black">- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between px-1 text-neutral-medium">
                  <span className="text-xs font-bold">GST (18%)</span>
                  <span className="text-xs font-bold uppercase">Included</span>
                </div>
                <div className="pt-2 border-t-2 border-dashed border-neutral-light mt-2">
                    <div className="flex justify-between items-center text-lg font-black bg-neutral-light/50 p-4 rounded-xl">
                      <span className="text-neutral-dark">Payable</span>
                      <span className="text-brand-green">₹{finalAmount}</span>
                    </div>
                </div>
              </div>

              {/* Promo */}
              <div className="mt-6 bg-neutral-light/20 p-4 rounded-xl border border-neutral-light">
                <label className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mb-2 block">Have a Coupon?</label>
                <div className="flex gap-2">
                  <input className="input-field text-sm font-bold py-2.5 flex-1 shadow-sm" placeholder="TAXBEE50"
                    value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                  <button onClick={applyPromo} className="bg-neutral-dark text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:bg-black transition-all">
                    Apply
                  </button>
                </div>
                <p className="text-[10px] text-neutral-medium mt-2 font-bold italic">Try: <span className="text-brand-green">TAXBEE50</span> (50% OFF)</p>
              </div>

              <button onClick={handlePay} disabled={paying}
                className="btn-primary w-full justify-center mt-6 py-4 shadow-xl disabled:opacity-50 text-base font-black">
                {paying ? (
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 border-3 border-neutral-dark/30 border-t-neutral-dark rounded-full animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard size={20} /> Pay Securely <ArrowRight size={20} />
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-neutral-medium bg-neutral-light/30 py-2 rounded-lg">
                <Shield size={14} className="text-brand-green" /> 256-bit SSL Secure Payment
              </div>
            </div>

            {/* Methods */}
            <div className="card p-5 bg-neutral-light/10 border-dashed border-2">
                <p className="text-[10px] font-black text-neutral-medium uppercase tracking-widest mb-4">Channels Supported</p>
                <div className="flex flex-wrap gap-2">
                  {['UPI', 'Card', 'Net Banking', 'EMI'].map(m => (
                    <span key={m} className="text-[10px] font-black text-neutral-dark bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">{m}</span>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

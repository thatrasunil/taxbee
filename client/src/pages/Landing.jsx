import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  CheckCircle, ArrowRight, Zap, Shield, HeadphonesIcon, Globe,
  Star, TrendingUp, Users, FileText, ChevronRight, Phone, Mail,
  PieChart, Activity, Fingerprint, Lock
} from 'lucide-react'

const features = [
  { icon: Zap, color: 'from-brand-yellow to-brand-yellowDark', title: 'File in 15 Minutes', desc: 'Our guided 5-step wizard makes ITR filing quick and error-free for any income type.' },
  { icon: Shield, color: 'from-brand-green to-secondary-900', title: 'Bank-Grade Security', desc: 'Your data is encrypted with AES-256. Fully GDPR-compliant with Aadhaar eSign.' },
  { icon: HeadphonesIcon, color: 'from-brand-yellow to-brand-yellowDark', title: 'Hindi Support 24/7', desc: 'Expert tax advisors available via WhatsApp, phone & chat in Hindi and English.' },
  { icon: Globe, color: 'from-brand-green to-secondary-900', title: 'All ITR Forms', desc: 'ITR-1 through ITR-7 supported. For salaried, freelancers, businesses & NRIs.' },
]

const steps = [
  { num: '01', title: 'Register & KYC', desc: 'Sign up with your PAN and Aadhaar. Quick 2-minute verification.' },
  { num: '02', title: 'Enter Income Details', desc: 'Fill salary, business income, investments using our smart wizard.' },
  { num: '03', title: 'AI Calculates Tax', desc: 'Our engine auto-computes tax, deductions, and maximum refund.' },
  { num: '04', title: 'Review & Pay', desc: 'Review your return, pay our fee, and file with Aadhaar OTP.' },
]

const plans = [
  {
    name: 'Basic', price: '₹499', period: '/filing', color: 'border-gray-200',
    badge: null, highlight: false,
    features: ['ITR-1 & ITR-2 Filing', 'AI Tax Calculator', 'Document Upload (10)', 'Email Support', 'Refund Tracking'],
  },
  {
    name: 'Professional', price: '₹899', period: '/filing', color: 'border-brand-yellow',
    badge: 'Most Popular', highlight: true,
    features: ['All ITR Forms', 'AI Deduction Optimizer', 'Document Upload (50)', '24hr Email Support', '1 Expert Consultation', 'Amendment Filing', 'Tax Certificate'],
  },
  {
    name: 'Premium', price: '₹1,499', period: '/filing', color: 'border-brand-green',
    badge: 'Best Value', highlight: false,
    features: ['Everything in Professional', 'Unlimited Documents', '2hr Priority Support', 'Phone Support', '3 Expert Consultations', '2 Free Amendments', 'Business Tax Planning'],
  },
]

// Floating SVG Elements Component
const BackgroundParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div className="absolute top-10 left-10 w-20 h-20 animate-float-delayed">
        <PieChart size={80} className="text-white opacity-20" />
    </div>
    <div className="absolute top-1/2 right-20 w-16 h-16 animate-float">
        <Activity size={60} className="text-brand-yellow opacity-30" />
    </div>
    <div className="absolute bottom-1/4 left-1/4 w-12 h-12 animate-slow-spin">
        <PinSvg color="#FFC107" />
    </div>
    <div className="absolute top-1/4 right-1/3 w-24 h-24 animate-float-delayed">
        <Fingerprint size={100} className="text-white opacity-10" />
    </div>
  </div>
)

const PinSvg = ({ color }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
        <path d="M20 10V30M10 20H30" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
)

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-hero-gradient pt-20 pb-32 md:pt-32 md:pb-48">
        <BackgroundParticles />
        
        {/* Animated Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-yellow opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse-slow"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Content */}
            <div className="text-left animate-reveal-left">


              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 drop-shadow-lg">
                File Your ITR with<br />
                <span className="text-brand-yellow">Smart AI</span> & Experts
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 font-medium max-w-xl mb-12 leading-relaxed">
                India's most trusted tax platform. Secure, accurate, and 100% stress-free filing starting at just ₹499.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/register" className="btn-primary px-10 py-5 text-xl shadow-[0_20px_50px_rgba(255,193,7,0.3)] bg-shine group">
                  Start Filing Now <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-3 items-center">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-green bg-neutral-light flex items-center justify-center text-[10px] font-black">{i}k</div>
                    ))}
                    <span className="pl-6 text-white text-sm font-bold">+25k Ratings</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 text-white/80 text-[10px] font-black uppercase tracking-widest px-2 py-4 border-t border-white/10">
                 <div className="flex items-center gap-2"><Shield size={14} className="text-brand-yellow" /> Govt. Authorized</div>
                 <div className="flex items-center gap-2"><Lock size={14} className="text-brand-yellow" /> AES-256 Secure</div>
                 <div className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-yellow" /> 100% Reliable</div>
                 <div className="flex items-center gap-2"><Star size={14} className="text-brand-yellow" /> 4.9/5 Rating</div>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="relative animate-reveal-right hidden lg:block">
               <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-full scale-110 animate-pulse-slow"></div>
               <div className="relative z-10 animate-float p-4">
                  <img src="/assets/hero-audit.png" alt="Tax Consultant" className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] rounded-[2.5rem]" />
                  
                  {/* Floating floating elements */}
                  <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl animate-float-delayed border border-neutral-light hidden xl:block">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-brand-green">
                           <TrendingUp size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-neutral-medium uppercase tracking-widest">Calculated Refund</p>
                           <p className="text-xl font-black text-neutral-dark">₹12,450.00</p>
                        </div>
                     </div>
                  </div>

                  <div className="absolute -bottom-6 -left-10 glass-morphism p-6 rounded-3xl shadow-2xl animate-float border border-white/30 hidden xl:block">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
                           <FileText size={20} className="text-neutral-dark" />
                        </div>
                        <span className="text-white font-black text-sm uppercase tracking-tighter">ITR-1 Form Verified</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* REVENUE / STATS BAR */}
      <section className="bg-neutral-dark py-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-green opacity-0 group-hover:opacity-5 transition-opacity duration-1000"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
             {[

               { val: '₹120Cr', label: 'Refunds Processed', sub: 'Maximize your tax save' },
               { val: '24/7', label: 'Expert Support', sub: 'WhatsApp & Direct Call' },
               { val: '0.1%', label: 'Revision Rate', sub: 'Highest accuracy engine' }
             ].map(s => (
               <div key={s.label} className="text-center group-hover:scale-105 transition-transform">
                  <p className="text-4xl font-black text-white tracking-tighter mb-1">{s.val}</p>
                  <p className="text-brand-yellow text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-gray-500 text-[9px] font-bold uppercase">{s.sub}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES WITH ILLUSTRATIONS */}
      <section id="features" className="py-24 bg-neutral-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-reveal-up">
            <span className="text-brand-green font-black text-xs uppercase tracking-[0.2em] mb-4 block">Our Superpowers</span>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-dark leading-tight">
               Built for Speed, Accuracy,<br />and Complete Peace of Mind
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-10 bg-white border-b-8 border-brand-yellow hover:-translate-y-4 transition-all duration-500 overflow-hidden group">
               <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-brand-yellowDark mb-8 group-hover:bg-brand-yellow transition-colors">
                  <Zap size={32} />
               </div>
               <h3 className="text-xl font-black text-neutral-dark mb-4">15-Min Flash Filing</h3>
               <p className="text-neutral-medium leading-relaxed font-medium mb-8"> Our ultra-fast wizard processes your complex tax data in seconds. Just upload and verify — we do the heavy lifting.</p>
               <div className="relative h-40 bg-neutral-light rounded-2xl overflow-hidden mt-auto">
                    {/* Abstract SVG Animation */}
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
                        <Activity size={80} className="text-brand-yellow opacity-40" />
                    </div>
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-yellow/10"></div>
               </div>
            </div>

             {/* Feature 2 */}
             <div className="card p-10 bg-neutral-dark text-white border-b-8 border-brand-green hover:-translate-y-4 transition-all duration-500 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
               <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center text-neutral-dark mb-8 group-hover:rotate-12 transition-transform">
                  <Shield size={32} />
               </div>
               <h3 className="text-xl font-black text-white mb-4">AES-256 Vault Protection</h3>
               <p className="text-gray-400 leading-relaxed font-medium mb-8"> Your financial privacy is our obsession. We use banking-grade encryption and secure private servers to house your data.</p>
               <div className="mt-auto">
                  <div className="flex gap-2 mb-4">
                     {[1,2,3,4,5].map(b => <div key={b} className="h-1.5 flex-1 bg-brand-green/20 rounded-full overflow-hidden"><div className="h-full bg-brand-green animate-pulse-slow" style={{animationDelay: `${b*0.2}s`}}></div></div>)}
                  </div>
                  <span className="text-[10px] font-black uppercase text-brand-green tracking-[0.2em]">Zero Data Leak Guarantee</span>
               </div>
            </div>

             {/* Feature 3 */}
             <div className="card p-10 bg-white border-b-8 border-neutral-dark hover:-translate-y-4 transition-all duration-500 overflow-hidden group">
               <div className="w-16 h-16 bg-neutral-light rounded-2xl flex items-center justify-center text-neutral-dark mb-8 group-hover:scale-110 transition-transform">
                  <HeadphonesIcon size={32} />
               </div>
               <h3 className="text-xl font-black text-neutral-dark mb-4">24/7 Hive Support</h3>
               <p className="text-neutral-medium leading-relaxed font-medium mb-8"> Get your tax queries answered in real-time. Contact our experts via WhatsApp or Phone — available in 10+ languages.</p>
               <div className="flex items-center gap-4 mt-auto p-4 bg-neutral-light rounded-2xl">
                   <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center animate-bounce">
                      <Phone size={18} className="text-white" />
                   </div>
                   <p className="text-xs font-black text-neutral-dark uppercase tracking-widest">Support Line Active</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS WITH MOTION */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2 animate-reveal-left">
                <span className="text-brand-yellowDark font-black text-xs uppercase tracking-[0.2em] mb-4 block">Step-by-Step Flow</span>
                <h2 className="text-4xl md:text-5xl font-black text-neutral-dark leading-tight mb-12">
                   The Smartest Way to<br />File in 4 Simple Steps
                </h2>
                
                <div className="space-y-10 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-[31px] top-4 bottom-4 w-1 bg-neutral-light"></div>
                   
                   {steps.map((s, i) => (
                      <div key={s.num} className="flex items-start gap-8 relative group">
                         <div className="w-16 h-16 bg-white border-4 border-neutral-light rounded-[1.5rem] flex items-center justify-center flex-shrink-0 z-10 group-hover:border-brand-yellow group-hover:bg-neutral-dark transition-all duration-300">
                            <span className="text-xl font-black text-neutral-dark group-hover:text-brand-yellow">{s.num}</span>
                         </div>
                         <div>
                            <h3 className="text-lg font-black text-neutral-dark mb-2">{s.title}</h3>
                            <p className="text-neutral-medium text-sm leading-relaxed max-w-sm">{s.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="lg:w-1/2 relative animate-reveal-right">
                <div className="absolute -inset-10 bg-brand-yellow/5 rounded-full blur-[100px] animate-pulse-slow"></div>
                {/* SVG Motion Graphic Concept */}
                <div className="relative bg-neutral-light p-10 rounded-[3rem] shadow-inner border border-neutral-light animate-float">
                    <img src="https://images.placeholder.com/600x600?text=TaxBee+Animation+Placeholder" alt="Workflow" className="w-full h-auto rounded-3xl mix-blend-multiply opacity-50 grayscale" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-8 bg-white rounded-3xl shadow-2xl border-4 border-brand-yellow scale-110">
                            <CheckCircle size={60} className="text-brand-green animate-bounce" />
                            <p className="mt-4 font-black text-neutral-dark uppercase tracking-widest text-center">Filing Success</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-hero-gradient relative overflow-hidden group">
         <BackgroundParticles />
         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
         <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-black mb-8 drop-shadow-xl animate-reveal-up">
              Ready for a<br />Better Tax Experience?
            </h2>
            <p className="text-xl md:text-2xl font-bold opacity-90 mb-12 animate-reveal-up" style={{animationDelay: '0.2s'}}>
              No more confusing forms. No more tax stress. Just simple, smart filing for everyone.
            </p>
            <Link to="/register" className="btn-primary px-12 py-6 text-2xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-shine mx-auto inline-flex items-center gap-4">
              Join the Hive Today <ArrowRight size={28} />
            </Link>
         </div>
      </section>

      {/* RE-USE FOOTER */}
      <footer className="bg-neutral-dark pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-4 gap-16 mb-20 text-white">
              <div className="col-span-1 md:col-span-1">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center text-neutral-dark shadow-lg">
                       <span className="text-2xl font-black">🐝</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter">Tax Bee</span>
                 </div>
                 <p className="text-gray-400 font-medium leading-loose mb-8">
                    Empowering Indian taxpayers with AI intelligence and human care. Simple, fast, and transparent.
                 </p>
                 <div className="flex gap-4">
                    {[1,2,3].map(i => <div key={i} className="w-10 h-10 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" />)}
                 </div>
              </div>
              
              {[
                { title: 'Hive Services', links: ['Salaried Filing', 'Business ITR', 'Crypto Tax', 'Capital Gains', 'Notice Help'] },
                { title: 'Tax Library', links: ['Income Tax Guide', 'Deduction List', 'GST Basics', 'Refund Status', 'Calculator'] },
                { title: 'Company', links: ['Our Story', 'Careers', 'Security', 'Privacy', 'Contact Us'] }
              ].map(c => (
                <div key={c.title}>
                   <h4 className="text-brand-yellow font-black text-xs uppercase tracking-[0.2em] mb-10">{c.title}</h4>
                   <ul className="space-y-4">
                      {c.links.map(l => (
                        <li key={l}><a href="#" className="text-gray-400 font-bold text-sm hover:text-brand-yellow transition-colors">{l}</a></li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>
           
           <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 font-black text-[10px] uppercase tracking-widest">
              <p>© 2026 Tax Bee Solutions. Made with ♥ in Bharat.</p>
              <div className="flex gap-10">
                 <span>GSTIN: 29ABCDE1234F1Z5</span>
                 <span>CIN: U74999KA2026PTC000001</span>
              </div>
           </div>
        </div>
      </footer>
    </div>
  )
}

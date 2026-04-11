import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { registerUser } from '../store/authSlice'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const schema = Yup.object({
  name: Yup.string().min(2, 'Too short').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  pan: Yup.string().min(5, 'Too short').required('PAN is required'),
  phone: Yup.string().required('Phone is required'),
  password: Yup.string().min(8, 'Min 8 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Confirm password'),
})

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (values) => {
    const res = await dispatch(registerUser(values))
    if (registerUser.fulfilled.match(res)) {
      toast.success('Account created! Welcome to Tax Bee 🎉')
      navigate('/dashboard')
    } else {
      toast.error(res.payload || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-light flex font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-yellow/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
             <span className="text-brand-yellow font-black text-2xl select-none">🐝</span>
          </div>
          <span className="font-black text-3xl text-white tracking-tight drop-shadow-sm">Tax Bee</span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
            India's Smartest<br />ITR <span className="text-brand-yellow">Filing</span> Platform
          </h2>
          <ul className="space-y-4">
            {[
              'File ITR in 15 minutes',
              'AI-powered deduction optimizer',
              'Expert support in Hindi',
              'Refund in 7-10 days',
              '50,000+ successful filings',
            ].map(i => (
              <li key={i} className="flex items-center gap-4 text-white font-bold text-sm">
                <div className="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                   <CheckCircle size={14} className="text-neutral-dark" />
                </div>
                {i}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-white/40 text-xs font-medium uppercase tracking-widest">© 2026 Tax Bee Solutions • Privacy Guaranteed</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:text-left text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-md">
                <span className="text-neutral-dark text-xl select-none">🐝</span>
              </div>
              <span className="font-black text-2xl tracking-tighter">
                <span className="text-brand-green">Tax</span>
                <span className="text-neutral-dark">Bee</span>
              </span>
            </Link>
            <h1 className="text-3xl font-black text-neutral-dark">Join the swarm</h1>
            <p className="text-neutral-medium font-medium mt-2">Start filing your ITR for free today.</p>
          </div>

          <Formik initialValues={{ name: '', email: '', pan: '', phone: '', password: '', confirmPassword: '' }}
            validationSchema={schema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="space-y-4">
                {[
                  { name: 'name', label: 'Full Name', placeholder: 'Rahul Sharma', type: 'text' },
                  { name: 'email', label: 'Email Address', placeholder: 'rahul@taxbee.in', type: 'email' },
                  { name: 'pan', label: 'PAN Number', placeholder: 'ABCDE1234F', type: 'text', upper: true },
                  { name: 'phone', label: 'Mobile Number', placeholder: '9876543210', type: 'tel' },
                ].map(({ name, label, placeholder, type, upper }) => (
                  <div key={name}>
                    <label className="label">{label}</label>
                    <Field name={name} type={type} placeholder={placeholder}
                      className={`input-field ${errors[name] && touched[name] ? 'border-red-400 ring-4 ring-red-50' : ''}`}
                      style={upper ? { textTransform: 'uppercase' } : {}} />
                    {errors[name] && touched[name] && (
                      <p className="text-red-500 text-xs font-bold mt-1.5 ml-1">{errors[name]}</p>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <Field name="password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                        className={`input-field pr-12 ${errors.password && touched.password ? 'border-red-400' : ''}`} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium hover:text-neutral-dark">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label">Confirm</label>
                    <Field name="confirmPassword" type="password" placeholder="••••••••"
                      className={`input-field ${errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : ''}`} />
                  </div>
                </div>
                {( (errors.password && touched.password) || (errors.confirmPassword && touched.confirmPassword) ) && (
                   <p className="text-red-500 text-xs font-bold ml-1">
                      {errors.password || errors.confirmPassword}
                   </p>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-100 rounded-xl px-5 py-4 text-red-600 text-sm font-bold animate-pulse-slow">⚠️ {error}</div>
                )}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-lg shadow-xl disabled:opacity-50 mt-4">
                  {loading ? (
                    <span className="flex items-center gap-3"><span className="w-5 h-5 border-3 border-neutral-dark/30 border-t-neutral-dark rounded-full animate-spin" /> Synergizing...</span>
                  ) : (
                    <span className="flex items-center gap-2">Create Free Account <ArrowRight size={20} /></span>
                  )}
                </button>

                <p className="text-center text-sm text-neutral-medium font-medium pt-4">
                  Already a member?{' '}
                  <Link to="/login" className="text-secondary-700 font-black hover:underline ml-1">Sign In</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

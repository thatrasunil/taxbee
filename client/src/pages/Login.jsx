import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { loginUser } from '../store/authSlice'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const demoAccounts = [
  { label: 'User', email: 'user@taxbee.in', password: 'password123', role: 'user' },
  { label: 'Admin', email: 'admin@taxbee.in', password: 'admin123', role: 'admin' },
  { label: 'Employee', email: 'emp@taxbee.in', password: 'emp123', role: 'employee' },
]

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (values) => {
    const res = await dispatch(loginUser(values))
    if (loginUser.fulfilled.match(res)) {
      toast.success(`Welcome back, ${res.payload.user.name.split(' ')[0]}! 👋`)
      const role = res.payload.user.role
      if (role === 'admin') navigate('/admin')
      else if (role === 'employee') navigate('/employee')
      else navigate('/dashboard')
    } else {
      toast.error(res.payload || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-light flex font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-brand-yellow font-black text-2xl select-none">🐝</span>
          </div>
          <span className="font-black text-3xl text-white tracking-tight drop-shadow-sm">Tax Bee</span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
            Welcome Back!<br />Let's file your<br />taxes <span className="text-brand-yellow">together.</span>
          </h2>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
            <p className="text-brand-yellow text-xs font-black uppercase tracking-widest mb-4">🎮 Demo Access</p>
            <div className="space-y-3">
              {demoAccounts.map(a => (
                <div key={a.role} className="text-white/80 text-sm">
                  <span className="font-bold text-white pr-2">{a.label}:</span>
                  <code className="bg-black/20 px-2 py-0.5 rounded">{a.email}</code>
                </div>
              ))}
            </div>
          </div>
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
            <h1 className="text-3xl font-black text-neutral-dark">Sign in</h1>
            <p className="text-neutral-medium font-medium mt-2">Manage your filings & track your refund status.</p>
          </div>

          {/* Demo quick login */}
          <div className="bg-primary-50 border-2 border-brand-yellow/30 rounded-2xl p-5 mb-8 lg:hidden">
            <p className="text-brand-yellowDark text-xs font-black uppercase tracking-widest mb-3">Quick Login (Demo):</p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map(a => (
                <button key={a.role} onClick={() => handleSubmit({ email: a.email, password: a.password })}
                  className="text-xs bg-white text-neutral-dark border border-brand-yellow/20 px-4 py-2 rounded-xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95">
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <Formik initialValues={{ email: '', password: '' }} validationSchema={schema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="label">Email Address</label>
                  <Field name="email" type="email" placeholder="rahul@taxbee.in"
                    className={`input-field ${errors.email && touched.email ? 'border-red-400' : ''}`} />
                  {errors.email && touched.email && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label mb-0">Password</label>
                    <a href="#" className="text-xs text-secondary-700 font-bold hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Field name="password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                      className={`input-field pr-12 ${errors.password && touched.password ? 'border-red-400' : ''}`} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium hover:text-neutral-dark transition-colors">
                      {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && touched.password && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1">{errors.password}</p>}
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-100 rounded-xl px-5 py-4 text-red-600 text-sm font-bold animate-pulse-slow">
                    ⚠️ {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-lg shadow-xl disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center gap-3"><span className="w-5 h-5 border-3 border-neutral-dark/30 border-t-neutral-dark rounded-full animate-spin" /> Verifying...</span>
                  ) : (
                    <span className="flex items-center gap-2">Sign In to Dashboard <ArrowRight size={20} /></span>
                  )}
                </button>

                <div className="relative py-4">
                   <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-light"></div>
                   <p className="relative text-center bg-white px-4 mx-auto w-fit text-xs font-bold text-neutral-medium uppercase tracking-widest">or</p>
                </div>

                <p className="text-center text-sm text-neutral-medium font-medium">
                  New to the swarm?{' '}
                  <Link to="/register" className="text-secondary-700 font-black hover:underline ml-1">Create free account</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

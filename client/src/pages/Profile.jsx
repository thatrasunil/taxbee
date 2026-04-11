import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DashboardLayout from '../components/DashboardLayout'
import { 
  User, Mail, Phone, Shield, Edit2, Save, X, 
  CheckCircle, MapPin, Key, Bell, CreditCard, Clock
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Profile() {
  const { user } = useSelector(s => s.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul@taxbee.com',
    phone: '+91 98765 43210',
    pan: user?.pan || 'AABPP9928K',
    address: '123, Green Hive Towers, New Delhi',
  })

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Hive profile updated successfully!')
  }

  return (
    <DashboardLayout title="Member Profile" subtitle="Manage your personal details and security settings">
      
      <div className="grid lg:grid-cols-4 gap-8">
          
          {/* 1. Profile Sidebar (Left) */}
          <div className="lg:col-span-1 space-y-6">
              <div className="card text-center p-8 bg-neutral-dark text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                      <div className="w-24 h-24 bg-brand-yellow rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-neutral-dark font-black text-3xl shadow-glow animate-float">
                          {formData.name[0]}
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{formData.name}</h3>
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.25em] mt-1 mb-6">Verified Member</p>
                      
                      <div className="space-y-3 pt-6 border-t border-white/10">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                              <span>Membership</span>
                              <span className="text-brand-yellow">Premium</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                              <span>Member Since</span>
                              <span className="text-white">Jan 2026</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Quick Navigation Hooks */}
              <div className="space-y-3">
                  {[
                    { label: 'Security & Password', icon: Key },
                    { label: 'Notification Prefs', icon: Bell },
                    { label: 'Subscription Info', icon: CreditCard },
                    { label: 'Billing Address', icon: MapPin },
                  ].map(item => (
                    <button key={item.label} className="w-full flex items-center gap-4 p-4 bg-white border border-neutral-light rounded-2xl hover:border-brand-yellow hover:translate-x-2 transition-all group">
                        <item.icon size={18} className="text-neutral-medium group-hover:text-brand-yellowDark" />
                        <span className="text-sm font-black text-neutral-dark text-left">{item.label}</span>
                    </button>
                  ))}
              </div>
          </div>

          {/* 2. Main Edit Form area */}
          <div className="lg:col-span-3 space-y-8">
              
              <div className="card shadow-2xl border-2 border-neutral-light overflow-hidden">
                  <div className="px-8 py-6 border-b border-neutral-light flex items-center justify-between bg-neutral-light/5">
                      <div className="flex items-center gap-3">
                          <User size={20} className="text-brand-yellowDark" />
                          <h3 className="text-sm font-black text-neutral-dark uppercase tracking-widest">General Information</h3>
                      </div>
                      <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          isEditing ? 'bg-brand-green text-white shadow-glow' : 'bg-neutral-dark text-brand-yellow hover:scale-105'
                        }`}>
                          {isEditing ? <><Save size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit Profile</>}
                      </button>
                  </div>
                  
                  <div className="p-8 grid md:grid-cols-2 gap-8 bg-white">
                      {[
                        { label: 'Full Name', key: 'name', icon: User },
                        { label: 'Email Address', key: 'email', icon: Mail },
                        { label: 'Phone Number', key: 'phone', icon: Phone },
                        { label: 'PAN Number', key: 'pan', icon: Shield, disabled: true },
                      ].map(field => (
                        <div key={field.key} className="space-y-2">
                           <label className="text-[10px] font-black text-neutral-medium uppercase tracking-widest block ml-1">{field.label}</label>
                           <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                             isEditing && !field.disabled ? 'border-brand-yellow bg-primary-50' : 'border-neutral-light bg-neutral-light/5'
                           }`}>
                               <field.icon size={18} className="text-neutral-medium" />
                               <input 
                                 type="text" value={formData[field.key]} 
                                 onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                                 disabled={!isEditing || field.disabled}
                                 className="bg-transparent border-none text-sm font-black w-full focus:ring-0 text-neutral-dark disabled:opacity-70"
                               />
                           </div>
                        </div>
                      ))}

                      <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-neutral-medium uppercase tracking-widest block ml-1">Living Address</label>
                          <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                             isEditing ? 'border-brand-yellow bg-primary-50' : 'border-neutral-light bg-neutral-light/5'
                           }`}>
                               <MapPin size={18} className="text-neutral-medium" />
                               <textarea 
                                 value={formData.address}
                                 onChange={e => setFormData({...formData, address: e.target.value})}
                                 disabled={!isEditing}
                                 className="bg-transparent border-none text-sm font-black w-full focus:ring-0 text-neutral-dark disabled:opacity-70 h-20 resize-none"
                               />
                          </div>
                      </div>
                  </div>

                  <div className="p-8 bg-neutral-light/10 border-t border-neutral-light">
                      <div className="flex items-center gap-4 p-5 bg-white border-2 border-brand-green/20 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                              <CheckCircle size={20} />
                          </div>
                          <div>
                              <p className="text-xs font-black text-neutral-dark uppercase tracking-tight">Identity Fully Verified</p>
                              <p className="text-[10px] font-bold text-neutral-medium mt-0.5">Your PAN and Aadhaar are linked and verified by the hive.</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Account Security Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-8 group">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Login Security</h4>
                          <Shield size={20} className="text-brand-green" />
                      </div>
                      <p className="text-[10px] font-bold text-neutral-medium uppercase tracking-widest leading-relaxed">Ensure your account is safe with Two-Factor Authentication (2FA).</p>
                      <button className="mt-6 text-[10px] font-black text-brand-yellowDark uppercase border-b border-brand-yellowDark pb-0.5 hover:opacity-70 transition-opacity">Enable 2FA Protection</button>
                  </div>

                  <div className="card p-8 group">
                      <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-black text-neutral-dark uppercase tracking-widest">Active Sessions</h4>
                          <Clock size={20} className="text-neutral-medium" />
                      </div>
                      <p className="text-[10px] font-bold text-neutral-medium uppercase tracking-widest leading-relaxed">Logged in from Windows Desktop • New Delhi, India</p>
                      <button className="mt-6 text-[10px] font-black text-red-500 uppercase border-b border-red-500 pb-0.5 hover:opacity-70 transition-opacity">Terminate Sessions</button>
                  </div>
              </div>

          </div>
      </div>

    </DashboardLayout>
  )
}

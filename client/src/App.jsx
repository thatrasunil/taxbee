import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FilingWizard from './pages/FilingWizard'
import Documents from './pages/Documents'
import Payment from './pages/Payment'
import FilingStatus from './pages/FilingStatus'
import Profile from './pages/Profile'
import Support from './pages/Support'
import DocumentChecklist from './pages/DocumentChecklist'
import ITRFormPreview from './pages/ITRFormPreview'
import BankRevalidation from './pages/BankRevalidation'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmployeeVerifications from './pages/employee/EmployeeVerifications'
import EmployeeTickets from './pages/employee/EmployeeTickets'
import EmployeeKnowledge from './pages/employee/EmployeeKnowledge'
import AIChatbot from './components/AIChatbot'

const Protected = ({ children, role }) => {
  const { user, token } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { token } = useSelector(s => s.auth)
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Portal */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/file-itr" element={<Protected><FilingWizard /></Protected>} />
        <Route path="/documents" element={<Protected><Documents /></Protected>} />
        <Route path="/payment" element={<Protected><Payment /></Protected>} />
        <Route path="/filing-status" element={<Protected><FilingStatus /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/support" element={<Protected><Support /></Protected>} />
        <Route path="/document-checklist" element={<Protected><DocumentChecklist /></Protected>} />
        <Route path="/itr-form-preview" element={<Protected><ITRFormPreview /></Protected>} />
        <Route path="/bank-revalidation" element={<Protected><BankRevalidation /></Protected>} />

        {/* Admin */}
        <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
        <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard /></Protected>} />
        <Route path="/admin/users" element={<Protected role="admin"><AdminUsers /></Protected>} />

        {/* Employee */}
        <Route path="/employee" element={<Protected role="employee"><EmployeeDashboard /></Protected>} />
        <Route path="/employee/dashboard" element={<Protected role="employee"><EmployeeDashboard /></Protected>} />
        <Route path="/employee/verify" element={<Protected role="employee"><EmployeeVerifications /></Protected>} />
        <Route path="/employee/tickets" element={<Protected role="employee"><EmployeeTickets /></Protected>} />
        <Route path="/employee/kb" element={<Protected role="employee"><EmployeeKnowledge /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Global AI Assistant (Enabled for authenticated users) */}
      {token && <AIChatbot />}
    </BrowserRouter>
  )
}

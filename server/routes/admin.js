const express = require('express')
const { query } = require('../db/database')
const { adminOnly } = require('../middleware/auth')
const router = express.Router()

router.get('/stats', adminOnly, async (req, res) => {
  const users = await query.findAll('users', { role: 'user' })
  const filings = await query.findAll('filings')
  const pending = await query.findAll('filings', { status: 'draft' })
  const payments = await query.findAll('payments', { status: 'completed' })
  const revenue = payments.reduce((s, p) => s + (p.amount || 0), 0)
  res.json({ total_users: users.length, total_filings: filings.length, pending_filings: pending.length, total_revenue: revenue })
})

router.get('/users', adminOnly, async (req, res) => {
  const usersRaw = await query.findAll('users')
  const users = usersRaw.map(query.safeUser).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  res.json(users)
})

router.put('/users/:id/status', adminOnly, async (req, res) => {
  await query.update('users', req.params.id, { kyc_verified: req.body.kyc_verified })
  res.json({ message: 'Updated' })
})

router.get('/filings', adminOnly, async (req, res) => {
  const filingsRaw = await query.findAll('filings')
  const filingsWithUsers = await Promise.all(filingsRaw.map(async f => {
    const user = await query.findOne('users', { id: Number(f.user_id) })
    return { ...f, user_name: user?.name, user_email: user?.email, user_pan: user?.pan }
  }))
  const filings = filingsWithUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 50)
  res.json(filings)
})

// New Assignment Endpoints
router.get('/unassigned-filings', adminOnly, async (req, res) => {
  const filings = await query.findAll('filings', { status: 'AWAITING_EMPLOYEE_ASSIGNMENT' })
  const unassigned = await Promise.all(filings.map(async f => {
    const user = await query.findOne('users', { id: Number(f.user_id) })
    return { ...f, user_name: user?.name }
  }))
  res.json(unassigned)
})

router.get('/employees', adminOnly, async (req, res) => {
  const employees = await query.findAll('employees')
  res.json(employees)
})

router.post('/assign-employee', adminOnly, async (req, res) => {
  const { filing_id, employee_id, reason } = req.body
  
  // 1. Update Filing
  await query.update('filings', filing_id, {
    assigned_employee_id: employee_id,
    assignment_date: new Date().toISOString(),
    assigned_by: 'ADMIN',
    status: 'ASSIGNED_TO_EMPLOYEE',
    assignment_reason: reason
  })

  // 2. Update Employee Workload
  const employee = await query.findOne('employees', { id: Number(employee_id) })
  if (employee) {
    const newCount = (employee.assigned_users_count || 0) + 1
    const newWorkload = Math.round((newCount / (employee.max_capacity || 20)) * 100)
    await query.update('employees', employee_id, {
      assigned_users_count: newCount,
      current_workload_percentage: newWorkload
    })
  }

  res.json({ success: true, message: 'Employee assigned successfully' })
})

module.exports = router

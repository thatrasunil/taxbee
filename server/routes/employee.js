const express = require('express')
const { query } = require('../db/database')
const { auth } = require('../middleware/auth')
const router = express.Router()

// Middleware to ensure user is an employee
const employeeOnly = (req, res, next) => {
  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Employees only' })
  }
  next()
}

router.get('/my-assignments', [auth, employeeOnly], async (req, res) => {
  // Find the employee profile for this user
  const employee = await query.findOne('employees', { user_id: req.user.id })
  if (!employee) return res.status(404).json({ message: 'Employee profile not found' })

  const filings = await query.findAll('filings', { assigned_employee_id: employee.id })
  const assignments = await Promise.all(filings.map(async f => {
    const user = await query.findOne('users', { id: Number(f.user_id) })
    return { ...f, user_name: user?.name, user_pan: user?.pan }
  }))
  
  res.json(assignments)
})

router.get('/filing-documents/:id', [auth, employeeOnly], async (req, res) => {
  const docs = await query.findAll('documents', { filing_id: Number(req.params.id) })
  res.json(docs)
})

router.post('/verify-document', [auth, employeeOnly], async (req, res) => {
  const { document_id, action, comments } = req.body
  
  const status = action === 'APPROVED' ? 'verified' : 'rejected'
  await query.update('documents', document_id, {
    verification_status: status,
    verified_by: req.user.id,
    verified_at: new Date().toISOString(),
    verification_comments: comments
  })

  // If rejected, we might want to update the filing status too
  if (action === 'REJECTED') {
    const doc = await query.findOne('documents', { id: Number(document_id) })
    if (doc) {
      await query.update('filings', doc.filing_id, { status: 'EMPLOYEE_REVIEWING' })
    }
  }

  res.json({ success: true, status })
})

router.post('/approve-filing', [auth, employeeOnly], async (req, res) => {
  const { filing_id } = req.body
  const updated = await query.update('filings', filing_id, {
    status: 'EMPLOYEE_VERIFIED',
    verified_at: new Date().toISOString(),
    verified_by: req.user.id
  })
  res.json({ success: true, filing: updated })
})

module.exports = router

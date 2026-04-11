const express = require('express')
const { query } = require('../db/database')
const { auth } = require('../middleware/auth')
const router = express.Router()

router.get('/', auth, async (req, res) => {
  const filings = (await query.findAll('filings', { user_id: req.user.id })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  res.json(filings)
})

router.post('/', auth, async (req, res) => {
  const { itr_form_type, income_json, deductions_json, calculated_tax, tax_paid, refund_amount } = req.body
  const filing = await query.insert('filings', {
    user_id: req.user.id, itr_form_type: itr_form_type || 'ITR-1',
    financial_year: 'AY 2025-26', status: 'draft',
    income_json: income_json || {}, deductions_json: deductions_json || {},
    calculated_tax: calculated_tax || 0, tax_paid: tax_paid || 0, refund_amount: refund_amount || 0,
  })
  res.status(201).json(filing)
})

router.put('/:id/submit', auth, async (req, res) => {
  const ackNo = 'AP' + Date.now()
  const filing = await query.update('filings', req.params.id, { status: 'submitted', acknowledgment_number: ackNo, submitted_date: new Date().toISOString() })
  if (!filing) return res.status(404).json({ message: 'Filing not found' })
  res.json({ filing, acknowledgment_number: ackNo })
})

router.get('/:id', auth, async (req, res) => {
  const filing = await query.findOne('filings', { id: Number(req.params.id) }) 
  // Note: Firestore might store ID as string if migrated from JSON, but logic uses integers. 
  // My update() helper uses toString() for the doc ID.
  // The query helper handles the object filter.
  if (!filing || filing.user_id != req.user.id) return res.status(404).json({ message: 'Filing not found' })
  res.json(filing)
})

module.exports = router

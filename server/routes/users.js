const express = require('express')
const { query } = require('../db/database')
const { auth } = require('../middleware/auth')
const router = express.Router()

router.get('/me', auth, async (req, res) => {
  const user = await query.findOne('users', { id: req.user.id })
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json(query.safeUser(user))
})

router.put('/me', auth, async (req, res) => {
  const { name, phone } = req.body
  const user = await query.update('users', req.user.id, { name, phone })
  res.json(query.safeUser(user))
})

router.get('/me/stats', auth, async (req, res) => {
  const filings = await query.findAll('filings', { user_id: req.user.id })
  const totalRefund = filings.filter(f => f.status === 'filed').reduce((s, f) => s + (f.refund_amount || 0), 0)
  const docs = await query.findAll('documents', { user_id: req.user.id })
  res.json({ total_filings: filings.length, total_refund: totalRefund, total_documents: docs.length })
})

module.exports = router

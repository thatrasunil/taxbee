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

module.exports = router

const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { query } = require('../db/database')

const router = express.Router()
const SECRET = process.env.JWT_SECRET || 'taxbee-super-secret-key-2026'

router.post('/register', async (req, res) => {
  try {
    const { name, email, pan, phone, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' })
    
    // Updated findOne to handle async and simpler object filter
    const existing = await query.findOne('users', { email })
    if (existing) return res.status(409).json({ message: 'Email already registered. Please sign in.' })

    const hash = await bcrypt.hash(password, 10)
    const user = await query.insert('users', { name, email, password: hash, phone: phone || '', pan: pan?.toUpperCase() || '', role: 'user', subscription_tier: 'basic', kyc_verified: false })
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: query.safeUser(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
    
    const user = await query.findOne('users', { email })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })
    
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' })
    
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' })
    res.json({ token, user: query.safeUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Login failed' })
  }
})

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], SECRET)
    const user = await query.findOne('users', { id: decoded.id })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(query.safeUser(user))
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
})

module.exports = router

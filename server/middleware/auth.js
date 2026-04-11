const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'taxbee-super-secret-key-2026'

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

function adminOnly(req, res, next) {
  auth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
    next()
  })
}

function employeeOrAdmin(req, res, next) {
  auth(req, res, () => {
    if (!['admin', 'employee'].includes(req.user.role))
      return res.status(403).json({ message: 'Employee access required' })
    next()
  })
}

module.exports = { auth, adminOnly, employeeOrAdmin }

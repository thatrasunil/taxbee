const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Initialize Firebase Admin with credentials from .env
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  })
}

const { initDB } = require('./db/database')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const filingRoutes = require('./routes/filings')
const documentRoutes = require('./routes/documents')
const adminRoutes = require('./routes/admin')
const employeeRoutes = require('./routes/employee')
const aiRoutes = require('./routes/ai')

const app = express()

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Initialize DB
initDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/filings', filingRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/employee', employeeRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tax Bee API is running on Firebase Functions', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Internal server error' })
})

// Export for Cloud Functions
exports.api = functions.https.onRequest(app)

// Local development listener
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001
    app.listen(PORT, () => {
        console.log(`\n🐝 Tax Bee API running on http://localhost:${PORT}`)
        console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`)
    })
}

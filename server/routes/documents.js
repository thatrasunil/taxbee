const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { query } = require('../db/database')
const { auth } = require('../middleware/auth')
const router = express.Router()

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`),
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (['.jpg', '.jpeg', '.png', '.pdf'].includes(ext)) cb(null, true)
    else cb(new Error('Only JPG, PNG, PDF files allowed'))
  },
})

router.get('/', auth, async (req, res) => {
  const docs = await query.findAll('documents', { user_id: req.user.id })
  res.json(docs)
})

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  const doc = await query.insert('documents', {
    user_id: req.user.id,
    document_type: req.body.document_type || 'other',
    file_name: req.file.originalname,
    file_path: req.file.path,
    file_size: req.file.size,
    verification_status: 'pending',
  })
  res.status(201).json({ message: 'Uploaded', document: doc })
})

router.delete('/:id', auth, async (req, res) => {
  const doc = await query.findOne('documents', { id: Number(req.params.id) })
  if (!doc || doc.user_id != req.user.id) return res.status(404).json({ message: 'Not found' })
  if (fs.existsSync(doc.file_path)) fs.unlinkSync(doc.file_path)
  await query.delete('documents', req.params.id)
  res.json({ message: 'Deleted' })
})

module.exports = router

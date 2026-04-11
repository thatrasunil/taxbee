const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const serviceAccount = require('../config/serviceAccountKey.json')

// Init Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

const db = admin.firestore()

// For backward compatibility and one-time migration
const DB_FILE = path.join(__dirname, '..', 'db.json')

/**
 * Migration helper: Pushes db.json data to Firestore if Firestore is empty.
 */
async function initDB() {
  const usersSnap = await db.collection('users').limit(1).get()
  
  if (usersSnap.empty && fs.existsSync(DB_FILE)) {
    console.log('🚀 Starting one-time migration from db.json to Firestore...')
    try {
      const localData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
      
      // Migrate counters
      if (localData._counters) {
        await db.collection('_metadata').doc('counters').set(localData._counters)
      }

      // Migrate tables
      for (const table of ['users', 'filings', 'documents', 'payments', 'tickets']) {
        if (localData[table]) {
          console.log(`  📦 Migrating ${table}...`)
          const batch = db.batch()
          localData[table].forEach(item => {
            const ref = db.collection(table).doc(item.id.toString())
            batch.set(ref, item)
          })
          await batch.commit()
        }
      }
      console.log('✅ Migration complete!')
    } catch (err) {
      console.error('❌ Migration failed:', err)
    }
  } else if (usersSnap.empty) {
     // Seed demo if no local file either
     console.log('🌱 Seeding demo data to Firestore...')
     const hash = (pw) => bcrypt.hashSync(pw, 10)
     const users = [
       { id: 1, name: 'Rahul Demo User', email: 'user@taxbee.in', password: hash('password123'), phone: '9876543210', pan: 'ABCDE1234F', role: 'user', subscription_tier: 'professional', kyc_verified: true, created_at: new Date().toISOString() },
       { id: 2, name: 'Admin Manager', email: 'admin@taxbee.in', password: hash('admin123'), phone: '9123456789', pan: 'ADMIN1234G', role: 'admin', subscription_tier: 'premium', kyc_verified: true, created_at: new Date().toISOString() },
       { id: 3, name: 'Emp Verifier', email: 'emp@taxbee.in', password: hash('emp123'), phone: '9234567890', pan: 'EMPLO5678H', role: 'employee', subscription_tier: 'basic', kyc_verified: true, created_at: new Date().toISOString() },
     ]
     for (const u of users) {
       await db.collection('users').doc(u.id.toString()).set(u)
     }
     await db.collection('_metadata').doc('counters').set({ users: 3, filings: 0, documents: 0, payments: 0, tickets: 0 })
     console.log('✅ Demo data seeded to Firestore')
  }
  
  console.log('🐝 Connected to Cloud Firestore (taxbee-7ce92)')
}

async function nextId(table) {
  const ref = db.collection('_metadata').doc('counters')
  return await db.runTransaction(async (t) => {
    const doc = await t.get(ref)
    const counters = doc.exists ? doc.data() : {}
    const newId = (counters[table] || 0) + 1
    t.set(ref, { ...counters, [table]: newId }, { merge: true })
    return newId
  })
}

const query = {
  findOne: async (table, filterFnOrObj) => {
    // If it's a simple key-value search (like email)
    if (typeof filterFnOrObj === 'object') {
      const key = Object.keys(filterFnOrObj)[0]
      const val = filterFnOrObj[key]
      const snap = await db.collection(table).where(key, '==', val).limit(1).get()
      return snap.empty ? null : snap.docs[0].data()
    }
    
    // Fallback: If it's a predicate function, we have to fetch all (inefficient for large DB, but works for migration)
    const snap = await db.collection(table).get()
    const all = snap.docs.map(d => d.data())
    return all.find(filterFnOrObj)
  },

  findAll: async (table, filterFnOrObj) => {
    if (typeof filterFnOrObj === 'object') {
       const key = Object.keys(filterFnOrObj)[0]
       const val = filterFnOrObj[key]
       const snap = await db.collection(table).where(key, '==', val).get()
       return snap.docs.map(d => d.data())
    }
    const snap = await db.collection(table).get()
    const all = snap.docs.map(d => d.data())
    return filterFnOrObj ? all.filter(filterFnOrObj) : all
  },

  insert: async (table, data) => {
    const id = await nextId(table)
    const row = { id, created_at: new Date().toISOString(), ...data }
    await db.collection(table).doc(id.toString()).set(row)
    return row
  },

  update: async (table, id, updates) => {
    const ref = db.collection(table).doc(id.toString())
    await ref.set({ ...updates, updated_at: new Date().toISOString() }, { merge: true })
    const snap = await ref.get()
    return snap.data()
  },

  delete: async (table, id) => {
    await db.collection(table).doc(id.toString()).delete()
    return true
  },

  safeUser: (user) => {
    if (!user) return null
    const { password, ...safe } = user
    return safe
  }
}

module.exports = { initDB, query }

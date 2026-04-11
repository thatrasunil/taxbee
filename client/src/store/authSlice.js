import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const stored = JSON.parse(localStorage.getItem('taxbee_user') || 'null')

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const { name, email, pan, phone, password } = data
    // 1. Create Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user
    
    // 2. Create User Profile in Firestore
    const userProfile = {
      id: firebaseUser.uid,
      name,
      email,
      phone: phone || '',
      pan: pan?.toUpperCase() || '',
      role: 'user',
      subscription_tier: 'basic',
      kyc_verified: false,
      created_at: new Date().toISOString()
    }
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile)
    
    // 3. Return user and token for state
    const token = await firebaseUser.getIdToken()
    return { user: userProfile, token }
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      return rejectWithValue('Email already registered. Please sign in.')
    }
    return rejectWithValue(err.message || 'Registration failed')
  }
})

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const { email, password } = data
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user
    
    // Fetch profile from Firestore
    const docRef = doc(db, 'users', firebaseUser.uid)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
       return rejectWithValue('User profile not found')
    }
    
    const token = await firebaseUser.getIdToken()
    return { user: docSnap.data(), token }
  } catch (err) {
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      return rejectWithValue('Invalid email or password')
    }
    return rejectWithValue(err.message || 'Login failed')
  }
})
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored?.user || null,
    token: stored?.token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('taxbee_user')
      // Also sign out from Firebase Auth
      import('../firebase').then(({ auth }) => {
        import('firebase/auth').then(({ signOut }) => signOut(auth))
      })
    },
    clearError(state) { state.error = null },
  },
  extraReducers: builder => {
    const pending = state => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }
    builder
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.rejected, rejected)
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        localStorage.setItem('taxbee_user', JSON.stringify(payload))
      })
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.rejected, rejected)
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        localStorage.setItem('taxbee_user', JSON.stringify(payload))
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

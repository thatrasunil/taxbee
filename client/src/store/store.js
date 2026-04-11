import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import filingReducer from './filingSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filing: filingReducer,
    ui: uiReducer,
  },
})

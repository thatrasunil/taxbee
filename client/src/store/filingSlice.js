import { createSlice } from '@reduxjs/toolkit'

const initialFormData = {
  // Step 1: Personal Info
  firstName: '', lastName: '', dob: '', gender: '', pan: '', aadhaar: '',
  phone: '', address: '', city: '', state: '', pincode: '',
  // Step 2: Income
  itrType: 'ITR-1', employmentType: 'salaried',
  grossSalary: '', hra: '', lta: '', otherAllowances: '',
  bankInterest: '', rentalIncome: '', otherIncome: '',
  // Step 3: Deductions
  sec80C: '', sec80D: '', sec80G: '', sec80E: '',
  homeLoanInterest: '', nps80CCD: '',
  // Step 4: computed
  totalIncome: 0, totalDeductions: 0, taxableIncome: 0, taxLiability: 0, taxPaid: 0, refund: 0,
}

const filingSlice = createSlice({
  name: 'filing',
  initialState: {
    step: 1,
    formData: initialFormData,
    filings: [],
    currentFiling: null,
    loading: false,
  },
  reducers: {
    setStep(state, { payload }) { state.step = payload },
    nextStep(state) { if (state.step < 5) state.step++ },
    prevStep(state) { if (state.step > 1) state.step-- },
    updateFormData(state, { payload }) {
      state.formData = { ...state.formData, ...payload }
    },
    computeTax(state) {
      const d = state.formData
      const gross = Number(d.grossSalary) || 0
      const bankInt = Number(d.bankInterest) || 0
      const rental = Number(d.rentalIncome) || 0
      const other = Number(d.otherIncome) || 0
      const totalIncome = gross + bankInt + rental + other

      const c80 = Math.min(Number(d.sec80C) || 0, 150000)
      const d80 = Math.min(Number(d.sec80D) || 0, 25000)
      const g80 = Number(d.sec80G) || 0
      const e80 = Number(d.sec80E) || 0
      const home = Number(d.homeLoanInterest) || 0
      const nps = Math.min(Number(d.nps80CCD) || 0, 50000)
      const ded = c80 + d80 + g80 + e80 + home + nps
      const stdDed = 50000
      const taxable = Math.max(0, totalIncome - ded - stdDed)

      let tax = 0
      if (taxable > 1500000) tax = 112500 + (taxable - 1500000) * 0.30
      else if (taxable > 1200000) tax = 82500 + (taxable - 1200000) * 0.25
      else if (taxable > 900000) tax = 60000 + (taxable - 900000) * 0.20
      else if (taxable > 600000) tax = 37500 + (taxable - 600000) * 0.15
      else if (taxable > 300000) tax = 7500 + (taxable - 300000) * 0.05
      tax = Math.round(tax + tax * 0.04)

      state.formData.totalIncome = totalIncome
      state.formData.totalDeductions = ded
      state.formData.taxableIncome = taxable
      state.formData.taxLiability = tax
      state.formData.refund = Math.max(0, (Number(d.taxPaid) || 0) - tax)
    },
    resetFiling(state) { state.step = 1; state.formData = initialFormData },
    setFilings(state, { payload }) { state.filings = payload },
  },
})

export const { setStep, nextStep, prevStep, updateFormData, computeTax, resetFiling, setFilings } = filingSlice.actions
export default filingSlice.reducer

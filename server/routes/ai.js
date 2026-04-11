const express = require('express')
const Groq = require('groq-sdk')
const { auth } = require('../middleware/auth')
const router = express.Router()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const SYSTEM_PROMPT = `
You are "TaxBee Assistant", a world-class AI Tax Expert for the Tax Bee platform (taxbee.in).
Your goal is to help users file their Income Tax Returns (ITR) in India accurately and stress-free.

GUIDELINES:
1. Provide accurate information about Indian Tax Laws (ITR-1 to 4, Section 80C, 80D, HRA, etc.).
2. Be friendly, professional, and encouraging. Use "Bee" related metaphors occasionally (e.g., "Helping your savings honeycomb grow").
3. If a user is confused, guide them to the Tax Bee "Filing Wizard" or "Support Hive".
4. Do not provide high-risk financial advice; always suggest consulting a chartered accountant for complex matters.
5. Keep responses concise and use markdown formatting for clarity.
6. The Tax Bee platform charges ₹499 for basic filing and ₹899 for professional.

CONTEXT:
Tax Bee uses AI to optimize deductions. We provide 24/7 Hindi/English support. Our primary colors are Bee Yellow and Fresh Green.
`

router.post('/chat', auth, async (req, res) => {
  try {
    const { messages } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile', // Groq's fast versatile model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false, // For easier initial integration
    })

    res.json({ 
      content: completion.choices[0].message.content,
      role: 'assistant'
    })
  } catch (err) {
    console.error('Groq Error:', err)
    res.status(500).json({ message: 'AI Assistant is temporarily unavailable. The Hive is busy!' })
  }
})

module.exports = router

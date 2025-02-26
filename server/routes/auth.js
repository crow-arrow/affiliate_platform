import express from "express"
import { signUp, login, getMe } from '../controllers/auth.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = express.Router()

//Register
// http://localhost:3002/api/auth/signup
router.post('/signup', signUp)

// Login
// http://localhost:3002/api/auth/login
router.post('/login', login)

// Get Me
// http://localhost:3002/api/auth/me
router.get('/me', checkAuth, getMe)

export default router


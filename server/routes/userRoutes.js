import { Router } from 'express'
import { getAllUsers } from '../controllers/getUsers.js'
import { getUserById } from '../controllers/getUserById.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = new Router()

router.get('/users', getAllUsers) // ✅ Все пользователи
router.get('/users/:id', checkAuth, getUserById) // ✅ Один пользователь

export default router
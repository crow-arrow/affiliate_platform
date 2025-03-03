import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register User
export const signUp = async (req, res) => {
    try {
        const { email, phone, first_name, last_name, password } = req.body

        const isUsed = await User.findOne({ where: { email } })

        if (isUsed) {
            return res.status(409).json({ message: 'Email already exists' })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = await User.create({
            email,
            phone,
            first_name,
            last_name,
            password: hash,
            role: 'Genie',
        })

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(201).json({ user: { id: newUser.id, email: newUser.email }, token, message: 'Account successfully created' })
    } catch (error) {
        res.status(500).json({ message: 'User creation error' })
    }
}

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(404).json({ message: 'User does not exist' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(201).json({ token, user, message: 'You are in' })
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: 'Login failed. Please try again' })
    }
}

// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId)

        if (!user) {
            return res.status(404).json({ message: 'User does not exist' })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.json({ token, user })
    } catch (error) {
        console.error(error)
        res.status(403).json({ message: 'Access denied' })
    }
}
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Register user
export const signUp = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body

        const isUsed = await User.findOne({ email })

        if(isUsed) {
            return res.status(409).json({
                message: 'Email already exists',
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            email,
            firstName,
            lastName,
            password: hash,
        })

        await newUser.save()

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )
        
        res.status(201).json({
            user: {
                id: newUser._id,
                email: newUser.email,
            },
            token,
            message: 'Account successfully created',
        })
    } catch (error) {
        console.error('Error during user creation:', error); // Логирование ошибки для отладки
        res.status(500).json({ message: 'User  creation error' })
    }
}

// Login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({
                message: 'User  does not exist',
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            token,
            user,
            message: 'You are in',
        })
    } catch (error) {
        console.error(error); // Логирование ошибки для отладки
        res.status(400).json({
            message: 'Please fill out all the fields',
        })
    }
}

// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'User  does not exist',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            token,
            user,
        })
    } catch (error) {
        console.error(error); // Логирование ошибки для отладки
        res.status(403).json({
            message: 'Access denied',
        })
    }
}
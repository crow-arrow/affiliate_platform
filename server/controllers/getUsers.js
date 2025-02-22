import User from '../models/User.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password') // Загружаем всех без паролей

        if (!users.length) {
            return res.status(404).json({ message: 'Users not' })
        }

        res.json(users)
    } catch (error) {
        console.error('Error users loading:', error)
        res.status(500).json({ message: 'Error users loading' })
    }
}
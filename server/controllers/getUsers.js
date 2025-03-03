import User from '../models/User.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        })

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'Users not found' })
        }

        res.json(users);
    } catch (error) {
        console.error('Error users loading:', error)
        res.status(500).json({ message: 'Error users loading' })
    }
}
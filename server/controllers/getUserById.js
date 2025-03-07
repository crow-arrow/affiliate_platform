import User from '../models/User.js'

export const getUserById = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10)

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid ID format' })
        }

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Проверяем доступ: либо сам пользователь, либо админ
        if (req.userId !== user.id && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied' })
        }

        res.json(user)
    } catch (error) {
        console.error('Error loading user:', error)
        res.status(500).json({ message: 'Error loading data' })
    }
}
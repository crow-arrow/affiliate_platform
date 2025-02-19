import User from '../models/User.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password') // Загружаем всех без паролей

        if (!users.length) {
            return res.status(404).json({ message: 'Пользователи не найдены' })
        }

        res.json(users)
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error)
        res.status(500).json({ message: 'Ошибка загрузки пользователей' })
    }
}
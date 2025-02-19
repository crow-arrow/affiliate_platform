import User from '../models/User.js'

export const getUserById = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Некорректный формат ID' })
        }

        const user = await User.findById(req.params.id).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' })
        }

        // Проверяем доступ: либо сам пользователь, либо админ
        if (req.userId !== user._id.toString() && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Доступ запрещён' })
        }

        res.json(user)
    } catch (error) {
        console.error('Ошибка получения пользователя:', error)
        res.status(500).json({ message: 'Ошибка загрузки данных' })
    }
}
import jwt from 'jsonwebtoken';
const { verify } = jwt;

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    console.log('Incoming request to /auth/me')
    console.log('Authorization header:', req.headers.authorization)

    if (token) {
        try {
            const decoded = verify(token, process.env.JWT_SECRET)

            req.userId = decoded.id
            console.log('Middleware is active')
            return next()
        } catch (error) {
            return res.status(401).json({
                message: 'No access'
            })
        }
    }
    else {
        return res.status(401).json({
            message: 'No access'
        })
    }
}
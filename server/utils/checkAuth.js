import jwt from 'jsonwebtoken';
const { verify } = jwt;

export const checkAuth = (req, res, next) => {
    const token = (req.header.authorisation || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = verify(token, process.env.JWT_SECRET)

            req.userId = decoded.id
        } catch (error) {
            return res.json({
                massage: 'No access'
            })
        }
    }
    else {
        return res.json({
            massage: 'No access'
        })
    }
}
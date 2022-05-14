import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const jwtSign = (payload, options) => jwt.sign(payload, JWT_SECRET, { expiresIn: options?.expiresIn || '1d' })

export const jwtValidate = token => jwt.verify(token, JWT_SECRET)

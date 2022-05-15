import { jwtSign } from '../lib/jwt.js'

const generateConfirmationToken = user => (
  jwtSign({ sub: user._id, email: user.email }, { expiresIn: '5m' })
)

export default generateConfirmationToken

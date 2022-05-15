import User from '../entities/User.js'
import ServerError from '../errors/ServerError.js'
import { jwtValidate } from '../lib/jwt.js'

const confirm = async ctx => {
  const { token } = ctx.query

  try {
    const decoded = jwtValidate(token)
    const user = await User.findOne({ email: decoded.email })
    user.confirmed = true
    await user.save()
    ctx.status = 200
  } catch (e) {
    throw new ServerError(401)
  }
}

export default confirm

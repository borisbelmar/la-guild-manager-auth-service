import bcrypt from 'bcryptjs'
import User from '../entities/User.js'
import ServerError from '../errors/ServerError.js'
import { jwtSign } from '../lib/jwt.js'
import generateConfirmationToken from '../utils/generateConfirmationToken.js'
import { loginSchema } from '../validators/userSchemas.js'

const login = async ctx => {
  const payload = ctx.request.body

  try {
    await loginSchema.validateAsync(payload)
  } catch (e) {
    throw new ServerError(401)
  }

  const user = await User.findOne({ email: payload.email })

  if (!user) {
    throw new ServerError(401)
  }

  if (!bcrypt.compareSync(payload.password, user.password)) {
    throw new ServerError(401)
  }

  if (!user.confirmed) {
    ctx.body = {
      confirmToken: generateConfirmationToken(user)
    }
    ctx.status = 200
    return
  }

  const accessToken = jwtSign({
    sub: user._id,
    scopes: user.scopes
  })

  ctx.body = {
    accessToken
  }
  ctx.status = 200
}

export default login

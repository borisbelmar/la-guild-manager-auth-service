import bcrypt from 'bcryptjs'
import User from '../entities/User.js'
import ServerError from '../errors/ServerError.js'
import getEmailService from '../services/email.js'
import generateConfirmationToken from '../utils/generateConfirmationToken.js'
import { registerSchema } from '../validators/userSchemas.js'

const register = async ctx => {
  const payload = ctx.request.body

  if (payload?.scopes) {
    throw new ServerError(403, 'Set scopes is not allowed')
  }

  try {
    await registerSchema.validateAsync(payload)
  } catch (e) {
    throw new ServerError(400, e.message)
  }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(payload.password, salt)

  const user = new User({ ...payload, password: hash })

  try {
    const createdUser = await user.save()
    const token = generateConfirmationToken(createdUser)
    await getEmailService()
      .sendConfirmationEmail(createdUser.email, token)
    ctx.status = 201
  } catch (e) {
    if (e.code === 11000) {
      throw new ServerError(409)
    }
    throw new ServerError(500)
  }
}

export default register

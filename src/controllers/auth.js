import bcrypt from 'bcryptjs'
import User from '../entities/User.js'
import { jwtSign, jwtValidate } from '../lib/jwt.js'
import ServerError from '../errors/ServerError.js'
import { loginSchema, registerSchema } from '../validators/userSchemas.js'
import getEmailService from '../services/email.js'

const generateConfirmToken = user => (
  jwtSign({ sub: user._id, email: user.email }, { expiresIn: '5m' })
)

const getAuthControllers = () => {
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
      const token = generateConfirmToken(createdUser)
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
        confirmToken: generateConfirmToken(user)
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

  const verifyToken = async ctx => {
    const { token } = ctx.query

    try {
      ctx.body = jwtValidate(token)
      ctx.status = 200
    } catch (e) {
      throw new ServerError(401)
    }
  }

  return {
    register,
    login,
    confirm,
    verifyToken
  }
}

export default getAuthControllers

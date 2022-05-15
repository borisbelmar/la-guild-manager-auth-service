import ServerError from '../errors/ServerError.js'
import { jwtValidate } from '../lib/jwt.js'

const verifyToken = async ctx => {
  const { token } = ctx.query

  try {
    ctx.body = jwtValidate(token)
    ctx.status = 200
  } catch (e) {
    throw new ServerError(401)
  }
}

export default verifyToken

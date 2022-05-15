import Router from '@koa/router'
import {
  confirm,
  login,
  register,
  verifyToken
} from '../controllers/index.js'

const authRouter = new Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/confirm', confirm)
authRouter.get('/verify', verifyToken)

export default authRouter

import Router from '@koa/router'
import getAuthControllers from '../controllers/auth.js'

const authRouter = new Router()
const controllers = getAuthControllers()

authRouter.post('/register', controllers.register)
authRouter.post('/login', controllers.login)
authRouter.post('/confirm', controllers.confirm)
authRouter.get('/verify', controllers.verifyToken)

export default authRouter

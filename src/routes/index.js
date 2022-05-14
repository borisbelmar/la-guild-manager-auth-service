import Router from '@koa/router'
import authRouter from './auth.js'

const BASE_ROUTE = '/api'

const router = new Router()

router.use(`${BASE_ROUTE}/v1/auth`, authRouter.routes())

router.get('/', ctx => {
  ctx.body = {
    app: process.env.npm_package_name,
    version: process.env.npm_package_version
  }
})

export default router

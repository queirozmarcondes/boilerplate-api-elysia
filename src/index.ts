import { Elysia, t } from 'elysia'

import { user } from './modules/user/routes/user.routes'
import { swaggerPlugin } from './plugins/swagger.pluggin';

 new Elysia()
  .use(swaggerPlugin())
  .use(user)
  .listen(3000)

console.log(`🦊 Elysia is running at http://localhost:3000`);
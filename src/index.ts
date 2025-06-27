import { Elysia, t } from 'elysia'

import { user } from './modules/user/routes/user.routes'
import { swaggerPlugin } from './plugins/swagger.pluggin';

 new Elysia()
  .use(swaggerPlugin())
   .get(
    '/status',
    () => ({
      status: '🟢 Online',
      timestamp: new Date().toISOString(),
    }),
    {
      detail: {
        summary: 'Server status check',
        description: 'Returns current status and server timestamp.',
        tags: ['Status'],
      },
      response: t.Object({
        status: t.String(),
        timestamp: t.String({ format: 'date-time' }),
      }),
    }
  )
  .use(user)
  .listen(3000)

console.log(`🦊 Elysia is running at http://localhost:3000`);
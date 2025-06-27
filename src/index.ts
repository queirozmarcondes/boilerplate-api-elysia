import { Elysia, t } from 'elysia'

import { note } from './routes/note.routes'
import { user } from './routes/user.routes'
import { swaggerPlugin } from './plugins/swagger.pluggin';

 new Elysia()
  .use(swaggerPlugin())
  .use(note)
  .use(user)
  .listen(3000)

console.log(`🦊 Elysia is running at http://localhost:3000`);
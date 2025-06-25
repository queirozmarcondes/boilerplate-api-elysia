import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { note } from './routes/note.routes'
import { user } from './routes/user.routes'

 new Elysia()
  .use(swagger())
  .use(note)
  .use(user)
  .listen(3000)

console.log(`🦊 Elysia is running at http://localhost:3000`);
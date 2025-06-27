// src/modules/auth/services/auth.service.ts
import { Elysia, t } from 'elysia'
import { userService } from '../../user/services/user.service'

export const authService = new Elysia({ name: 'auth/service' })
  .use(userService) // compartilha estado de usuário
  .model({
    signUp: t.Object({
      username: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 })
    }),
    signIn: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 })
    }),
    session: t.Cookie(
      {
        token: t.String()
      },
      {
        secrets: Bun.env.JWT_SECRET || 'default-secret',
        httpOnly: true,
        path: '/'
      }
    )
  })

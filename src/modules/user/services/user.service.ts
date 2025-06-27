// src/modules/user/services/user.service.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
  .state({
    user: {} as Record<string, { email: string; password: string }>
  })
  .model({
    updateUser: t.Object({
      email: t.Optional(t.String({ format: 'email' })),
      password: t.Optional(t.String({ minLength: 8 }))
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
    ),
    optionalSession: t.Cookie(
      {
        token: t.Optional(t.String())
      },
      {
        secrets: Bun.env.JWT_SECRET || 'default-secret',
        httpOnly: true,
        path: '/'
      }
    )
  })

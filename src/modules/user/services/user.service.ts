// src/services/user.service.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
  .state({
    user: {} as Record<string, { email: string, password: string }>,
    session: {} as Record<number, string>,
  })
  .model({
    signUp: t.Object({
      username: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
    }),
    signIn: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
    }),
    updateUser: t.Object({
      email: t.Optional(t.String({ format: 'email' })),
      password: t.Optional(t.String({ minLength: 8 })),
    }),
    session: t.Cookie({
      token: t.Number(),
    }, {
      secrets: 'seia'
    }),
    optionalSession: t.Cookie({
      token: t.Optional(t.Number())
    }, {
      secrets: 'seia'
    })
  })

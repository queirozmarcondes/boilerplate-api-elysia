// src/plugins/jwtGuard.ts
import { Elysia, t } from 'elysia'

export const jwtGuard = () =>
  (app: Elysia) =>
    app.guard(
      {
        cookie: t.Object({ token: t.String() }),
      },
      (group) =>
        group.onBeforeHandle(async (context) => {
          const { jwt, cookie: { token }, set } = context as typeof context & { jwt: { verify: (token: string) => Promise<any> }, user?: any }
          try {
            const payload = await jwt.verify(token.value)
            if (!payload) {
              set.status = 401
              throw new Error('Unauthorized')
            }
            (context as typeof context & { user?: any }).user = payload // opcional: disponibiliza payload no contexto
          } catch {
            set.status = 401
            throw new Error('Unauthorized')
          }
        })
    )

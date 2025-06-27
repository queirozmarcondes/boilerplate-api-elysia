import { Elysia, t } from 'elysia'
import { userService } from '../services/user.service'
import { jwtGuard } from '../../../middleware/auth/jwt.guard'
import { jwtPlugin } from '../../../plugins/jwt.pluggin'

export const user = new Elysia({ prefix: '/user' })

  .use(userService)
  .use(jwtPlugin())
  .use(jwtGuard())

// PATCH /update
.patch(
  '/update',
  async ({ body, cookie: { token }, store: { user }, jwt, set }) => {
    const payload = await jwt.verify(token.value)
    const username = payload && typeof payload === 'object' && 'username' in payload ? (payload as any).username : undefined

    if (!username || !user[username]) {
      set.status = 401
      return {
        success: false,
        message: 'Unauthorized',
      }
    }

    if (body.email) {
      user[username].email = body.email
    }

    if (body.password) {
      user[username].password = await Bun.password.hash(body.password)
    }

    return {
      success: true,
      message: 'User updated',
    }
  },
  {
    body: 'updateUser',
    cookie: 'session',
    detail: {
      title: 'Update User',
      tags: ['User'],
      summary: 'Update email or password',
      description: 'Allows authenticated users to update their email and/or password.',
    },
    response: t.Object({
      success: t.Boolean(),
      message: t.String(),
    }),
  }
)

// GET /profile
.get(
  '/profile',
  async ({ cookie: { token }, store: { user }, jwt, set }) => {
    const payload = await jwt.verify(token.value)
    const username = payload && typeof payload === 'object' && 'username' in payload ? (payload as any).username : undefined
    const account = username ? user[username] : undefined

    if (!username || !account) {
      set.status = 401
      return {
        success: false,
        username: '',
        email: '',
      }
    }

    return {
      success: true,
      username,
      email: account.email,
    }
  },
  {
    cookie: 'session',
    detail: {
      title: 'User Profile',
      tags: ['User'],
      summary: 'User profile',
      description: 'Returns the authenticated user based on session token.',
    },
    response: t.Object({
      success: t.Boolean(),
      username: t.String(),
      email: t.String(),
    }),
  }
)

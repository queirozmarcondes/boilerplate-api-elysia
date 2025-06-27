// src/routes/user.routes.ts
import { Elysia, t } from 'elysia'
import { userService } from '../../../services/user.service'

export const user = new Elysia({ prefix: '/user' })
  .use(userService)
  .put(
    '/sign-up',
    async ({ body: { username, password }, store }) => {
      if (store.user[username]) {
        return {
          success: false,
          message: 'User already exists',
        }
      }

      store.user[username] = await Bun.password.hash(password)

      return {
        success: true,
        message: 'User created',
      }
    },
    {
      body: 'signIn',
      detail: {
        title: 'User Registration',
        tags: ['User'],
        summary: 'User registration',
        description: 'Creates a new user with a username and password.'
      },
      response: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    }
  )
  .post(
    '/sign-in',
    async ({ store: { user, session }, body, cookie, status }) => {
      const { username, password } = body
      if (
        !user[username] ||
        !(await Bun.password.verify(password, user[username]))
      ) {
        return {
          success: false,
          message: 'Invalid username or password',
        }
      }

      const key = crypto.getRandomValues(new Uint32Array(1))[0]
      session[key] = username
      cookie.token.value = key

      return {
        success: true,
        message: `Signed in as ${username}`,
      }
    },
    {
      body: 'signIn',
      cookie: 'optionalSession',
      detail: {
        title: 'User Login',
        tags: ['User'],
        summary: 'User login',
        description: 'Validates user credentials and sets session token.'
      },
      response: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    }
  )
  .get(
    '/sign-out',
    ({ cookie: { token } }) => {
      token.remove()
      return {
        success: true,
        message: 'Signed out',
      }
    },
    {
      cookie: 'optionalSession',
      detail: {
        title: 'User Logout',
        tags: ['User'],
        summary: 'User logout',
        description: 'Removes the session token from cookies.'
      },
      response: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    }
  )
  .get(
    '/profile',
    ({ cookie: { token }, store: { session }, set }) => {
      const username = session[token.value]
      if (!username) {
        set.status = 401
        return {
          success: false,
          username: '',
        }
      }
      return {
        success: true,
        username,
      }
    },
    {
      cookie: 'session',
      detail: {
        title: 'User Profile',
        tags: ['User'],
        summary: 'User profile',
        description: 'Returns the authenticated user based on session token.'
      },
      response: t.Object({
        success: t.Boolean(),
        username: t.String()
      })
    }
  )

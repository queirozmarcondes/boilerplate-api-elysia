import { Elysia, t } from 'elysia'
import { userService } from '../../user/services/user.service'
import { jwtPlugin } from '../../../plugins/jwt.pluggin'

export const auth = new Elysia({ prefix: '/auth' })

  .use(jwtPlugin()) // Register JWT plugin for token handling
  .use(userService)

  // Registro - POST /sign-up
  .post(
    '/sign-up',
    async ({ body: { username, email, password }, store, set }) => {
      if (store.user[username]) {
        set.status = 400
        return {
          success: false,
          message: 'User already exists',
        }
      }

      store.user[username] = {
        email,
        password: await Bun.password.hash(password),
      }

      set.status = 201
      return {
        success: true,
        message: 'User created',
      }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 1 }),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
      }),
      detail: {
        title: 'User Registration',
        tags: ['Auth'],
        summary: 'User registration',
        description: 'Creates a new user with username, email and password.',
      },
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
    }
  )

  // Login - POST /sign-in
  .post(
    '/sign-in',
    async ({ store: { user }, body, jwt, set, cookie }) => {
      const { email, password } = body

      const entry = Object.entries(user).find(
        ([_, data]) => (data as { email: string }).email === email
      )
      if (!entry) {
        set.status = 401
        return {
          success: false,
          message: 'Invalid email or password',
          token: '',
        }
      }

      const [username, data] = entry
      const userData = data as { email: string; password: string }
      if (!(await Bun.password.verify(password, userData.password))) {
        set.status = 401
        return {
          success: false,
          message: 'Invalid email or password',
          token: '',
        }
      }

      // Gerar JWT com username no payload
      const token = await jwt.sign({ username })

      // Definir cookie HttpOnly com token JWT
      cookie.token.set({
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return {
        success: true,
        message: `Signed in as ${username}`,
        token,
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
      }),
      cookie: t.Optional(t.Object({})),
      detail: {
        title: 'User Login',
        tags: ['Auth'],
        summary: 'User login',
        description: 'Validates user credentials and returns JWT token.',
      },
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
        token: t.String(),
      }),
    }
  )

  // Logout - GET /sign-out
  .get(
    '/sign-out',
    ({ cookie, set }) => {
      cookie.token.set({
        value: '',
        httpOnly: true,
        path: '/',
        maxAge: 0,
      })

      return {
        success: true,
        message: 'Signed out',
      }
    },
    {
      cookie: t.Optional(t.Object({})),
      detail: {
        title: 'User Logout',
        tags: ['Auth'],
        summary: 'User logout',
        description: 'Removes the session token cookie to log the user out.',
      },
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
    }
  )

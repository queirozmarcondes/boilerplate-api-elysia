// src/routes/user.routes.ts
import { Elysia, t } from 'elysia'
import { userService } from '../services/user.service'

export const user = new Elysia({ prefix: '/user' })
  .use(userService)

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
    body: 'signUp',
    detail: {
      title: 'User Registration',
      tags: ['User'],
      summary: 'User registration',
      description: 'Creates a new user with username, email and password.',
    },
    response: t.Object({
      success: t.Boolean(),
      message: t.String(),
    }),
  }
)


.post(
  '/sign-in',
  async ({ store: { user, session }, body, cookie }) => {
    const { email, password } = body

    const entry = Object.entries(user).find(([_, data]) => data.email === email)
    if (!entry) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    const [username, data] = entry

    if (!(await Bun.password.verify(password, data.password))) {
      return {
        success: false,
        message: 'Invalid email or password',
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
      description: 'Validates user credentials and sets session token.',
    },
    response: t.Object({
      success: t.Boolean(),
      message: t.String(),
    }),
  }
)

.patch(
  '/update',
  async ({ body, cookie: { token }, store: { session, user }, set }) => {
    const username = session[token.value]

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

.get(
  '/profile',
  ({ cookie: { token }, store: { session, user }, set }) => {
    const username = session[token.value]
    const account = user[username]

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

.get(
  '/profile',
  ({ cookie: { token }, store: { session, user }, set }) => {
    const username = session[token.value]
    const account = user[username]

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


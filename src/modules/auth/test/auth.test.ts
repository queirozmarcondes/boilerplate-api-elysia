import { describe, it, expect } from 'bun:test'
import { auth } from '../routes/auth.routes'
import { userService } from '../../user/services/user.service'
import { jwtPlugin } from '../../../plugins/jwt.pluggin'
import { Elysia } from 'elysia'

const app = new Elysia()
  .use(jwtPlugin())
  .use(userService)
  .use(auth)

describe('Auth routes', () => {
  it('should register a new user', async () => {
    const res = await app.handle(new Request('http://localhost/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345678'
      })
    }))

    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.message).toBe('User created')
  })

  it('should reject duplicate user', async () => {
    const res = await app.handle(new Request('http://localhost/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345678'
      })
    }))

    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.message).toBe('User already exists')
  })
})

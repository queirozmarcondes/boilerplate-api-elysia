// test/user.test.ts
import { describe, it, expect, beforeAll } from 'bun:test'
import { Elysia } from 'elysia'
import { auth } from '../../auth/routes/auth.routes'
import { user } from '../routes/user.routes'

let token = ''

const app = new Elysia().use(auth).use(user)

beforeAll(async () => {
  // Cria usuário e login para obter JWT
  await app.handle(
    new Request('http://localhost/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      })
    })
  )

  const res = await app.handle(
    new Request('http://localhost/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123'
      })
    })
  )

  const json = await res.json()
  token = json.token
})

describe('User routes', () => {
  it('should return user profile with valid token', async () => {
    const res = await app.handle(
      new Request('http://localhost/user/profile', {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`
        }
      })
    )

    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.username).toBe('testuser')
    expect(body.email).toBe('testuser@example.com')
  })

  it('should update user data', async () => {
    const res = await app.handle(
      new Request('http://localhost/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${token}`
        },
        body: JSON.stringify({
          email: 'newemail@example.com'
        })
      })
    )

    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.message).toBe('User updated')

    // Verifica se o e-mail realmente foi alterado
    const profileRes = await app.handle(
      new Request('http://localhost/user/profile', {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`
        }
      })
    )
    const profile = await profileRes.json()
    expect(profile.email).toBe('newemail@example.com')
  })
})

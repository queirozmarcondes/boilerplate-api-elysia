import { jwt } from '@elysiajs/jwt'

export const jwtPlugin = () => 
  jwt({
    name: 'jwt',
    secret: Bun.env.JWT_SECRET || 'default-secret',
    exp: '7d',
  })

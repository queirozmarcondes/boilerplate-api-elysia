// src/plugins/swagger.ts
import { Elysia } from 'elysia'
import { swagger, type ElysiaSwaggerConfig } from '@elysiajs/swagger'

export const swaggerPlugin = (config?: Partial<ElysiaSwaggerConfig['documentation']>) =>
  swagger({
    path: '/swagger/docs/v1', // endpoint da UI (pode ser personalizado)
    documentation: {
      info: {
        title: 'Minha API Elysia',
        version: '1.0.0',
        description: 'Documentação auto-gerada com Elysia + Swagger'
      },
      tags: [
        { name: 'User', description: 'Autenticação de Usuários' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      ...config
    },
    excludeStaticFile: true,
    // swagger?: { ... } // você pode adicionar mais configurações se quiser
  })

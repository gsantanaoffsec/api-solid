import 'dotenv/config'
import { z } from 'zod'

// process.env: { NODE_ENV: 'dev', ...}

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

// A aplicação não executa caso dê algum problema nas variáveis ambientes

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data

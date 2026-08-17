import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  // representa a parte depois do "?" -> searchParams

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  // o teste será completamente transformado pelo lado do servidor
  transformMode: 'ssr',
  async setup() {
    // PRIMEIRO -> Criar o banco de testes
    // schema -> ambiente isolado onde eu posso ter tabelas que não serão influenciadas por outras tabelas
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    console.log(databaseUrl)

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // SEGUNDO -> Apagar o banco de testes
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}

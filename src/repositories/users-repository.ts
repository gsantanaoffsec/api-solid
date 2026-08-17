import { Prisma, User } from '@prisma/client'

// descrição de como o objeto deve ser

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>

  // O método recebe um objeto chamado data, contendo os dados pra criar o usuário
  // o formato exato vem de "schema.prisma"

  // Deve retornar uma promise contendo um usuário completo

  create(data: Prisma.UserCreateInput): Promise<User>
}

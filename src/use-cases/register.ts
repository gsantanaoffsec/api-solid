import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// Qual o tipo de resposta esse caso de uso vai ter

interface RegisterUseCaseResponse {
  user: User
}

// Cada classe do caso de uso, terá apenas um único método

// Ao invés da minha classe instanciar as dependências que
// ela precisa, ela vai receber as dependências como parâmetro,
// por isso nome: inversão de dependência

// Precisa saber quais métodos existem, e quais dados pode enviar e receber

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // Gera um hash a partir de uma senha e contiunua gerando hashes em cima do hash gerado

    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // O meu caso de uso depende do meu repositório do Prisma,
    // caso o repositório não exista o meu caso de uso para de funcionar

    // const prismaUsersRepository = new PrismaUsersRepository()

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}

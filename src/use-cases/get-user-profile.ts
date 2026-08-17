import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  // Pq utilizar esse caso de uso ?
  // Mais pra frente poderemos ter uma tela na aplicação,
  // que o usuário seleciona a sessão "Meu Perfil" e a ideia
  // nesta tela é que consigamos mostrar as informações principais do usuário

  // O ID nunca será alterado, ou seja, é a forma principal de identificar um usuário X ou Y

  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    // esse if(!user) só vai cair po alguém que estiver tentando advinhar o userId

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

// Factory Pattern -> função ou classe responsável por criar e configurar objetos com todas as suas dependências

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersRepository)

  return useCase
}

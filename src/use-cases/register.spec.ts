import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases//errors/user-already-exists-error'

// Teste Unitário -> testa uma unidade isolada do código, nunca toca
// em banco de dados ou em camadas externas da nossa aplicação

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoedoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John DoeDoe',
      email: 'johndoedoe@example.com',
      password: '123456',
    })

    const isPasswdCorrectlyHashed = await compare(
      // compara a senha com um hash já existente

      '123456',
      user.password_hash,
    )

    expect(isPasswdCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoedoe@example.com'

    await sut.execute({
      name: 'John DoeDoe',
      email,
      password: '123456',
    })

    // Sempre que utilizar o expect() e dentro dele tem uma Promise,
    // é preciso usar o "await"

    await expect(() =>
      sut.execute({
        name: 'John DoeDoe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})

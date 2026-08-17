import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '@/use-cases/create-gyms'

// Teste Unitário -> testa uma unidade isolada do código, nunca toca
// em banco de dados ou em camadas externas da nossa aplicação

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Js Gym',
      description: null,
      phone: null,
      latitude: -16.7473686,
      longitude: -49.2854204,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})

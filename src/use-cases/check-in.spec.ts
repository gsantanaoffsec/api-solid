import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from '@/use-cases/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'

// Teste Unitário -> testa uma unidade isolada do código, nunca toca
// em banco de dados ou em camadas externas da nossa aplicação

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Js Gym',
      description: '',
      phone: '',
      latitude: -16.7473686,
      longitude: -49.2854204,
    })
  })

  vi.useFakeTimers()

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.7473686,
      userLongitude: -49.2854204,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // Garante que os dois check-ins vão ser criados na mesma data
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.7473686,
      userLongitude: -49.2854204,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -16.7473686,
        userLongitude: -49.2854204,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    // Garante que os dois check-ins vão ser criados na mesma data
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.7473686,
      userLongitude: -49.2854204,
    })

    vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.7473686,
      userLongitude: -49.2854204,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Js Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-16.6589508),
      longitude: new Decimal(-49.2148589),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.7473686,
        userLongitude: -49.2854204,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

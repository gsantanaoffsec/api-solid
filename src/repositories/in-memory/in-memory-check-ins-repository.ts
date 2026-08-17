import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

// implements -> TypeScript obrigando a classe de ter todos os métodos que a interface define

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: string, data: Date) {
    const startOfTheDay = dayjs(data).startOf('date')
    const endOfTheDay = dayjs(data).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findManyByUserID(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      gym_id: data.gym_id,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    // findIndex -> retorno -1 caso não encontre o item solicitado

    if (checkInIndex >= 0) {
      // Acessa a lista no índice específico pra salvar o checkIn
      this.items[checkInIndex] = checkIn
      return checkIn
    } else {
      throw ResourceNotFoundError
    }
  }
}

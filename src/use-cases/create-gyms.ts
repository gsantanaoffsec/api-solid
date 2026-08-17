import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

// Qual o tipo de resposta esse caso de uso vai ter

interface CreateGymUseCaseResponse {
  gym: Gym
}

// Cada classe do caso de uso, terá apenas um único método

// Ao invés da minha classe instanciar as dependências que
// ela precisa, ela vai receber as dependências como parâmetro,
// por isso nome: inversão de dependência

// Precisa saber quais métodos existem, e quais dados pode enviar e receber

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}

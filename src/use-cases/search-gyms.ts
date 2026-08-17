import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsUseCaseRequest {
  // query -> utilizado para busca tanto no título quanto na descrição
  query: string
  page: number
}

// Qual o tipo de resposta esse caso de uso vai ter

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

// Cada classe do caso de uso, terá apenas um único método

// Ao invés da minha classe instanciar as dependências que
// ela precisa, ela vai receber as dependências como parâmetro,
// por isso nome: inversão de dependência

// Precisa saber quais métodos existem, e quais dados pode enviar e receber

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}

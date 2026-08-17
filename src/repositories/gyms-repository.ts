import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}

// No método 'findManyNearby' poderíamos passar a latitude e a longitude
// como parâmetros, mas assim 'findManyNearby(10909090, 0955588) ficara ruim
// de saber o que é a latitude e o que é a longitude

// Dessa nova forma fica muito mais intuitivo diferenciar as duas variáveis
//

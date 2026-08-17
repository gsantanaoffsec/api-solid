import { CheckIn, Prisma } from '@prisma/client'

// Prisma.CheckInCreateInput -> gerado automaticamente pelo Prisma, a partir do schema.prisma [ > npx prisma generate ]
// Prisma.<NomeDoModel>CreateInput -> convenção fixa seguida pelo Prisma

export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, data: Date): Promise<CheckIn | null>
  findManyByUserID(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
}

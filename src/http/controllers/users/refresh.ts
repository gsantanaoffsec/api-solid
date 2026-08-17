import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }) // valida que o usuário está autenticad o, mas não olha pro cabeçalho da requisição

  const { role } = request.user

  const token = await reply.jwtSign(
    {
      role, // payload
    },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // o cookie será encriptado em HTTPs
      sameSite: true, // acessível apenas dentro do mesmo site
      httpOnly: true, // será acessado apenas pelo back-end e não pelo front-end
    })
    .status(200)
    .send({
      token,
    })
}

import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const router = Router()

router.post("/", async (req, res) => {
  console.log('--- [LOGIN] Requisição recebida no /login:', req.body)
  const { email, senha } = req.body

  const mensaPadrao = "Login ou senha incorretos"

  if (!email || !senha) {
    console.log('--- [LOGIN] Faltando email ou senha:', { email, senha })
    res.status(400).json({ erro: mensaPadrao })
    return
  }

  try {
    const usuario = await prisma.admin.findFirst({
      where: { email }
    })
    console.log('--- [LOGIN] Usuário encontrado:', usuario)

    if (usuario == null) {
      console.log('--- [LOGIN] Usuário não encontrado para email:', email)
      console.log('--- [LOGIN] Erro: ', mensaPadrao)
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
    console.log('--- [LOGIN] Senha correta?', senhaCorreta)

    if (senhaCorreta) {
      const token = jwt.sign({
        userLogadoId: usuario.id,
        userLogadoNome: usuario.nome
      }, process.env.JWT_SECRET || 'segredo', { expiresIn: '1h' })
      console.log('--- [LOGIN] Login realizado com sucesso! Token gerado:', token)
      console.log('--- [LOGIN] Resposta enviada ao front-end:', { token, usuario })
      res.status(200).json({ token, usuario })
      return
    } else {
      const descricao = "Tentativa de acesso ao sistema"
      const complemento = "Usuário: " + usuario.id + " - " + usuario.nome

      const log = await prisma.log.create({
        data: { descricao, complemento, usuarioId: usuario.id }
      })
      console.log('--- [LOGIN] Erro: ', mensaPadrao)
      res.status(400).json({ erro: mensaPadrao })
    }
  } catch (error) {
    console.log('--- [LOGIN] Erro inesperado:', error)
    res.status(400).json(error)
  }
})
export default router
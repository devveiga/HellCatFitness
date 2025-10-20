import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { z } from 'zod'

const prisma = new PrismaClient()
const router = Router()

const propostaSchema = z.object({
  usuarioId: z.string(),
  treinoId: z.number(),
  descricao: z.string().min(10, {
    message: "Descrição da Proposta deve possuir, no mínimo, 10 caracteres"
  }),
})

// GET todas as propostas, incluindo usuário e treino
router.get("/", async (req, res) => {
  try {
    const propostas = await prisma.proposta.findMany({
      include: {
        usuario: true,  // dados do usuário
        treino: true,   // dados do treino
      }
    })
    res.status(200).json(propostas)
  } catch (error) {
    res.status(400).json(error)
  }
})

// POST nova proposta
router.post("/", async (req, res) => {
  const valida = propostaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { usuarioId, treinoId, descricao } = valida.data

  try {
    const proposta = await prisma.proposta.create({
      data: { usuarioId, treinoId, descricao }
    })
    res.status(201).json(proposta)
  } catch (error) {
    res.status(400).json(error)
  }
})

// DELETE proposta pelo ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    await prisma.proposta.delete({ where: { id: Number(id) } })
    res.status(200).json({ message: `Proposta ${id} excluída com sucesso.` })
  } catch (error) {
    res.status(400).json(error)
  }
})

// PATCH para atualizar resposta da proposta
router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { resposta } = req.body
  if (!resposta || resposta.trim() === "") {
    res.status(400).json({ error: "Resposta não pode ser vazia." })
    return
  }

  try {
    const propostaAtualizada = await prisma.proposta.update({
      where: { id: Number(id) },
      data: { resposta }
    })
    res.status(200).json(propostaAtualizada)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router

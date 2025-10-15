import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/gerais", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.count()
    const treinos = await prisma.treino.count()
    const propostas = await prisma.proposta.count()
    res.status(200).json({ usuarios, treinos, propostas })
  } catch (error) {
    res.status(400).json(error)
  }
})

type MarcaGroupByNome = {
  nome: string
  _count: {
    carros: number
  }
}



type ClienteGroupByCidade = {
  cidade: string
  _count: {
    cidade: number
  }
}


export default router
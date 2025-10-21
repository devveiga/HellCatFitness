import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

const router = Router()

const treino = z.object({
  descricao: z.string().min(5, "A descrição do treino deve ter pelo menos 5 caracteres"),
  dataInicio: z.string().datetime({ message: "A data de início deve ser uma data válida" }),
  ativo: z.boolean().default(true),
  imagemUrl: z.string().url({ message: "A URL da imagem deve ser válida" }).optional(), // 👈 novo campo
  usuarioId: z.string().uuid({ message: "O ID do usuário deve ser um UUID válido" }).optional(),
  exercicios: z
    .array(
      z.object({
        exercicioId: z.number().int(),
        series: z.number().int(),
        repeticoes: z.number().int(),
      })
    )
    .optional(),
});


router.get("/", async (req, res) => {
  try {
    const treinos = await prisma.treino.findMany({
      where: { ativo: true },
    })
    res.status(200).json(treinos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {
  const valida = treino.safeParse(req.body);
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error });
  }

  const { descricao, dataInicio, ativo, usuarioId, exercicios, imagemUrl } = valida.data; // 👈

  try {
    const novoTreino = await prisma.$transaction(async (tx) => {
      const treinoCriado = await tx.treino.create({
        data: { descricao, dataInicio, ativo, usuarioId, imagemUrl }, // 👈
      });

      if (exercicios && exercicios.length > 0) {
        await tx.treinoExercicio.createMany({
          data: exercicios.map((ex) => ({
            treinoId: treinoCriado.id,
            exercicioId: ex.exercicioId,
            series: ex.series,
            repeticoes: ex.repeticoes,
          })),
        });
      }

      return treinoCriado;
    });

    res.status(201).json(novoTreino);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

  
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const treinoExistente = await prisma.treino.findUnique({
      where: { id: Number(id) },
    });

    if (!treinoExistente) {
      return res.status(404).json({ error: "Treino não encontrado." });
    }

    if (!treinoExistente.ativo) {
      return res.status(400).json({ error: "Treino já está inativo." });
    }

    await prisma.treino.update({
      where: { id: Number(id) },
      data: { ativo: false },
    });

    res.status(200).json({ message: `Treino ${id} desativado com sucesso.` });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

  
  router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const valida = treino.safeParse(req.body);

  if (!valida.success) {
    return res.status(400).json({ erro: valida.error });
  }

  const { descricao, dataInicio, ativo, usuarioId, exercicios, imagemUrl } = valida.data; // 👈

  try {
    const treinoAtualizado = await prisma.$transaction(async (tx) => {
      const atualizado = await tx.treino.update({
        where: { id: Number(id) },
        data: { descricao, dataInicio, ativo, usuarioId, imagemUrl }, // 👈
      });

      await tx.treinoExercicio.deleteMany({ where: { treinoId: atualizado.id } });

      if (exercicios && exercicios.length > 0) {
        await tx.treinoExercicio.createMany({
          data: exercicios.map((ex) => ({
            treinoId: atualizado.id,
            exercicioId: ex.exercicioId,
            series: ex.series,
            repeticoes: ex.repeticoes,
          })),
        });
      }

      return atualizado;
    });

    res.status(200).json(treinoAtualizado);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

  



export default router

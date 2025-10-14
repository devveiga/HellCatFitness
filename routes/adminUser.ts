import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar usuarioAdmin
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, nivel } = req.body;
    const novoAdmin = await prisma.admin.create({
      data: {
        nome,
        email,
        senha,
        nivel: nivel ?? 2,
      },
    });
    res.status(201).json(novoAdmin);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar admin', details: error });
  }
});

// Listar todos usuarioAdmin
router.get('/', async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar admins' });
  }
});

// Buscar usuarioAdmin por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) return res.status(404).json({ error: 'Admin não encontrado' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar admin' });
  }
});

// Atualizar usuarioAdmin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, nivel } = req.body;
    const admin = await prisma.admin.update({
      where: { id },
      data: { nome, email, senha, nivel },
    });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar admin', details: error });
  }
});

// Deletar usuarioAdmin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.admin.delete({ where: { id } });
    res.json({ message: 'Admin deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar admin', details: error });
  }
});

export default router;
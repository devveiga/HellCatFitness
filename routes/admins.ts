import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { verificaToken } from "../middlewares/verificaToken"

const prisma = new PrismaClient()
const router = Router()

const adminSchema = z.object({
  nome: z.string().min(10,
    { message: "Nome deve possuir, no mínimo, 10 caracteres" }),
  email: z.string().email(),
  senha: z.string(),
  nivel: z.number()
    .min(1, { message: "Nível, no mínimo, 1" })
    .max(5, { message: "Nível, no máximo, 5" })
})

router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany()
    res.status(200).json(admins)
  } catch (error) {
    res.status(400).json(error)
  }
})

function validaSenha(senha: string) {

  const mensa: string[] = []

  // .length: retorna o tamanho da string (da senha)
  if (senha.length < 8) {
    mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
  }

  // contadores
  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  // senha = "abc123"
  // letra = "a"

  // percorre as letras da variável senha
  for (const letra of senha) {
    // expressão regular
    if ((/[a-z]/).test(letra)) {
      pequenas++
    }
    else if ((/[A-Z]/).test(letra)) {
      grandes++
    }
    else if ((/[0-9]/).test(letra)) {
      numeros++
    } else {
      simbolos++
    }
  }

  if (pequenas == 0) {
    mensa.push("Erro... senha deve possuir letra(s) minúscula(s)")
  }

  if (grandes == 0) {
    mensa.push("Erro... senha deve possuir letra(s) maiúscula(s)")
  }

  if (numeros == 0) {
    mensa.push("Erro... senha deve possuir número(s)")
  }

  if (simbolos == 0) {
    mensa.push("Erro... senha deve possuir símbolo(s)")
  }

  return mensa
}

router.post("/", async (req, res) => {
  // 1️⃣ Validação do schema básico com Zod
  const valida = adminSchema.safeParse(req.body)
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error })
  }

  const { nome, email, senha, nivel } = valida.data

  // 2️⃣ Validação da senha
  const erros = validaSenha(senha)
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join("; ") })
  }

  try {
    // 3️⃣ Verificar se já existe um admin com o mesmo email
    const existente = await prisma.admin.findUnique({
      where: { email }
    })
    if (existente) {
      return res.status(400).json({ erro: "Já existe um admin com esse email" })
    }

    // 4️⃣ Hash da senha
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(senha, salt)

    // 5️⃣ Criar admin
    const admin = await prisma.admin.create({
      data: { nome, email, senha: hash, nivel }
    })

    res.status(201).json(admin)
  } catch (error) {
    res.status(400).json(error)
  }
})


router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const admin = await prisma.admin.findFirst({
      where: { id }
    })
    res.status(200).json(admin)
  } catch (error) {
    res.status(400).json(error)
  }
})
// PATCH /admins/:id - altera o nível de um admin
router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const { nivel } = req.body

  // validação do nível
  if (typeof nivel !== "number" || nivel < 1 || nivel > 5) {
    return res.status(400).json({ erro: "Nível inválido. Deve ser entre 1 e 5." })
  }

  try {
    // atualiza o admin pelo id
    const adminAtualizado = await prisma.admin.update({
      where: { id },
      data: { nivel },
    })

    res.status(200).json(adminAtualizado)
  } catch (error) {
    res.status(404).json({ erro: "Admin não encontrado" })
  }
})
// DELETE /admins/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await prisma.admin.delete({
      where: { id },
    });
    res.status(200).json({ mensagem: "Admin excluído com sucesso", admin });
  } catch (error) {
    res.status(404).json({ erro: "Admin não encontrado" });
  }
});


export default router
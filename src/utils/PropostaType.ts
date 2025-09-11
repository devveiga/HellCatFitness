import type { TreinoType } from "./TreinoType"

export type PropostaType = {
  id: number
  clienteId: string
  carroId: number
  treino: TreinoType
  descricao: string
  resposta: string | null
  createdAt: string
  updatedAt: string | null
}
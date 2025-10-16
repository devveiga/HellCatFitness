export type TreinoExercicioType = {
    exercicioId: number;
    series: number;
    repeticoes: number;
    grupoMuscular: string;
    nome: string;
};

export type TreinoType = {
  id: number;
  descricao: string;
  dataInicio: string;
  ativo: boolean;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  admin?: {
    id: string;
    nome: string;
    email: string;
  } | null;
  destaque?: boolean; // opcional
};

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
    usuarioId: number;
    exercicios: TreinoExercicioType[];
};
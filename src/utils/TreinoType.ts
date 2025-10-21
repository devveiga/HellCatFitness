export type TreinoType = {
  id: number;
  descricao: string;
  dataInicio: string;
  ativo: boolean;
  imagemUrl?: string; // <- nova propriedade opcional
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

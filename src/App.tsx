import { InputPesquisa } from "./components/InputPesquisa";
import { CardTreino } from "./components/CardTreino";
import type { TreinoType, TreinoExercicioType } from "./utils/TreinoType";
import { useEffect, useState } from "react";
import { useUsuarioStore } from "./context/UsuarioContext";




const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [treinos, setTreinos] = useState<TreinoType[]>([]);
  const { logaUsuario } = useUsuarioStore();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/treinos`);
      const dados = await response.json();
      
      // Para cada treino, buscar os exercícios relacionados e os dados do exercício
      const treinosComExercicios = await Promise.all(
        dados.map(async (treino: any) => {
          // Buscar todos os treinoExercicios desse treino
          const resTreinoEx = await fetch(`${apiUrl}/treinoexercicios`);
          const treinoExercicios = await resTreinoEx.json();
          const relacionados = treinoExercicios.filter((te: any) => te.treinoId === treino.id);

          // Buscar todos os exercícios
          const resExercicios = await fetch(`${apiUrl}/exercicios`);
          const exercicios = await resExercicios.json();

          // Montar lista de exercícios com grupoMuscular e nome
          const exerciciosDetalhados: TreinoExercicioType[] = relacionados.map((te: any) => {
            const ex = exercicios.find((e: any) => e.id === te.exercicioId);
            return {
              exercicioId: te.exercicioId,
              series: te.series,
              repeticoes: te.repeticoes,
              grupoMuscular: ex ? ex.grupoMuscular : "-",
              nome: ex ? ex.nome : "-"
            };
          });

          return {
            ...treino,
            exercicios: exerciciosDetalhados
          };
        })
      );
      setTreinos(treinosComExercicios);
    }
    buscaDados();


    
    async function buscaCliente(id: string) {
      const response = await fetch(`${apiUrl}/clientes/${id}`);
      const dados = await response.json();
      logaUsuario(dados);
    }
    if (localStorage.getItem("clienteKey")) {
      const idCliente = localStorage.getItem("clienteKey");
      buscaCliente(idCliente as string);
    }
  }, []);

  const listaTreinos = treinos.map((treino) => (
    <CardTreino data={treino} key={treino.id} />
  ));

  return (
    <>
      <InputPesquisa setTreinos={setTreinos} />
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-gray-600 ">
          Treinos <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">em destaque</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {listaTreinos}
        </div>
      </div>
    </>
  );
}

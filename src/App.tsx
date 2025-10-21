import { InputPesquisa } from "./components/InputPesquisa";
import { CardTreino } from "./components/CardTreino";
import type { TreinoType } from "./utils/TreinoType";
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

      const treinosComExercicios = await Promise.all(
        dados.map(async (treino: any) => {
          const resTreinoEx = await fetch(`${apiUrl}/treinoexercicios`);
          const treinoExercicios = await resTreinoEx.json();
          const relacionados = treinoExercicios.filter((te: any) => te.treinoId === treino.id);

          const resExercicios = await fetch(`${apiUrl}/exercicios`);
          const exercicios = await resExercicios.json();

          const exerciciosDetalhados = relacionados.map((te: any) => {
            const ex = exercicios.find((e: any) => e.id === te.exercicioId);
            return {
              exercicioId: te.exercicioId,
              series: te.series,
              repeticoes: te.repeticoes,
              grupoMuscular: ex ? ex.grupoMuscular : "-",
              nome: ex ? ex.nome : "-",
            };
          });

          return {
            ...treino,
            exercicios: exerciciosDetalhados,
          };
        })
      );

      setTreinos(treinosComExercicios);
    }

    buscaDados();

    // Restaurar contexto do usuário do localStorage
    const usuarioStorage = localStorage.getItem("usuarioKey");
    if (usuarioStorage) {
      try {
        const usuarioDados = JSON.parse(usuarioStorage);
        logaUsuario(usuarioDados);
      } catch (err) {
        console.error("Erro ao parsear usuarioKey:", err);
      }
    }
  }, []);

  const listaTreinos = treinos.map((treino) => (
    <CardTreino data={treino} key={treino.id} />
  ));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      {/* Input de pesquisa */}
      <div className="max-w-4xl mx-auto mb-12">
        <InputPesquisa setTreinos={setTreinos} />
      </div>

      {/* Título centralizado */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100">
          Treinos{" "}
          <span className="underline underline-offset-4 decoration-8 decoration-red-400 dark:decoration-red-600">
            em destaque
          </span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg md:text-xl">
          Confira os melhores treinos selecionados para você
        </p>
      </div>

      {/* Grid de treinos centralizada */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {listaTreinos}
        </div>
      </div>
    </div>
  );
}

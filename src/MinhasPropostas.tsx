import { useEffect, useState } from "react";
import { useUsuarioStore } from "./context/UsuarioContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Propostas() {
  const [propostas, setPropostas] = useState<any[]>([]);
  const { usuario } = useUsuarioStore();

  useEffect(() => {
    async function buscaDados() {
      if (!usuario?.id) return;
      const response = await fetch(`${apiUrl}/proposta`);
      const dados = await response.json();
      // Filtra só as propostas do usuário logado
      setPropostas(dados.filter((p: any) => p.usuarioId === usuario.id));
    }
    buscaDados();
  }, [usuario]);

  function dataDMA(data: string) {
    const ano = data.substring(0, 4);
    const mes = data.substring(5, 7);
    const dia = data.substring(8, 10);
    return `${dia}/${mes}/${ano}`;
  }

  return (
  <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-900 dark:bg-gray-900 rounded-xl shadow-sm">
    {/* Título centralizado */}
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
        Minhas{" "}
        <span className="underline underline-offset-4 decoration-8 decoration-red-600">
          Propostas
        </span>
      </h1>
      <p className="mt-2 text-gray-300 text-lg md:text-xl">
        Aqui você encontra todas as suas propostas de treinos enviadas.
      </p>
    </div>

    {propostas.length === 0 ? (
      <h2 className="text-center mt-12 text-xl md:text-2xl text-gray-400">
        Ah... você ainda não fez propostas de treino!
      </h2>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm text-gray-200 border-collapse border border-gray-700 rounded-lg">
          <thead className="bg-red-600 text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Treino</th>
              <th className="px-4 py-2">Data Início</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Resposta</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((proposta) => (
              <tr key={proposta.id} className="bg-gray-800 border-b border-gray-700">
                <td className="px-4 py-2 font-medium text-white">
                  <p><b>{proposta.treino?.descricao ?? "-"}</b></p>
                  <p className="text-sm italic text-gray-400">
                    Enviado em: {dataDMA(proposta.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-2">{proposta.treino ? dataDMA(proposta.treino.dataInicio) : "-"}</td>
                <td className="px-4 py-2">{proposta.descricao}</td>
                <td className="px-4 py-2">
                  {proposta.resposta ? (
                    <>
                      <p><b>{proposta.resposta}</b></p>
                      <p className="text-sm italic text-gray-400">
                        Respondido em: {dataDMA(proposta.updatedAt)}
                      </p>
                    </>
                  ) : (
                    <span className="italic text-gray-400">Aguardando...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);


}

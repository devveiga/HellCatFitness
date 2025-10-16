import { useEffect, useState } from "react"
import type { PropostaType } from "../utils/PropostaType"
import ItemProposta from "./components/ItemProposta"
import { useAdminStore } from "./context/AdminContext"

const apiUrl = import.meta.env.VITE_API_URL

function ControlePropostas() {
  const [propostas, setPropostas] = useState<PropostaType[]>([])
  const { admin } = useAdminStore()
  console.log("Renderizando ControlePropostas - admin:", admin)

  async function getPropostas() {
    console.log("🔄 useEffect iniciado - admin:", admin)
    try {
      const response = await fetch(`${apiUrl}/proposta`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const dados: PropostaType[] = await response.json();
      setPropostas(dados);
      console.log("✅ Propostas carregadas:", dados)
    } catch (err) {
      console.error("❌ Erro ao buscar propostas:", err)
    }
  }
 useEffect(() => {
  console.log("useEffect chamado");
  if (!admin) return;
  console.log("propostas antes", propostas);
  getPropostas();
  console.log("propostas dps", propostas);
}, [admin]);

  return (
    <div className="m-4 mt-24">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-red-800">
        Controle de Propostas
      </h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Treino</th>
              <th scope="col" className="px-6 py-3">Usuário</th>
              <th scope="col" className="px-6 py-3">Proposta do Usuário</th>
              <th scope="col" className="px-6 py-3">Resposta do Instrutor</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((proposta) => (
              <ItemProposta
                key={proposta.id}
                proposta={proposta}
                propostas={propostas}
                setPropostas={setPropostas}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ControlePropostas

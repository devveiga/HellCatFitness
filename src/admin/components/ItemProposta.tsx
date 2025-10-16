import { TiDeleteOutline } from "react-icons/ti"
import { FaRegEdit } from "react-icons/fa"
import type { PropostaType } from "../../utils/PropostaType"
import { useAdminStore } from "../context/AdminContext"

type listaPropostaProps = {
  proposta: PropostaType,
  propostas: PropostaType[],
  setPropostas: React.Dispatch<React.SetStateAction<PropostaType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemProposta({ proposta, propostas, setPropostas }: listaPropostaProps) {
  const { admin } = useAdminStore()

  async function excluirProposta() {
    if (confirm(`Confirma Exclusão da Proposta "${proposta.descricao}"?`)) {
      const response = await fetch(`${apiUrl}/propostas/${proposta.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
      })

      if (response.status == 200) {
        setPropostas(propostas.filter(x => x.id !== proposta.id))
        alert("Proposta excluída com sucesso")
      } else {
        alert("Erro... Proposta não foi excluída")
      }
    }
  }

  async function responderProposta() {
    const respostaRevenda = prompt(`Resposta da Revenda para "${proposta.descricao}"`)
    if (!respostaRevenda?.trim()) return

    const response = await fetch(`${apiUrl}/propostas/${proposta.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${admin.token}`
      },
      body: JSON.stringify({ resposta: respostaRevenda })
    })

    if (response.status == 200) {
      setPropostas(propostas.map(x => x.id === proposta.id ? { ...x, resposta: respostaRevenda } : x))
    }
  }

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        {proposta.treino?.descricao ?? "-"}
      </td>
      <td className="px-6 py-4">{proposta.usuario?.nome ?? "-"}</td>
      <td className="px-6 py-4">{proposta.descricao}</td>
      <td className="px-6 py-4">{proposta.resposta ?? "-"}</td>
      <td className="px-6 py-4">
        {proposta.resposta ? (
          <img src="/ok.png" alt="Ok" style={{ width: 60 }} />
        ) : (
          <>
            <TiDeleteOutline
              className="text-3xl text-red-600 inline-block cursor-pointer"
              title="Excluir"
              onClick={excluirProposta}
            />&nbsp;
            <FaRegEdit
              className="text-3xl text-yellow-600 inline-block cursor-pointer"
              title="Responder"
              onClick={responderProposta}
            />
          </>
        )}
      </td>
    </tr>
  )
}

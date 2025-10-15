import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar } from "react-icons/fa"
import type { TreinoType } from "../../utils/TreinoType"
import { useAdminStore } from "../context/AdminContext"

type listaTreinosProps = {
  treino: TreinoType;
  treinos: TreinoType[];
  setTreinos: React.Dispatch<React.SetStateAction<TreinoType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemTreino({ treino, treinos, setTreinos }: listaTreinosProps) {
  const { admin } = useAdminStore()

  async function excluirTreino() {
    if (!admin || admin.nivel == 1) {
      alert("Você não tem permissão para excluir veículos");
      return;
    }

    if (confirm(`Confirma a exclusão`)) {
      const response = await fetch(`${apiUrl}/treinos/${treino.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${admin.token}`
          },
        },
      )

      if (response.status == 200) {
        const treinos2 = treinos.filter(x => x.id != treino.id)
        setTreinos(treinos2)
        alert("Carro excluído com sucesso")
      } else {
        alert("Erro... Carro não foi excluído")
      }
    }
  }

  async function alterarDestaque() {

    const response = await fetch(`${apiUrl}/treinos/destacar/${treino.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
      },
    )

    if (response.status == 200) {
      const treinos2 = treinos.map(x => {
        if (x.id == treino.id) {
          return { ...x, destaque: !x.destaque }
        }
        return x
      })
      setTreinos(treinos2)
    }
  }

  return (
    <tr key={treino.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={treino.foto} alt={`Foto do ${treino.modelo}`}
          style={{ width: 200 }} />
      </th>
      <td className={`px-6 py-4 ${treino.destaque ? "font-extrabold" : ""}`}>
        {treino.modelo}
      </td>
      <td className={`px-6 py-4 ${treino.destaque ? "font-extrabold" : ""}`}>
        {treino.marca.nome}
      </td>
      <td className={`px-6 py-4 ${treino.destaque ? "font-extrabold" : ""}`}>
        {treino.ano}
      </td>
      <td className={`px-6 py-4 ${treino.destaque ? "font-extrabold" : ""}`}>
        {Number(treino.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
          onClick={excluirTreino} />&nbsp;
        <FaRegStar className="text-3xl text-yellow-600 inline-block cursor-pointer" title="Destacar"
          onClick={alterarDestaque} />
      </td>
    </tr>
  )
}
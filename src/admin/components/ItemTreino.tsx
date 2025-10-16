import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar } from "react-icons/fa"
import type { TreinoType } from "../../utils/TreinoType"
import { useAdminStore } from "../context/AdminContext"

type ListaTreinosProps = {
  treino: TreinoType;
  treinos: TreinoType[];
  setTreinos: React.Dispatch<React.SetStateAction<TreinoType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemTreino({ treino, treinos, setTreinos }: ListaTreinosProps) {
  const { admin } = useAdminStore()

  async function excluirTreino() {
    if (!admin || admin.nivel == 1) {
      alert("Você não tem permissão para excluir treinos");
      return;
    }

    if (confirm(`Confirma a exclusão do treino "${treino.descricao}"?`)) {
      const response = await fetch(`${apiUrl}/treinos/${treino.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
      });

      if (response.status === 200) {
        const treinosAtualizados = treinos.filter(x => x.id !== treino.id);
        setTreinos(treinosAtualizados);
        alert("Treino excluído com sucesso!");
      } else {
        alert("Erro... o treino não foi excluído.");
      }
    }
  }

  async function alterarDestaque() {
    // se tu quiser adicionar destaque ao treino depois, aqui já fica preparado
    const response = await fetch(`${apiUrl}/treinos/destacar/${treino.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${admin.token}`,
      },
    });

    if (response.status === 200) {
      const treinosAtualizados = treinos.map(x =>
        x.id === treino.id ? { ...x, destaque: !x.destaque } : x
      );
      setTreinos(treinosAtualizados);
    }
  }

  return (
    <tr
      key={treino.id}
      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
    >
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {treino.descricao}
      </td>
      <td className="px-6 py-4">
        {new Date(treino.dataInicio).toLocaleDateString("pt-BR")}
      </td>
      <td className="px-6 py-4">
        {treino.ativo ? "Ativo" : "Inativo"}
      </td>
      <td className="px-6 py-4">
        {treino.usuario?.nome ?? "Usuário não informado"}
      </td>
      <td className="px-6 py-4">
        {treino.admin?.nome ?? "-"}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline
          className="text-3xl text-red-600 inline-block cursor-pointer"
          title="Excluir"
          onClick={excluirTreino}
        />
        &nbsp;
        <FaRegStar
          className="text-3xl text-yellow-600 inline-block cursor-pointer"
          title="Destacar"
          onClick={alterarDestaque}
        />
      </td>
    </tr>
  );
}

import { TiDeleteOutline } from "react-icons/ti"
import { FaListOl } from "react-icons/fa6";
import { useAdminStore } from "../context/AdminContext"

import type { AdminType } from "../../utils/AdminType"

type listaTreinoProps = {
  adminLinha: AdminType;
  admins: AdminType[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemAdmin({ adminLinha, admins, setAdmins }: listaTreinoProps) {
  const { admin } = useAdminStore()

  async function excluirAdmin() {
    if (!admin) {
      alert("Admin não encontrado. Recarregue a página.");
      return;
    }

    if (admin.nivel === 1) {
      alert("Você não tem permissão para excluir admins");
      return;
    }

    if (confirm(`Confirma a exclusão`)) {
      const response = await fetch(`${apiUrl}/admins/${adminLinha.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
      })

      if (response.status === 200) {
        const admins2 = admins.filter(x => x.id !== adminLinha.id)
        setAdmins(admins2)
        alert("Admin excluído com sucesso")
      } else {
        alert("Erro... Admin não foi excluído")
      }
    }
  }

 async function alterarNivel() {
  // 1️⃣ Buscar o admin logado para garantir nível
  const responseAdmin = await fetch(`${apiUrl}/admins/${admin?.id}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${admin?.token}`
    }
  });

  if (!responseAdmin.ok) {
    alert("Erro ao verificar permissões do admin logado");
    return;
  }

  const adminLogado: AdminType = await responseAdmin.json();

  // 2️⃣ Verificar se o nível permite alterar
  if (adminLogado.nivel < 3) {
    alert("Você não tem permissão para alterar o nível de outros admins");
    return;
  }

  // 3️⃣ Perguntar o novo nível
  const nivel = Number(prompt("Novo Nível do Admin?"));

  if (nivel < 1 || nivel > 5) {
    alert("Erro... Nível deve ser entre 1 e 5");
    return;
  }

  // 4️⃣ Atualizar o adminLinha via endpoint padrão
  const responseUpdate = await fetch(`${apiUrl}/admins/${adminLinha.id}`, {
    method: "PATCH", // ou PUT dependendo do seu backend
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${admin?.token}`
    },
    body: JSON.stringify({ nivel })
  });

  if (responseUpdate.ok) {
    const admins2 = admins.map(x => x.id === adminLinha.id ? { ...x, nivel } : x);
    setAdmins(admins2);
    alert("Nível do admin atualizado com sucesso!");
  } else {
    alert("Erro ao atualizar nível do admin");
  }
}


  return (
    <tr key={adminLinha.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="px-6 py-4">{adminLinha.nome}</td>
      <td className="px-6 py-4">{adminLinha.email}</td>
      <td className="px-6 py-4">{adminLinha.nivel}</td>
      <td className="px-6 py-4">
        <TiDeleteOutline
          className="text-3xl text-red-600 inline-block cursor-pointer"
          title="Excluir"
          onClick={excluirAdmin}
        />&nbsp;
        <FaListOl
          className="text-3xl text-yellow-600 inline-block cursor-pointer"
          title="Alterar Nível"
          onClick={alterarNivel}
        />
      </td>
    </tr>
  )
}

import { useEffect } from "react"
import { useAdminStore } from "../context/AdminContext"
import { IoExitOutline } from "react-icons/io5"
import { BiSolidDashboard } from "react-icons/bi"
import { FaDumbbell, FaUsers } from "react-icons/fa6"
import { BsCashCoin } from "react-icons/bs"
import { FaRegUser } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"

export function MenuLateral() {
  const navigate = useNavigate()
  const { admin, deslogaAdmin } = useAdminStore()

  useEffect(() => {
    console.log("🧭 MenuLateral renderizado")
    console.log("👤 Admin logado:", admin ? admin.nome : "nenhum")
    console.log("🔑 Nível:", admin?.nivel)
    console.log("🪪 Token presente:", admin?.token ? "sim" : "não")
  }, [admin])

  function adminSair() {
    console.log("🚪 Botão de sair clicado")
    if (confirm("Confirma saída do sistema?")) {
      console.log("✅ Logout confirmado, limpando contexto...")
      deslogaAdmin()
      navigate("/", { replace: true })
    } else {
      console.log("❌ Logout cancelado pelo usuário")
    }
  }

  function handleNavigate(destino: string) {
    console.log(`➡️ Navegando para ${destino}`)
  }

  return (
    <aside
      id="default-sidebar"
      className="fixed mt-24 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-blue-300 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">

          {/* Dashboard */}
          <li>
            <Link to="/admin" className="flex items-center p-2" onClick={() => handleNavigate("/admin")}>
              <BiSolidDashboard className="text-white text-2xl" />
              <span className="ms-2 mt-1 text-white">Visão Geral</span>
            </Link>
          </li>

          {/* Treinos */}
          <li>
            <Link to="/admin/treinos" className="flex items-center p-2" onClick={() => handleNavigate("/admin/treinos")}>
              <FaDumbbell className="text-white text-2xl" />
              <span className="ms-2 mt-1 text-white">Gerenciar Treinos</span>
            </Link>
          </li>

          {/* Usuários */}
          <li>
            <Link to="/admin/usuarios" className="flex items-center p-2" onClick={() => handleNavigate("/admin/usuarios")}>
              <FaUsers className="text-white text-2xl" />
              <span className="ms-2 mt-1 text-white">Controle de Usuários</span>
            </Link>
          </li>

          {/* Propostas */}
          <li>
            <Link to="/admin/propostas" className="flex items-center p-2" onClick={() => handleNavigate("/admin/propostas")}>
              <BsCashCoin className="text-white text-2xl" />
              <span className="ms-2 mt-1 text-white">Controle de Propostas</span>
            </Link>
          </li>

          {/* Cadastro de Admins - apenas nível 3 */}
          {admin?.nivel === 3 && (
            <li>
              <Link to="/admin/cadAdmin" className="flex items-center p-2" onClick={() => handleNavigate("/admin/cadAdmin")}>
                <FaRegUser className="text-gray-200 text-2xl" />
                <span className="ms-2 mt-1 text-gray-200">Cadastro de Admins</span>
              </Link>
            </li>
          )}

          {/* Logout */}
          <li>
            <span className="flex items-center p-2 cursor-pointer" onClick={adminSair}>
              <IoExitOutline className="text-red-500 text-2xl" />
              <span className="ms-2 mt-1 text-white">Sair do Sistema</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}

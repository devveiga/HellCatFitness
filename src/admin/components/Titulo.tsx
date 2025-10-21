import { FiUsers } from "react-icons/fi"
import { Link } from "react-router-dom"
import { useAdminStore } from "../context/AdminContext"
import logo from "../assets/hellcat.png";

export function Titulo() {
  const { admin } = useAdminStore()

  // Se admin ainda não estiver definido, não renderiza o componente de info
  if (!admin) return null;

  return (
    <nav className="bg-red-800 border-gray-200 dark:bg-red-800 flex flex-wrap justify-between fixed top-0 left-0 w-full z-50">
      <div className="flex flex-wrap justify-between max-w-screen-xl p-4">
        <Link to="/admin" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-16" alt="Hellcat" />
          <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
            HellCat: Área do Instrutor
          </span>
        </Link>
      </div>
      <div className="flex me-4 items-center font-bold text-white">
        <FiUsers className="mr-2 text-white" />
        {admin.nome}
      </div>
    </nav>
  )
}

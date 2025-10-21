import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Toaster } from "sonner"
import { useAdminStore } from "./context/AdminContext"
import { Titulo } from "./components/Titulo.tsx"
import { MenuLateral } from "./components/MenuLateral.tsx"

export default function AdminLayout() {
  const { admin } = useAdminStore()
  const navigate = useNavigate()

  useEffect(() => {
    // se admin for null ou não tiver token, redireciona pro login
    if (!admin || Object.keys(admin).length === 0) {
      navigate("/admin/login", { replace: true })
    }
  }, [admin, navigate])

  // enquanto não há admin, não renderiza layout
  if (!admin || Object.keys(admin).length === 0) {
    return null
  }

  return (
    <>
      <Titulo />
      <MenuLateral />
      <div className="p-4 sm:ml-64">
        <Outlet />
      </div>
      <Toaster richColors position="top-right" />
    </>
  )
}

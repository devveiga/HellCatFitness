import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Toaster, toast } from 'sonner'
import { useAdminStore } from "./context/AdminContext"
import { useNavigate } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  email: string
  senha: string
}

export default function AdminLogin() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const navigate = useNavigate()
  const { logaAdmin } = useAdminStore()

  useEffect(() => {
    setFocus("email")
  }, [setFocus])

  async function verificaLogin(data: Inputs) {
    try {
      const response = await fetch(`${apiUrl}/admins/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const dataRes = await response.json()
        console.log("🔐 Login bem-sucedido:", dataRes)

        // salva apenas o admin (sem token)
        logaAdmin(dataRes.usuario)

        // opcional: salva o token localmente
        localStorage.setItem("token", dataRes.token)

        navigate("/admin", { replace: true })
      } else if (response.status === 400) {
        toast.error("Erro... Login ou senha incorretos")
      } else {
        toast.error("Erro inesperado no login")
      }
    } catch (error) {
      console.error("❌ Erro de rede no login:", error)
      toast.error("Falha ao conectar ao servidor")
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">

  <div className="max-w-sm w-full bg-gray-800 rounded-2xl shadow-xl p-8">
    <h1 className="text-3xl font-bold mb-8 text-red-600 text-center">Admin: HellCat</h1>
    <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-red-400">
          E-mail:
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          required
          className="w-full p-3 text-sm rounded-lg border border-red-500 bg-gray-700 text-white
                     focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-red-400">
          Senha:
        </label>
        <input
          type="password"
          id="password"
          {...register("senha")}
          required
          className="w-full p-3 text-sm rounded-lg border border-red-500 bg-gray-700 text-white
                     focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none
                   focus:ring-red-300 font-semibold rounded-lg shadow-md transition-all duration-200"
      >
        Entrar
      </button>
    </form>
  </div>

  <Toaster richColors position="top-right" />
</main>

  )
}

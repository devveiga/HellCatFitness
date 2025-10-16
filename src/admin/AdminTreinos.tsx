import { useEffect, useState } from "react"
import ItemTreino from './components/ItemTreino'
import type { TreinoType } from "../utils/TreinoType"
import { Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminTreinos() {
  const [treinos, setTreinos] = useState<TreinoType[]>([])

  useEffect(() => {
    console.log("API URL:", apiUrl)
    async function getTreinos() {
      try {
        const response = await fetch(`${apiUrl}/treinos`)
        if (!response.ok) throw new Error("Erro ao buscar treinos")
        const dados = await response.json()
        setTreinos(dados)
      } catch (error) {
        console.error("Erro ao carregar treinos:", error)
      }
    }
    getTreinos()
  }, [])

  const listaTreinos = treinos.map(treino => (
    <ItemTreino
      key={treino.id}
      treino={treino}
      treinos={treinos}
      setTreinos={setTreinos}
    />
  ))

  return (
    <div className="m-4 mt-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciamento de Treinos
        </h1>

        <Link
          to="/admin/treinos/novo"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                     font-bold rounded-lg text-md px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 
                     focus:outline-none dark:focus:ring-blue-800"
        >
          Novo Treino
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Descrição</th>
              <th scope="col" className="px-6 py-3">Data de Início</th>
              <th scope="col" className="px-6 py-3">Usuário</th>
              <th scope="col" className="px-6 py-3">Admin</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaTreinos.length > 0 ? (
              listaTreinos
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Nenhum treino cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

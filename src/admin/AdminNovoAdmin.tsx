import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "./context/AdminContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminNovoAdmin() {
  const { admin } = useAdminStore();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState(1);
  const [senha, setSenha] = useState("");

  async function criarAdmin(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    const response = await fetch(`${apiUrl}/admins`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${admin?.token}`,
      },
      body: JSON.stringify({ nome, email, senha, nivel }),
    });

    if (response.status === 201) {
      alert("Admin criado com sucesso!");
      navigate("/admin/cadAdmin");
    } else {
      alert("Erro ao criar admin");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="mb-8 mt-16 text-3xl font-bold text-red-600 text-center">
        Novo Administrador
      </h1>

      <form
        onSubmit={criarAdmin}
        className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
      >
        {/* Nome */}
        <div>
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Nome
          </label>
          <input
            type="text"
            id="nome"
            placeholder="Digite o nome do administrador"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full p-3 text-sm rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* E-mail */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            placeholder="Digite o e-mail do administrador"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 text-sm rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Senha */}
        <div>
          <label
            htmlFor="senha"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Senha
          </label>
          <input
            type="password"
            id="senha"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full p-3 text-sm rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Nível */}
        <div>
          <label
            htmlFor="nivel"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Nível da conta (1-5)
          </label>
          <input
            type="number"
            id="nivel"
            value={nivel}
            onChange={(e) => setNivel(Number(e.target.value))}
            min={1}
            max={5}
            className="w-full p-3 text-sm rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full py-3 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg shadow-md transition-all duration-200"
        >
          Criar Admin
        </button>
      </form>
    </div>
  );
}

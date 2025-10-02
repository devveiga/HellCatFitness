import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface FormData {
  nome: string;
  email: string;
  senha: string;
  perguntaSecreta?: string;
  respostaSecreta?: string;
}

export const CadastroUsuarioForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    perguntaSecreta: "",
    respostaSecreta: "",
  });

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);
    setErro(null);

    try {
      const response = await axios.post<{ nome: string }>(
        `${apiUrl}/usuarios`,
        form
      );
      
      setMensagem(`Usuário ${response.data.nome} criado com sucesso!`);
      setForm({
        nome: "",
        email: "",
        senha: "",
        perguntaSecreta: "",
        respostaSecreta: "",
      });



    } catch (err: any) {
      const rawError = err.response?.data?.erro || err.response?.data?.error;
    
      const erroBackend = typeof rawError === "string"
        ? rawError
        : JSON.stringify(rawError, null, 2); // ou alguma transformação amigável
    
      setErro(erroBackend);
    }
    setLoading(false);
  };    

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 relative">
      <div className="p-6 space-y-4 sm:p-8">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
          Cadastro de Usuário
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="nome"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="perguntaSecreta"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Pergunta Secreta (opcional)
            </label>
            <input
              type="text"
              id="perguntaSecreta"
              name="perguntaSecreta"
              value={form.perguntaSecreta}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="respostaSecreta"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Resposta Secreta (opcional)
            </label>
            <input
              type="text"
              id="respostaSecreta"
              name="respostaSecreta"
              value={form.respostaSecreta}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </button>

          {mensagem && (
            <p className="text-green-600 dark:text-green-400 text-sm text-center">{mensagem}</p>
          )}
          {erro && (
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{erro}</p>
          )}
        </form>
      </div>
    </div>
  );
};

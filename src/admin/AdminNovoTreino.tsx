import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAdminStore } from "./context/AdminContext";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  descricao: string;
  dataInicio: string;
  ativo: boolean;
  imagemUrl: string; // 👈 novo campo
};

export default function AdminNovoTreino() {
  const { admin } = useAdminStore();
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>();

  useEffect(() => {
    setFocus("descricao");
  }, []);

  async function incluirTreino(data: Inputs) {
    if (!admin) {
      toast.error("Admin não encontrado. Faça login novamente.");
      return;
    }

    try {
      const novoTreino = {
        descricao: data.descricao,
        dataInicio: new Date(data.dataInicio).toISOString(),
        ativo: data.ativo,
        imagemUrl: data.imagemUrl, // 👈 novo campo
        adminId: admin!.id,
      };

      const response = await fetch(`${apiUrl}/treinos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin!.token}`,
        },
        body: JSON.stringify(novoTreino),
      });

      if (response.status === 201) {
        toast.success("Treino cadastrado com sucesso!");
        reset();
      } else {
        const errorText = await response.text();
        toast.error("Erro no cadastro do Treino: " + errorText);
      }
    } catch (error: any) {
      toast.error("Erro de rede ou servidor: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="mb-8 mt-16 text-3xl font-bold text-red-600 text-center">
        Inclusão de Treino
      </h1>

      <form
        className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
        onSubmit={handleSubmit(incluirTreino)}
      >
        {/* Descrição */}
        <div>
          <label
            htmlFor="descricao"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Descrição
          </label>
          <input
            type="text"
            id="descricao"
            {...register("descricao")}
            required
            className="w-full p-3 text-sm rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Data de Início */}
        <div>
          <label
            htmlFor="dataInicio"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Data de Início
          </label>
          <input
            type="date"
            id="dataInicio"
            {...register("dataInicio")}
            required
            className="w-full p-3 text-sm rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* URL da Imagem */}
        <div>
          <label
            htmlFor="imagemUrl"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            URL da Imagem
          </label>
          <input
            type="url"
            id="imagemUrl"
            placeholder="https://exemplo.com/treino.jpg"
            {...register("imagemUrl")}
            className="w-full p-3 text-sm rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Ativo */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="ativo"
            {...register("ativo")}
            defaultChecked
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <label
            htmlFor="ativo"
            className="text-gray-700 dark:text-gray-200 font-medium"
          >
            Ativo
          </label>
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full py-3 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg shadow-md transition-all duration-200"
        >
          Incluir Treino
        </button>
      </form>
    </div>
  );
}

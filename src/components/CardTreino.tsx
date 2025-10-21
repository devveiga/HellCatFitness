import type { TreinoType } from "../utils/TreinoType";
import { useState } from "react";
import { useUsuarioStore } from "../context/UsuarioContext";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  descricao: string;
};

export function CardTreino({ data }: { data: TreinoType }) {
  const [modalAberto, setModalAberto] = useState(false);
  const { usuario } = useUsuarioStore();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);

  async function enviaProposta(form: Inputs) {
    if (!usuario?.id) {
      toast.error("Você precisa estar logado para enviar uma proposta.");
      return;
    }
    setLoading(true);
    const response = await fetch(`${apiUrl}/proposta`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        usuarioId: usuario.id,
        treinoId: data.id,
        descricao: form.descricao
      })
    });
    setLoading(false);
    if (response.status === 201) {
      toast.success("Obrigado. Sua proposta foi enviada ao instrutor. Aguarde retorno por e-mail.");
      reset();
      setModalAberto(false);
    } else {
      toast.error("Erro... Não foi possível enviar sua proposta");
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col w-full max-w-sm">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center text-gray-400 dark:text-gray-300 text-sm font-semibold">
          Imagem do treino (em breve)
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h2 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{data.descricao}</h2>

          <div className="text-gray-600 dark:text-gray-300 text-sm">
            <span className="font-medium">Grupos Musculares:</span>{" "}
            {data.exercicios && data.exercicios.length > 0
              ? data.exercicios
                  .map(ex => ex.grupoMuscular)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(", ")
              : "-"}
          </div>

          <button
            className="mt-2 self-start px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => setModalAberto(true)}
          >
            Ver detalhes
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4">
            <button
              onClick={() => setModalAberto(false)}
              className="self-end text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white font-bold"
            >
              ✖ Fechar
            </button>

            {/* Espaço para imagem grande */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-300 text-sm font-semibold">
              Imagem principal do treino (em breve)
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.descricao}</h2>

            <div>
              <b>Data de início:</b> {new Date(data.dataInicio).toLocaleDateString()}<br />
              <b>Status:</b> {data.ativo ? "Ativo" : "Inativo"}
            </div>

            <div>
              <b>Exercícios:</b>
              <ul className="list-disc ml-6">
                {data.exercicios && data.exercicios.length > 0
                  ? data.exercicios.map((ex, idx) => (
                      <li key={idx}>
                        {ex.nome} ({ex.grupoMuscular}) - {ex.series}x{ex.repeticoes}
                      </li>
                    ))
                  : <li>Nenhum exercício cadastrado.</li>}
              </ul>
            </div>

            {usuario?.id ? (
              <form onSubmit={handleSubmit(enviaProposta)} className="flex flex-col gap-2">
                <input
                  type="text"
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                  value={`${usuario.nome} (${usuario.email})`}
                  disabled
                  readOnly
                />
                <textarea
                  id="message"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Diga o horário que você deseja e se tem alguma dúvida..."
                  required
                  {...register("descricao")}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg px-5 py-2.5 transition-colors disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar Proposta"}
                </button>
              </form>
            ) : (
              <div className="text-gray-800 dark:text-white text-sm">
                Gostaria de agendar um horário para fazer este treino? <br />
                <span className="font-bold">Faça login ou cadastre-se</span> para agendar.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

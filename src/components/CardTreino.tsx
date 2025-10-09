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
  const [expandido, setExpandido] = useState(false);
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
      setExpandido(false);
    } else {
      toast.error("Erro... Não foi possível enviar sua proposta");
    }
  }

  return (
    <div className="border rounded p-4 mb-4 shadow flex flex-col gap-2">
      <h2 className="font-bold text-lg mb-2">{data.descricao}</h2>
      <div>
        <span className="text-gray-600">Grupos Musculares: </span>
        <span>
          {data.exercicios && data.exercicios.length > 0
            ? data.exercicios.map(ex => ex.grupoMuscular).filter((v, i, a) => a.indexOf(v) === i).join(", ")
            : "-"}
        </span>
      </div>
      <button
  className="mt-2 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
        onClick={() => setExpandido(e => !e)}
      >
        {expandido ? "Fechar" : "Ver detalhes"}
      </button>
      {expandido && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded">
          <div className="mb-2">
            <b>Data de início:</b> {new Date(data.dataInicio).toLocaleDateString()}<br />
            <b>Status:</b> {data.ativo ? "Ativo" : "Inativo"}
          </div>
          <div className="mb-2">
            <b>Exercícios:</b>
            <ul className="list-disc ml-6">
              {data.exercicios && data.exercicios.length > 0 ? data.exercicios.map((ex, idx) => (
                <li key={idx}>{ex.nome} ({ex.grupoMuscular}) - {ex.series}x{ex.repeticoes}</li>
              )) : <li>Nenhum exercício cadastrado.</li>}
            </ul>
          </div>
          {usuario?.id ? (
            <form onSubmit={handleSubmit(enviaProposta)} className="mt-4">
              <input type="text" className="mb-2 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-red-500 dark:focus:border-red-500" value={`${usuario.nome} (${usuario.email})`} disabled readOnly />
              <textarea id="message" className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                placeholder="Diga o horário que você deseja e se tem alguma dúvida..."
                required
                {...register("descricao")}
              />
              <button type="submit" disabled={loading} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                {loading ? "Enviando..." : "Enviar Proposta"}
              </button>
            </form>
          ) : (
            <h2 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
              Gostaria de agendar um horário para fazer este treino? <br />
              <span className="font-bold">Faça login ou cadastre-se</span> para agendar.
            </h2>
          )}
        </div>
      )}
    </div>
  );
}


import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUsuarioStore } from "./context/UsuarioContext";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  descricao: string;
};

export default function Detalhes() {
  const params = useParams();
  const [treino, setTreino] = useState<any>();
  const { usuario } = useUsuarioStore();
  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/treinos/${params.id}`);
      const dados = await response.json();
      setTreino(dados);
    }
    buscaDados();
  }, [params.id]);

  async function enviaProposta(data: Inputs) {
    if (!usuario?.id) {
      toast.error("Você precisa estar logado para enviar uma proposta.");
      return;
    }
    const response = await fetch(`${apiUrl}/proposta`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        usuarioId: usuario.id,
        treinoId: treino.id,
        descricao: data.descricao
      })
    });

    if (response.status === 201) {
      toast.success("Obrigado. Sua proposta foi enviada ao instrutor. Aguarde retorno por e-mail.");
      reset();
    } else {
      toast.error("Erro... Não foi possível enviar sua proposta");
    }
  }

  if (!treino) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {treino.descricao}
        </h5>
        <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Data de início: {new Date(treino.dataInicio).toLocaleDateString()}
        </h5>
        <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Status: {treino.ativo ? "Ativo" : "Inativo"}
        </h5>
        <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          <b>Exercícios:</b>
          <ul className="list-disc ml-6">
            {treino.exercicios && treino.exercicios.length > 0 ? treino.exercicios.map((ex: any) => (
              <li key={ex.id}>{ex.nome} ({ex.grupoMuscular})</li>
            )) : <li>Nenhum exercício cadastrado.</li>}
          </ul>
        </div>
        {usuario?.id ? (
          <>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Envie uma proposta para realizar este treino com o instrutor:
            </h3>
            <form onSubmit={handleSubmit(enviaProposta)}>
              <input type="text" className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={`${usuario.nome} (${usuario.email})`} disabled readOnly />
              <textarea id="message" className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Diga o horário que você deseja e se tem alguma dúvida..."
                required
                {...register("descricao")}
              />
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Enviar Proposta</button>
            </form>
          </>
        ) : (
          <h2 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Gostaria de agendar um horário para fazer este treino? <br />
            <span className="font-bold">Faça login ou cadastre-se</span> para agendar.
          </h2>
        )}
      </div>
    </section>
  );
}
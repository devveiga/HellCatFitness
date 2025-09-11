import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Propostas() {
    const [propostas, setPropostas] = useState<any[]>([]);
    const { cliente } = useClienteStore();

    useEffect(() => {
        async function buscaDados() {
            const response = await fetch(`${apiUrl}/propostas/${cliente.id}`);
            const dados = await response.json();
            setPropostas(dados);
        }
        buscaDados();
    }, []);

    function dataDMA(data: string) {
        const ano = data.substring(0, 4);
        const mes = data.substring(5, 7);
        const dia = data.substring(8, 10);
        return dia + "/" + mes + "/" + ano;
    }

    const propostasTable = propostas.map((proposta) => (
        <tr key={proposta.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <p><b>Treino: {proposta.treino?.descricao ?? "-"}</b></p>
                <p><i>Enviado em: {dataDMA(proposta.createdAt)}</i></p>
            </td>
            <td className="px-6 py-4">
                {proposta.treino ? (
                    <span>Data início: {dataDMA(proposta.treino.dataInicio)}</span>
                ) : null}
            </td>
            <td className="px-6 py-4">
                {proposta.descricao}
            </td>
            <td className="px-6 py-4">
                {proposta.resposta ? (
                    <>
                        <p><b>{proposta.resposta}</b></p>
                        <p><i>Respondido em: {dataDMA(proposta.updatedAt as string)}</i></p>
                    </>
                ) : (
                    <i>Aguardando...</i>
                )}
            </td>
        </tr>
    ));

    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
                Listagem de <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Minhas Propostas</span></h1>

            {propostas.length === 0 ? (
                <h2 className="mb-4 mt-10 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
                   &nbsp;&nbsp; Ah... Você ainda não fez propostas de treino!
                </h2>
            ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Treino</th>
                            <th scope="col" className="px-6 py-3">Data Início</th>
                            <th scope="col" className="px-6 py-3">Descrição</th>
                            <th scope="col" className="px-6 py-3">Resposta</th>
                        </tr>
                    </thead>
                    <tbody>{propostasTable}</tbody>
                </table>
            )}
        </section>
    );
}

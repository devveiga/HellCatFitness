import './AdminDashboard.css'
import { useEffect, useState } from "react";
import { VictoryPie, VictoryLabel } from "victory";

const apiUrl = import.meta.env.VITE_API_URL;

type geralDadosType = {
  usuarios: number;
  treinos: number;
  propostas: number;
};

type propostaType = {
  id: number;
  descricao: string;
  treino: {
    descricao: string;
  };
};

export default function AdminDashboard() {
  const [dados, setDados] = useState<geralDadosType>({} as geralDadosType);
  const [graficoData, setGraficoData] = useState<{ x: string; y: number }[]>([]);

  useEffect(() => {
    async function getDadosGerais() {
      const response = await fetch(`${apiUrl}/dashboard/gerais`);
      const dados = await response.json();
      setDados(dados);
    }

    async function getPropostas() {
      const response = await fetch(`${apiUrl}/proposta`);
      const propostas: propostaType[] = await response.json();

      // Agrupar propostas por treino
      const contagem: Record<string, number> = {};
      propostas.forEach((p) => {
        const treino = p.treino?.descricao || "Sem treino";
        contagem[treino] = (contagem[treino] || 0) + 1;
      });

      // Transformar no formato do VictoryPie
      const chartData = Object.entries(contagem).map(([x, y]) => ({ x, y }));
      setGraficoData(chartData);
    }

    getDadosGerais();
    getPropostas();
  }, []);

  return (
    <div className="container mt-24">
      <h2 className="text-3xl mb-4 font-bold">Visão Geral do Sistema</h2>

      <div className="w-2/3 flex justify-between mx-auto mb-5">
        <div className="border-blue-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-blue-100 text-blue-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-blue-900 dark:text-blue-300">
            {dados.usuarios}
          </span>
          <p className="font-bold mt-2 text-center">Nº Clientes</p>
        </div>
        <div className="border-red-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-red-100 text-red-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-red-900 dark:text-red-300">
            {dados.treinos}
          </span>
          <p className="font-bold mt-2 text-center">Nº Treinos Disponíveis</p>
        </div>
        <div className="border-green-600 border rounded p-6 w-1/3">
          <span className="bg-green-100 text-green-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-green-900 dark:text-green-300">
            {dados.propostas}
          </span>
          <p className="font-bold mt-2 text-center">Nº Propostas</p>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto mt-10">
  <h3 className="text-xl font-bold mb-4 text-center">Propostas por Treino</h3>
  {graficoData.length > 0 ? (
    <VictoryPie
  data={graficoData}
  colorScale="qualitative"
  innerRadius={30}        // rosquinha menor
  labels={({ datum }) => `${datum.x}: ${datum.y}`}
  labelComponent={<VictoryLabel angle={0} />}
  width={250}             // largura maior para não cortar labels
  height={250}            // altura maior
  padAngle={2}            // separação entre fatias
/>
  ) : (
    <p className="text-center">Carregando gráfico...</p>
  )}
</div>

    </div>
  );
}

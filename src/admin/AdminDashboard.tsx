import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";

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
  const [usuariosMes, setUsuariosMes] = useState<{ x: string; y: number }[]>([]);

  useEffect(() => {
    async function getDadosGerais() {
      const response = await fetch(`${apiUrl}/dashboard/gerais`);
      const dados = await response.json();
      setDados(dados);
    }

    async function getPropostas() {
      const response = await fetch(`${apiUrl}/proposta`);
      const propostas: propostaType[] = await response.json();

      const contagem: Record<string, number> = {};
      propostas.forEach((p) => {
        const treino = p.treino?.descricao || "Sem treino";
        contagem[treino] = (contagem[treino] || 0) + 1;
      });

      const chartData = Object.entries(contagem).map(([x, y]) => ({ x, y }));
      setGraficoData(chartData);
    }

    async function getUsuariosPorMes() {
      const response = await fetch(`${apiUrl}/dashboard/usuarios-por-mes`);
      const data = await response.json();

      const formatado = data.map((d: any) => ({
        x: d.mes,
        y: d.qtd,
      }));
      setUsuariosMes(formatado);
    }

    getDadosGerais();
    getPropostas();
    getUsuariosPorMes();
  }, []);

  return (
    <div className="container mt-24">
      <h2 className="text-3xl mb-4 font-bold">Visão Geral do Sistema</h2>

      {/* Caixas de resumo */}
      <div className="w-2/3 flex justify-between mx-auto mb-5">
        <div className="border-blue-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-blue-100 text-blue-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.usuarios}
          </span>
          <p className="font-bold mt-2 text-center">Nº Clientes</p>
        </div>
        <div className="border-red-600 border rounded p-6 w-1/3 me-3">
          <span className="bg-red-100 text-red-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.treinos}
          </span>
          <p className="font-bold mt-2 text-center">Nº Treinos Disponíveis</p>
        </div>
        <div className="border-green-600 border rounded p-6 w-1/3">
          <span className="bg-green-100 text-green-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.propostas}
          </span>
          <p className="font-bold mt-2 text-center">Nº Propostas</p>
        </div>
      </div>

      {/* Gráfico de Propostas */}
      <div className="w-full max-w-sm mx-auto mt-10 flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4 text-center">Propostas por Treino</h3>

        {graficoData.length > 0 ? (
          <VictoryPie
            data={graficoData}
            colorScale={[
              "#2563EB",
              "#DC2626",
              "#16A34A",
              "#F59E0B",
              "#9333EA",
              "#0EA5E9",
            ]}
            padAngle={0}
            cornerRadius={0}
            innerRadius={0}
            labels={({ datum }) => `${datum.x}\n(${datum.y})`}
            labelRadius={({ radius }) => (Number(radius) || 100) + 15}
            style={{
              labels: {
                fontSize: 11,
                fill: "black",
                fontWeight: 900,
                textAnchor: "middle",
              },
            }}
            width={260}
            height={240}
          />
        ) : (
          <p className="text-center">Carregando gráfico...</p>
        )}
      </div>

      {/* 📊 Novo gráfico de crescimento */}
      <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4 text-center">Crescimento de Cadastros (por Mês)</h3>
        {usuariosMes.length > 0 ? (
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={20}
            height={300}
            width={600}
          >
            <VictoryAxis
              tickFormat={(t) => {
                const [ano, mes] = t.split("-");
                return `${mes}/${ano}`;
              }}
              style={{ tickLabels: { fontSize: 10, angle: -30 } }}
            />
            <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
            <VictoryBar
              data={usuariosMes}
              x="x"
              y="y"
              style={{
                data: {
                  fill: "#2563EB",
                  width: 25,
                  stroke: "#1E3A8A",
                  strokeWidth: 1,
                },
              }}
              animate={{
                duration: 800,
                onLoad: { duration: 500 },
              }}
            />
          </VictoryChart>
        ) : (
          <p className="text-center">Carregando gráfico...</p>
        )}
      </div>
    </div>
  );
}

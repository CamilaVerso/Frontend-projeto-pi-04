import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import RiskIndicator from './RiskIndicator';

interface SinaisVitaisData {
  timestamp: string;
  batimentos: number;
  oxigenacao: number;
  pressao_sistolica: number;
  pressao_diastolica: number;
}

interface DashboardProps {
  cpf: string;
}

const Dashboard: React.FC<DashboardProps> = ({ cpf }) => {
  const [dados, setDados] = useState<SinaisVitaisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      if (!cpf) return;
      
      try {
        const response = await api.get(`/api/sinais-vitais/${cpf}`);
        
        // Tratamento dos dados para garantir que o gráfico apareça
        const dadosFormatados = response.data.map((d: any) => {
          // Se o timestamp vier completo (Data Hora), pegamos apenas a Hora
          const horaSomente = d.timestamp && d.timestamp.includes(' ') 
            ? d.timestamp.split(' ')[1] 
            : d.timestamp;

          return {
            ...d,
            timestamp: horaSomente
          };
        });

        setDados(dadosFormatados);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard", err);
        setError("Não foi possível carregar os dados de monitoramento.");
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
    const intervalId = setInterval(fetchDados, 10000); // Atualiza a cada 10 segundos
    return () => clearInterval(intervalId);
  }, [cpf]);

  if (loading) return <p className="text-center p-4">A carregar dados do monitoramento...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-center text-[#1a5276] mb-6">Dashboard de Monitoramento</h2>
      
      <div className="mb-8">
        <RiskIndicator cpf={cpf} />
      </div>

      {dados.length > 0 ? (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="batimentos" name="Batimentos (BPM)" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="oxigenacao" name="Oxigenação (SpO2 %)" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="pressao_sistolica" name="P. Sistólica" stroke="#ffc658" strokeWidth={2} />
              <Line type="monotone" dataKey="pressao_diastolica" name="P. Diastólica" stroke="#ff8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center p-10 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">Nenhum dado recebido do Arduino/Simulador ainda.</p>
          <p className="text-sm text-gray-400">Ligue o simulador para começar a ver os gráficos.</p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;

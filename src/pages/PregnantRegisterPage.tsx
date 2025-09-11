import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import WeeksCalculator from '../components/WeeksCalculator';
import PrenatalSchedule from '../components/PrenatalSchedule';
import axios from 'axios';

interface IGestante {
  id: number;
  cpf: string;
  nome: string;
  data_nascimento: string;
  idade: number;
  nome_mae: string;
  data_prevista_parto: string;
  ultima_menstruacao: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  telefone: string;
}

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-2xl font-bold text-center text-[#1a5276] mb-6">{title}</h2>
);

function SearchByCpf() {
  const [cpf, setCpf] = useState('');
  const [gestante, setGestante] = useState<IGestante | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const aplicarMascaraCPF = (value: string) => {
    return value
      .replace(/\D/g, '') 
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') 
      .substring(0, 14); 
  };

  const formatarData = (dataString: string) => {    
    if (!dataString) return '';
      const [ano, mes, dia] = dataString.split('-');    
      return `${dia}/${mes}/${ano}`;
  };

  const handleSearch = async () => {
    if (!cpf) return;
    const cpfApenasNumeros = cpf.replace(/\D/g, '');
    if (cpfApenasNumeros.length !== 11) {
      setError('CPF inválido. Por favor, digite 11 números.');
      return;
    }

    setLoading(true);
    setError('');
    setGestante(null);
    try {
      const response = await api.get<IGestante>(`/api/gestantes/${cpfApenasNumeros}`);
      setGestante(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Gestante não encontrada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <SectionTitle title="Buscar Cadastro por CPF" />
      <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
        <input
          type="text"
          value={cpf}
        
          onChange={(e) => setCpf(aplicarMascaraCPF(e.target.value))}
          placeholder="Digite o CPF para buscar"
          className="flex-grow w-full p-2 border border-gray-300 rounded"
        />
        <button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto bg-[#1a5276] text-white py-2 px-4 rounded hover:bg-[#0e3040] transition-colors disabled:bg-gray-400">
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      <div className="mt-4 text-left max-w-md mx-auto min-h-[7rem]">
        {error && <p className="text-red-500">{error}</p>}
        {gestante && (
          <div className="space-y-1 p-4 bg-gray-50 rounded">
            <p><strong>Nome:</strong> {gestante.nome}</p>
            <p><strong>CPF:</strong> {aplicarMascaraCPF(gestante.cpf)}</p>
            <p><strong>Data de Nascimento:</strong> {formatarData(gestante.data_nascimento)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function RegistrationForm() {
  const initialFormState = {
    cpf: '', nome: '', data_nascimento: '', idade: '', nome_mae: '', data_prevista_parto: '', ultima_menstruacao: '',
    endereco: '', cep: '', cidade: '', estado: '', telefone: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  
  const labels: Record<string, string> = {
    cpf: 'CPF',
    nome: 'Nome',
    data_nascimento: 'Data de Nascimento',
    idade: 'Idade',
    nome_mae: 'Nome da Mãe',
    data_prevista_parto: 'Data Prevista do Parto',
    ultima_menstruacao: 'Última Menstruação',
    endereco: 'Endereço',
    cep: 'CEP',
    cidade: 'Cidade',
    estado: 'Estado',
    telefone: 'Telefone',
  };

 
  const dateFields = ['data_nascimento', 'data_prevista_parto', 'ultima_menstruacao'];

  const aplicarMascaraCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valorProcessado = name === 'cpf' ? aplicarMascaraCPF(value) : value;
    setFormData(prev => ({ ...prev, [name]: valorProcessado }));
  };

  useEffect(() => {
    if (formData.data_nascimento) {
      const birthDate = new Date(formData.data_nascimento);
      const today = new Date();
      if (!isNaN(birthDate.getTime())) { // Verifica se a data é válida
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setFormData(prev => ({ ...prev, idade: age >= 0 ? age.toString() : '' }));
      }
    }
  }, [formData.data_nascimento]);

  const handleCepSearch = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!data.erro) {
          setFormData(prev => ({ ...prev, endereco: data.logradouro, cidade: data.localidade, estado: data.uf }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await api.post('/api/gestantes', formData);
      setMessage({ type: 'success', text: 'Gestante cadastrada com sucesso!' });
      setFormData(initialFormState);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage({ type: 'error', text: error.response.data.error || 'Erro ao cadastrar gestante.' });
      } else {
        setMessage({ type: 'error', text: 'Erro de conexão.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <SectionTitle title="Cadastro de Gestantes" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            
            <label htmlFor={key} className="mb-1 font-semibold text-gray-700">
              {labels[key]}:
            </label>
            <input
             
              type={dateFields.includes(key) ? 'date' : 'text'}
              id={key}
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              onBlur={key === 'cep' ? handleCepSearch : undefined}
              readOnly={key === 'idade'}
              required={key !== 'idade'}
              className="p-2 border border-gray-300 rounded bg-gray-50 read-only:bg-gray-200"
            />
          </div>
        ))}
        <div className="md:col-span-2 text-center">
          <button type="submit" disabled={isLoading} className="bg-[#1a5276] text-white py-2 px-6 rounded hover:bg-[#0e3040] transition-colors font-bold disabled:bg-gray-400">
            {isLoading ? 'Registrando...' : 'REGISTRAR'}
          </button>
        </div>
      </form>
      {message && (
        <p className={`mt-4 text-center font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </section>
  );
}

function PregnantRegisterPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-[#1a5276]">Rede Cegonha</h1>
        <p className="text-lg text-gray-600">Voando na Cidade de Suzano</p>
      </header>
      
      <SearchByCpf />
      <RegistrationForm />
      <WeeksCalculator />
      <PrenatalSchedule />
    </div>
  );
}

export default PregnantRegisterPage;
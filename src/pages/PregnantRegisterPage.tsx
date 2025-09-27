import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import axios from 'axios';
import PrenatalSchedule from '../components/PrenatalSchedule';
import WeeksCalculator from '../components/WeeksCalculator';


type CellStatus = 'pending' | 'completed' | 'upcoming';

interface CellData {
  text: string;
  status: CellStatus;
}

interface RowData {
  week: string;
  cells: CellData[];
}

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
  cronograma: RowData[] | null;
}

const initialFormState: Omit<IGestante, 'id' | 'cronograma' | 'idade'> & { idade: string } = {
  cpf: '', nome: '', data_nascimento: '', idade: '', nome_mae: '', data_prevista_parto: '', ultima_menstruacao: '',
  endereco: '', cep: '', cidade: '', estado: '', telefone: ''
};

const initialScheduleData: RowData[] = [
  { week: 'Até 6 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: 'Até 28 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: 'De 29 a 35 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: 'Após 36 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: 'A cada Trimestre', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '11 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '12 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '20 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '24 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '25 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '28 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '32 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
  { week: '35 semanas', cells: Array(10).fill(null).map(() => ({ text: '', status: 'upcoming' })) },
];

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-2xl font-bold text-center text-[#1a5276] mb-6">{title}</h2>
);

interface SearchByCpfProps {
    onGestanteFound: (gestante: IGestante) => void;
    onClear: () => void;
    gestanteEncontrada: IGestante | null;
}

function SearchByCpf({ onGestanteFound, onClear, gestanteEncontrada }: SearchByCpfProps) {
    const [cpf, setCpf] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const aplicarMascaraCPF = (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
    const formatarData = (dataString: string) => {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    useEffect(() => {
        if(cpf) setError('');
    }, [cpf]);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorFormatado = aplicarMascaraCPF(e.target.value);
        setCpf(valorFormatado);
        if (valorFormatado === '') {
            setError('');
            onClear(); 
        }
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
        try {
            const response = await api.get<IGestante>(`/api/gestantes/${cpfApenasNumeros}`);
            onGestanteFound(response.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Gestante não encontrada.');
            onClear();
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <SectionTitle title="Buscar ou Limpar Cadastro" />
            <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
                <input type="text" value={cpf} onChange={handleCpfChange} placeholder="Digite o CPF para buscar" className="flex-grow w-full p-2 border border-gray-300 rounded" />
                <button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto bg-[#1a5276] text-white py-2 px-4 rounded hover:bg-[#0e3040] transition-colors disabled:bg-gray-400">
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
             
            <div className="mt-4 text-left max-w-md mx-auto min-h-[7rem]">
                {error && <p className="text-red-500 font-semibold">{error}</p>}
                {gestanteEncontrada && (
                    <div className="space-y-1 p-4 bg-gray-50 rounded border border-gray-200">
                        <p><strong>Nome:</strong> {gestanteEncontrada.nome}</p>
                        <p><strong>CPF:</strong> {aplicarMascaraCPF(gestanteEncontrada.cpf)}</p>
                        <p><strong>Data de Nascimento:</strong> {formatarData(gestanteEncontrada.data_nascimento)}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

interface RegistrationFormProps {
    formData: typeof initialFormState;
    setFormData: React.Dispatch<React.SetStateAction<typeof initialFormState>>;
}

function RegistrationForm({ formData, setFormData }: RegistrationFormProps) {
    const aplicarMascaraCPF = (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
    const labels: Record<string, string> = { cpf: 'CPF', nome: 'Nome', data_nascimento: 'Data de Nascimento', idade: 'Idade', nome_mae: 'Nome da Mãe', data_prevista_parto: 'Data Prevista do Parto', ultima_menstruacao: 'Última Menstruação', endereco: 'Endereço', cep: 'CEP', cidade: 'Cidade', estado: 'Estado', telefone: 'Telefone' };
    const dateFields = ['data_nascimento', 'data_prevista_parto', 'ultima_menstruacao'];
    const fieldOrder: (keyof typeof formData)[] = [
        'cpf',
        'nome',
        'data_nascimento',
        'idade',
        'nome_mae',
        'data_prevista_parto',
        'ultima_menstruacao',
        'cep',
        'endereco',
        'cidade',
        'estado',
        'telefone'
    ];
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const valorProcessado = name === 'cpf' ? aplicarMascaraCPF(value) : value;
        setFormData(prev => ({ ...prev, [name]: valorProcessado }));
    };

    useEffect(() => {
        if (formData.data_nascimento) {
            const birthDate = new Date(formData.data_nascimento);
            const today = new Date();
            if (!isNaN(birthDate.getTime())) {
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
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

    return (
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <SectionTitle title="Cadastro de Gestantes" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldOrder.map((key) => (
                    <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="mb-1 font-semibold text-gray-700">
                            {labels[key]}:
                        </label>
                        <input
                            type={dateFields.includes(key) ? 'date' : 'text'}
                            id={key}
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            onBlur={key === 'cep' ? handleCepSearch : undefined}
                            readOnly={key === 'idade'}
                            required={key !== 'idade'}
                            className="p-2 border border-gray-300 rounded bg-gray-50 read-only:bg-gray-200"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

function PregnantRegisterPage() {
    const [formData, setFormData] = useState(initialFormState);
    const [scheduleData, setScheduleData] = useState<RowData[]>(initialScheduleData);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCpf, setCurrentCpf] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isUpdating, setIsUpdating] = useState(false); 

    const onGestanteFound = (gestante: IGestante) => {
        const { cronograma, ...restOfData } = gestante;
        setFormData({ ...initialFormState, ...restOfData });
        setScheduleData(cronograma || initialScheduleData);
        setIsEditing(true);
        setCurrentCpf(gestante.cpf);
        setMessage(null);
    };

    const handleClear = () => {
        setFormData(initialFormState);
        setScheduleData(initialScheduleData);
        setIsEditing(false);
        setCurrentCpf('');
        setMessage(null);
    };

    const handleUpdate = async () => {
    setMessage(null);
    setIsUpdating(true); 

    try {
      await api.put(`/api/gestantes/${currentCpf}`, { cronograma: scheduleData });
      setMessage({ type: 'success', text: 'Alterações registradas com sucesso!' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar o cronograma.' });
    } finally {
      setIsUpdating(false);
    }
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await api.post('/api/gestantes', { ...formData, cronograma: scheduleData });
            setMessage({ type: 'success', text: 'Gestante cadastrada com sucesso!' });
            handleClear();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) setMessage({ type: 'error', text: error.response.data.error || 'Erro.' });
            else setMessage({ type: 'error', text: 'Erro de conexão.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <header className="text-center">
                <h1 className="text-4xl font-bold text-[#1a5276]">Rede Cegonha</h1>
                <p className="text-lg text-gray-600">Voando na Cidade de Suzano</p>
            </header>
            
           <SearchByCpf 
                onGestanteFound={onGestanteFound} 
                onClear={handleClear} 
                gestanteEncontrada={isEditing ? formData : null}
            />
            {!isEditing ? (
                 <form onSubmit={handleSubmit}>
                    <RegistrationForm formData={formData} setFormData={setFormData} />
                    <WeeksCalculator/>
                    <PrenatalSchedule scheduleData={scheduleData} setScheduleData={setScheduleData} />

                    <div className="text-center mt-4">
                        <button type="submit" disabled={isLoading} className="w-full max-w-sm bg-[#1a5276] text-white font-bold text-base py-3 px-8 rounded hover:bg-[#0e3040] transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Registrando...' : 'Registrar Gestante'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <SectionTitle title={`Editando Cronograma de ${formData.nome}`} />
                    <PrenatalSchedule scheduleData={scheduleData} setScheduleData={setScheduleData} />
                    <div className="text-center mt-6">
                        <button 
                            onClick={handleUpdate} 
                            disabled={isUpdating}
                            className="bg-[#1a5276] text-white py-2 px-6 rounded hover:bg-[#0e3040] transition-colors font-bold disabled:bg-gray-400"
                        >
                            {isUpdating ? 'Salvando...' : 'Salvar Alterações no Cronograma'}
                        </button>
                    </div>
                    {message && (
                        <p className={`mt-4 text-center font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default PregnantRegisterPage;
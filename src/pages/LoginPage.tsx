/**import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const { login } = useAuth();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ username, password });
    alert('Tentativa de login!');
  };

  return (
  
    <div className="max-w-3xl mx-auto p-5 text-center">
      
     
      <div className="mt-[50px]">

     
        <h2 className="text-[#1a5276] text-2xl font-bold mb-5">
          Página de Login
        </h2>
        
       
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-5 rounded-lg shadow-md inline-block w-full max-w-sm text-left"
        >
          
          <div className="mb-5">
          
            <label htmlFor="username" className="font-bold text-sm text-[#333]">
              Usuário:
            </label>
            
            <input
              type="text"
              id="username"
              className="w-full p-2 mt-1 border border-gray-300 rounded text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-5">
            <label htmlFor="password" className="font-bold text-sm text-[#333]">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          
          <button 
            type="submit" 
            className="w-full bg-[#1a5276] text-white border-none rounded py-2.5 px-4 cursor-pointer text-base hover:bg-[#0e3040] transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;**/

// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios'; // Importa o axios

function LoginPage() {
  // --- Gerenciamento de Estado ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Hooks para Navegação e Autenticação ---
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setIsLoading(true);
  setError('');
  console.log('--- 1. Formulário enviado. Iniciando a chamada à API... ---');

  try {
    const payload = {
      username: username,
      password: password,
    };

    const response = await axios.post('http://localhost:5000/api/login', payload, {
      withCredentials: true,
    });

    // A partir daqui, executamos a lógica de sucesso
    console.log('--- 2. API respondeu com SUCESSO! ---', response.data);

    console.log('--- 3. Chamando a função login() do AuthContext... ---');
    login(); // Ação de login (executada uma vez)

     console.log('--- 4. AGENDANDO o redirecionamento para a página principal ("/") ---');
    setTimeout(() => {
      console.log('--- 4.1 EXECUTANDO o redirecionamento agora! ---');
      navigate('/register');
    }, 50); // Um pequeno atraso de 50 milissegundos

  } catch (err) {
    console.error('--- ERRO: A chamada à API falhou. ---', err);
    if (axios.isAxiosError(err) && err.response) {
      setError(err.response.data.error || 'Ocorreu um erro.');
    } else {
      setError('Não foi possível conectar ao servidor.');
    }
  } finally {
    console.log('--- 5. Finalizando o processo de login. ---');
    setIsLoading(false);
  }
};

  return (
    // Seu JSX para o container principal...
    <div className="max-w-3xl mx-auto p-5 text-center">
      <div className="mt-[50px]">
        <h2 className="text-[#1a5276] text-2xl font-bold mb-5">
          Página de Login
        </h2>
        
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-5 rounded-lg shadow-md inline-block w-full max-w-sm text-left"
        >
          {/* Campo de Usuário */}
          <div className="mb-5">
            <label htmlFor="username" className="font-bold text-sm text-[#333]">
              Usuário:
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 mt-1 border border-gray-300 rounded text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading} // Desabilita o campo durante o carregamento
            />
          </div>
          
          {/* Campo de Senha */}
          <div className="mb-5">
            <label htmlFor="password" className="font-bold text-sm text-[#333]">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading} // Desabilita o campo durante o carregamento
            />
          </div>
          
          {/* Botão de Envio (com lógica de carregamento) */}
          <button 
            type="submit" 
            className="w-full bg-[#1a5276] text-white border-none rounded py-2.5 px-4 cursor-pointer text-base hover:bg-[#0e3040] transition-colors disabled:bg-gray-400"
            disabled={isLoading} // Desabilita o botão durante o carregamento
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Exibição da Mensagem de Erro */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
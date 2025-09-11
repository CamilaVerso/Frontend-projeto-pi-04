/**import React, { createContext, useState, useContext, type ReactNode } from 'react';


interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}**/

// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // <-- NOVO ESTADO
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // <-- Inicia como true

  // Este useEffect roda uma vez quando o app carrega
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Tenta acessar a rota de status protegida
        await axios.get('http://localhost:5000/api/status', {
          withCredentials: true,
        });
        // Se a chamada for bem-sucedida (não deu erro 401), o usuário tem uma sessão válida
        setIsAuthenticated(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Se der erro (ex: 401), o usuário não está logado
        setIsAuthenticated(false);
      } finally {
        // Independentemente do resultado, a verificação inicial terminou
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    // Adicionar chamada à API de logout aqui seria uma boa prática
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// O hook useAuth continua igual
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
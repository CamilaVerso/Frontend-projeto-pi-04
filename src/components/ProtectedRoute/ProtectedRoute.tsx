import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { JSX } from 'react';

/**function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth(); 

  if (!isAuthenticated) {
 
    return <Navigate to="/login" replace />;
  }

  return children;**/
  function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth(); // Pega os dois estados do contexto

  // 1. Se ainda estivermos verificando o status do login, mostre uma tela de carregamento
  if (isLoading) {
    return <div>Carregando...</div>; // Ou um componente de Spinner/Loading
  }

  // 2. Se a verificação terminou E o usuário NÃO está autenticado, redirecione
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se a verificação terminou E o usuário ESTÁ autenticado, mostre a página
  return children;
}

export default ProtectedRoute;
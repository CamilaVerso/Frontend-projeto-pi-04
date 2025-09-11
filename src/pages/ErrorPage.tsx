import React from 'react';
import { Link } from 'react-router-dom'; 


interface ErrorPageProps {
  message: string; 
  backLink?: string; 
  backLinkText?: string; 
}

function ErrorPage({
  message,
  backLink = '/', 
  backLinkText = 'Voltar para o Início' 
}: ErrorPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center max-w-md">
        <div className="text-6xl text-red-500 mb-4">
          &#x26A0; 
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Ocorreu um Erro
        </h1>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <Link 
          to={backLink}
          className="inline-block bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
        >
          {backLinkText}
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
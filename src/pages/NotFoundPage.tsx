import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { APP_ROUTES, COLORS } from '@/constants';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-6 py-24">
      <svg className="w-32 h-32 text-orange-energia mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 17.75V17.75M12 6V6" />
      </svg>
      <h1 className="text-6xl font-extrabold text-grafite-profundo mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-grafite-profundo mb-3">Página Não Encontrada</h2>
      <p className="text-lg text-cinza-neutro mb-8 max-w-md">
        Oops! Parece que a página que você está procurando não existe ou foi movida.
      </p>
      <Link to={APP_ROUTES.HOME}>
        <Button variant="primary" size="lg">
          Voltar para a Página Inicial
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;

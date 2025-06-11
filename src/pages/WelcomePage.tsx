import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { APP_NAME, APP_SLOGAN, APP_ROUTES, COLORS } from '@/constants';

const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-8">
      <header className="mb-12">
        <Logo size={120} className="mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-grafite-profundo mb-3">
          Bem-vindo ao <span style={{ color: COLORS.ORANGE_ENERGIA }}>{APP_NAME}</span>!
        </h1>
        <p className="text-xl text-cinza-neutro">{APP_SLOGAN}</p>
      </header>

      <section className="mb-12 max-w-2xl">
        <p className="text-lg text-grafite-profundo mb-8">
          Precisa de um profissional qualificado? Ou você é um prestador de serviços buscando novos clientes? Você está no lugar certo! {APP_NAME} simplifica essa conexão.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        <Link to={APP_ROUTES.LOGIN} className="w-full">
          <Button variant="primary" size="lg" fullWidth>
            Entrar
          </Button>
        </Link>
        <Link to={APP_ROUTES.REGISTER} className="w-full">
          <Button variant="secondary" size="lg" fullWidth>
            Registrar
          </Button>
        </Link>
      </div>

      <section className="mt-16 text-left max-w-3xl w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-grafite-profundo mb-4">Como Funciona?</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-orange-energia">Para Clientes:</h3>
            <p className="text-grafite-profundo">Busque por categoria, leia avaliações e contate os melhores profissionais da sua região de forma rápida e segura.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-energia">Para Prestadores:</h3>
            <p className="text-grafite-profundo">Crie seu perfil, destaque suas especialidades e alcance milhares de clientes potenciais. Gerencie seus serviços e reputação em um só lugar.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;

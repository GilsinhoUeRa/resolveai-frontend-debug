import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES, APP_NAME, COLORS } from '@/constants';
import Logo from '@/components/Logo';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || APP_ROUTES.HOME;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.message || 'Falha ao fazer login. Verifique suas credenciais.'
      );
    }
  };
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <Logo size={60} className="mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-grafite-profundo">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-cinza-neutro">
            Ou{' '}
            <Link
              to={APP_ROUTES.REGISTER}
              className="font-medium text-orange-energia hover:text-opacity-80"
            >
              crie uma nova conta aqui
            </Link>
			
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <Input
            label="Endereço de e-mail"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error && error.includes('email') ? error : undefined}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={
              error &&
              (error.includes('senha') || error.includes('credenciais'))
                ? error
                : undefined
            }
          />

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-orange-energia focus:ring-orange-energia border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900"> Lembrar de mim </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-energia hover:text-opacity-80"> Esqueceu sua senha? </a>
            </div>
          </div> */}

          {error &&
            !error.includes('email') &&
            !error.includes('senha') &&
            !error.includes('credenciais') && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

          <div>
            <Button
              type="submit"
              isLoading={loading}
              fullWidth
              variant="primary"
              size="lg"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-xs text-cinza-neutro">
          Ao continuar, você concorda com nossos{' '}
          <Link
            to={APP_ROUTES.TERMS_OF_SERVICE}
            className="underline hover:text-orange-energia"
          >
            Termos de Serviço
          </Link>{' '}
          e{' '}
          <Link
            to={APP_ROUTES.PRIVACY_POLICY}
            className="underline hover:text-orange-energia"
          >
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

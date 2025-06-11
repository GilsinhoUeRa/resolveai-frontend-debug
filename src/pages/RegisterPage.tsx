
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types';
import { APP_ROUTES, APP_NAME, COLORS } from '@/constants';
import Logo from '@/components/Logo';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.CLIENT);
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name || !email || !password || !confirmPassword || !city) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await register({ name, email, password, confirmPassword, userType, city });
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        if (userType === UserType.PROVIDER) {
          navigate(APP_ROUTES.PROVIDER_REGISTER);
        } else {
          navigate(APP_ROUTES.HOME);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar. Tente novamente.');
    }
  };

  const userTypeOptions = [
    { value: UserType.CLIENT, label: 'Sou Cliente (buscando serviços)' },
    { value: UserType.PROVIDER, label: 'Sou Prestador (oferecendo serviços)' },
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <Logo size={60} className="mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-grafite-profundo">
            Crie sua conta no {APP_NAME}
          </h2>
          <p className="mt-2 text-sm text-cinza-neutro">
            Já tem uma conta?{' '}
            <Link to={APP_ROUTES.LOGIN} className="font-medium text-orange-energia hover:text-opacity-80">
              Faça login aqui
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <Input
            label="Nome Completo"
            name="name"
            type="text"
            required
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Endereço de e-mail"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            required
            placeholder="Crie uma senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirme sua Senha"
            name="confirmPassword"
            type="password"
            required
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Select
            label="Tipo de Conta"
            name="userType"
            options={userTypeOptions}
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            required
          />
          <Input
            label="Sua Cidade"
            name="city"
            type="text"
            required
            placeholder="Ex: São Paulo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {successMessage && <p className="text-sm text-green-600 text-center">{successMessage}</p>}

          <div>
            <Button type="submit" isLoading={loading} fullWidth variant="primary" size="lg">
              {loading ? 'Registrando...' : 'Criar Conta'}
            </Button>
          </div>
        </form>
         <p className="mt-6 text-center text-xs text-cinza-neutro">
          Ao criar sua conta, você concorda com nossos{' '}
          <Link to={APP_ROUTES.TERMS_OF_SERVICE} className="underline hover:text-orange-energia">
            Termos de Serviço
          </Link>{' '}
          e{' '}
          <Link to={APP_ROUTES.PRIVACY_POLICY} className="underline hover:text-orange-energia">
            Política de Privacidade
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
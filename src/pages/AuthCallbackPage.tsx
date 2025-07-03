// src/pages/AuthCallbackPage.tsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth(); // Assumindo que você expôs 'setToken' no seu AuthContext

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token); // Guarda o token
      navigate(APP_ROUTES.HOME, { replace: true }); // Redireciona para a home
    } else {
      // Se não houver token, redireciona para o login com um erro
      navigate(APP_ROUTES.LOGIN, { replace: true });
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">A autenticar...</p>
    </div>
  );
};

export default AuthCallbackPage;
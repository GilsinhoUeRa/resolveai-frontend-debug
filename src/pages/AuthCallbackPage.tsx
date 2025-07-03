// src/pages/AuthCallbackPage.tsx (Versão Corrigida)

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthHook'; // <-- CORREÇÃO APLICADA AQUI
import { APP_ROUTES } from '@/constants';

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Esta linha agora funcionará corretamente
  const { setToken } = useAuth(); 

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token); // Guarda o token
      navigate(APP_ROUTES.HOME, { replace: true }); // Redireciona para a home
    } else {
      // Se não houver token, redireciona para o login com um erro
      navigate(`${APP_ROUTES.LOGIN}?error=auth_failed`, { replace: true });
    }
  }, [searchParams, setToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">A autenticar...</p>
    </div>
  );
};

export default AuthCallbackPage;
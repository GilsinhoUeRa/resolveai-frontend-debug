// src/pages/AuthCallbackPage.tsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    // 1. Extrai o token do parâmetro da URL
    const token = searchParams.get('token');

    if (token) {
      // 2. Guarda o token no estado global (que o guardará no localStorage)
      setToken(token);
      // 3. Redireciona o utilizador para a página principal da aplicação
      navigate(APP_ROUTES.HOME, { replace: true });
    } else {
      // Se não houver token, redireciona para a página de login com um erro
      navigate(`${APP_ROUTES.LOGIN}?error=auth_failed`, { replace: true });
    }
  }, [searchParams, setToken, navigate]);

  // Renderiza uma mensagem de "a carregar" enquanto o processo acontece
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">A autenticar...</p>
    </div>
  );
};

export default AuthCallbackPage;
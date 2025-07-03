// src/pages/LoginPage.tsx (Versão Final com Login com Google)
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Componentes e Hooks
import Input from '@/components/Input';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { APP_ROUTES, APP_NAME } from '@/constants';

// Ícone do Google (SVG como um componente React)
const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.4 8 244 8c66.8 0 126 21.6 174.3 58.9l-67.2 67.2C324.5 98.8 287.3 80 244 80c-82.6 0-150.3 67.4-150.3 150.3S161.4 432 244 432c49.4 0 92.3-22.5 121.1-57.8l67.2 67.2C402.2 472.3 328.6 512 244 512zM244 244c0-22.1 17.9-40 40-40s40 17.9 40 40-17.9 40-40 40-40-17.9-40-40z"></path>
    </svg>
);


const LoginPage: React.FC = () => {
    // A sua lógica de formulário e hooks existentes permanece a mesma
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const from = location.state?.from?.pathname || APP_ROUTES.HOME;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            addToast('Por favor, preencha todos os campos.', 'error');
            return;
        }
        try {
            await login({ email, senha: password });
            navigate(from, { replace: true });
        } catch (err: any) {
            addToast(err.response?.data?.erro || 'Falha ao fazer login.', 'error');
        }
    };

    // --- NOVA FUNÇÃO PARA O LOGIN COM GOOGLE ---
    const handleGoogleLogin = () => {
        // Redireciona o navegador para o endpoint de autenticação do nosso backend.
        // O backend irá então redirecionar para o Google.
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
                <div className="text-center">
                    <Logo size={60} className="mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-grafite-profundo">Acesse sua conta</h2>
                    <p className="mt-2 text-sm text-cinza-neutro">
                        Ou{' '}
                        <Link to={APP_ROUTES.REGISTER} className="font-medium text-orange-energia hover:text-opacity-80">
                            crie uma nova conta aqui
                        </Link>
                    </p>
                </div>

                {/* --- BOTÃO DE LOGIN COM GOOGLE ADICIONADO --- */}
                <div className="mt-8">
                     <Button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        variant="secondary" 
                        fullWidth 
                        size="lg"
                    >
                        <GoogleIcon />
                        <span className="ml-3">Continuar com Google</span>
                    </Button>
                </div>
                
                {/* --- DIVISOR VISUAL --- */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-cinza-neutro">OU</span>
                    </div>
                </div>

                {/* --- FORMULÁRIO DE LOGIN TRADICIONAL --- */}
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <Input
                        label="Endereço de e-mail"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Senha"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div>
                        <Button type="submit" isLoading={loading} fullWidth variant="primary" size="lg">
                            {loading ? 'A entrar...' : 'Entrar com Email'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
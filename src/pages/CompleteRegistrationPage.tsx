// src/pages/CompleteRegistrationPage.tsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { registerSchema, RegisterFormData } from '@/validators/auth.schema';
import { registerApi } from '@/services/auth.api';
import { useToast } from '@/hooks/useToast';
import { RegisterData } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { APP_ROUTES } from '@/constants';

const CompleteRegistrationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const email = searchParams.get('email') || '';
    const name = searchParams.get('nome') || '';

    const { mutate: registerUser, isPending } = useMutation({
        mutationFn: registerApi,
        onSuccess: () => {
            addToast('Registo concluído com sucesso! Por favor, faça o login.', 'success');
            navigate(APP_ROUTES.LOGIN);
        },
        onError: (err: any) => addToast(err.response?.data?.erro || 'Falha ao completar o registo.', 'error'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name, email }
    });

    const onSubmit = (data: RegisterFormData) => {
        const apiPayload: RegisterData = {
            ...data,
            senha: data.password || 'google_user_temp_password',
        };
        registerUser(apiPayload);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Conclua o seu Registo</h2>
                <Input label="Nome Completo" {...register('name')} disabled />
                <Input label="Email" type="email" {...register('email')} disabled />
                <Input label="Cidade" error={errors.city?.message} {...register('city')} />
                <Input label="Documento (CPF/CNPJ)" error={errors.documento?.message} {...register('documento')} />
                {/* Adicione outros campos necessários aqui */}
                <Button type="submit" isLoading={isPending} fullWidth>
                    {isPending ? 'A finalizar...' : 'Concluir Registo'}
                </Button>
            </form>
        </div>
    );
};

export default CompleteRegistrationPage;
// src/pages/CompleteRegistrationPage.tsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { registerSchema, RegisterFormData } from '@/validators/auth.schema';
import { registerApi } from '@/services/auth.api';
import { useToast } from '@/hooks/useToast';
import { useViaCEP } from '@/hooks/useViaCEP';
import { UserType, RegisterData } from '@/types';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Logo from '@/components/Logo';
import { APP_ROUTES, APP_NAME } from '@/constants';

const CompleteRegistrationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    // 1. Extrai os dados pré-preenchidos do Google a partir do URL
    const email = searchParams.get('email') || '';
    const name = searchParams.get('nome') || '';

    const { mutate: registerUser, isPending: loading } = useMutation({
        mutationFn: registerApi,
        onSuccess: () => {
            addToast('Registo concluído com sucesso! Por favor, faça o login.', 'success');
            navigate(APP_ROUTES.LOGIN);
        },
        onError: (err: any) => {
            addToast(err.response?.data?.erro || 'Falha ao completar o registo.', 'error');
        }
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        // 2. Define os valores padrão do formulário com os dados do Google
        defaultValues: {
            name: name,
            email: email,
            userType: UserType.CLIENT,
            tipo_pessoa: 'PF'
        }
    });

    const cepValue = watch('cep');
    const { address, loading: cepLoading, error: cepError } = useViaCEP(cepValue);

    useEffect(() => {
        if (address) {
            setValue('logradouro', address.logradouro, { shouldValidate: true });
            setValue('bairro', address.bairro, { shouldValidate: true });
            setValue('city', address.localidade, { shouldValidate: true });
            setValue('uf', address.uf, { shouldValidate: true });
        }
    }, [address, setValue]);

    const onSubmit = (data: RegisterFormData) => {
        // O campo 'password' não é necessário para o registo via Google,
        // mas o nosso serviço de registo pode exigi-lo.
        // A melhor abordagem é ter um endpoint de registo separado para o fluxo do Google
        // que não exija senha, mas, por agora, podemos enviar uma senha fictícia.
        const apiPayload: RegisterData = {
            ...data,
            senha: data.password || 'google_user_placeholder_password',
            documento: data.documento.replace(/\D/g, ''),
            cep: data.cep.replace(/\D/g, ''),
        };
        registerUser(apiPayload);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
                <div className="text-center">
                    <Logo size={60} className="mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-grafite-profundo">Conclua o seu Registo</h2>
                    <p className="mt-2 text-sm text-cinza-neutro">
                        Falta pouco! Preencha os campos abaixo para finalizar a criação da sua conta no {APP_NAME}.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Campos de Nome e Email pré-preenchidos e desativados */}
                    <Input label="Nome Completo" {...register('name')} disabled />
                    <Input label="Email" type="email" {...register('email')} disabled />

                    {/* Pede os campos em falta */}
                    <Select 
                        label="Tipo de Pessoa" 
                        options={[{ value: 'PF', label: 'Pessoa Física' }, { value: 'PJ', label: 'Pessoa Jurídica' }]}
                        {...register('tipo_pessoa')}
                    />
                    <Input label={watch('tipo_pessoa') === 'PF' ? 'CPF' : 'CNPJ'} error={errors.documento?.message} {...register('documento')} />
                    <Input label="CEP" placeholder="00000-000" error={errors.cep?.message || cepError} isLoading={cepLoading} {...register('cep')} />
                    {/* ... outros campos de endereço ... */}

                    <Button type="submit" isLoading={loading} fullWidth>
                        {loading ? 'A finalizar...' : 'Concluir Registo'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CompleteRegistrationPage;
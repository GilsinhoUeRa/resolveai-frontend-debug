// src/pages/RegisterPage.tsx (Versão Final Corrigida)
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/hooks/useAuthHook';
import { useToast } from '@/hooks/useToast';
import { useViaCEP } from '@/hooks/useViaCEP';
import { registerSchema, RegisterFormData } from '@/validators/auth.schema';
import { UserType, RegisterData } from '@/types';

import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Logo from '@/components/Logo';
import { APP_ROUTES, APP_NAME } from '@/constants';

const RegisterPage: React.FC = () => {
    const { register: registerUser, loading } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
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

    const onSubmit = async (data: RegisterFormData) => {
        const apiPayload: RegisterData = {
            nome: data.name,
            email: data.email,
            senha: data.password,
            tipo_pessoa: data.tipo_pessoa,
            documento: data.documento.replace(/\D/g, ''),
            cep: data.cep.replace(/\D/g, ''),
            cidade: data.city,
            uf: data.uf,
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
        };
        try {
            await registerUser(apiPayload);
            addToast('Registo realizado com sucesso! Por favor, faça o login.', 'success');
            navigate(APP_ROUTES.LOGIN);
        } catch (err: any) {
            addToast(err.response?.data?.erro || 'Falha ao registar. Tente novamente.', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
                <div className="text-center">
                    <Logo size={60} className="mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-grafite-profundo">Crie a sua conta no {APP_NAME}</h2>
                    <p className="mt-2 text-sm text-cinza-neutro">
                        Já tem uma conta?{' '}
                        <Link to={APP_ROUTES.LOGIN} className="font-medium text-orange-energia hover:text-opacity-80">
                            Faça o login aqui
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input label="Nome Completo" error={errors.name?.message} {...register('name')} />
                    <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                    <Input label="Senha" type="password" error={errors.password?.message} {...register('password')} />
                    <Input label="Confirme a sua Senha" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

                    {/* --- CORREÇÃO DO SELECT --- */}
                    <Select 
                        label="Tipo de Pessoa" 
                        error={errors.tipo_pessoa?.message} 
                        options={[
                            { value: 'PF', label: 'Pessoa Física' },
                            { value: 'PJ', label: 'Pessoa Jurídica' }
                        ]}
                        {...register('tipo_pessoa')}
                    />

                    <Input label={watch('tipo_pessoa') === 'PF' ? 'CPF' : 'CNPJ'} type="text" error={errors.documento?.message} {...register('documento')} />

                    <div className="border-t border-gray-200 pt-6">
                        <Input label="CEP" placeholder="00000-000" error={errors.cep?.message || cepError} isLoading={cepLoading} {...register('cep')} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <Input label="Estado (UF)" error={errors.uf?.message} {...register('uf')} containerClassName="md:col-span-1" />
                            <Input label="Cidade" error={errors.city?.message} {...register('city')} containerClassName="md:col-span-2" />
                        </div>
                        <Input label="Bairro" error={errors.bairro?.message} {...register('bairro')} />
                        <Input label="Rua / Logradouro" error={errors.logradouro?.message} {...register('logradouro')} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <Input label="Número" type="text" error={errors.numero?.message} {...register('numero')} containerClassName="md:col-span-1" />
                            <Input label="Complemento (Opcional)" error={errors.complemento?.message} {...register('complemento')} containerClassName="md:col-span-2" />
                        </div>
                    </div>

                    <Select 
                        label="Tipo de Conta" 
                        options={[{ value: UserType.CLIENT, label: 'Sou Cliente' }, { value: UserType.PROVIDER, label: 'Sou Prestador' }]} 
                        error={errors.userType?.message} 
                        {...register('userType')} 
                    />

                    <Button type="submit" isLoading={loading} fullWidth variant="primary" size="lg">
                        {loading ? 'A registar...' : 'Criar Conta'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
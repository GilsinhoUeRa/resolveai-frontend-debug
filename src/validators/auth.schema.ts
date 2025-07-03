// src/validators/auth.schema.ts
import { z } from 'zod';
import { UserType } from '@/types';

// O schema agora inclui todos os campos necessários para o registo.
export const registerSchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
    email: z.string().email({ message: 'Formato de e-mail inválido.' }),
    password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string(),

    // Dados do utilizador
    userType: z.nativeEnum(UserType, { errorMap: () => ({ message: 'Selecione um tipo de conta.' }) }),
    tipo_pessoa: z.enum(['PF', 'PJ'], { errorMap: () => ({ message: 'Selecione o tipo de pessoa.' }) }),
    documento: z.string().min(11, "O documento é obrigatório e deve ser válido."),

    // Dados de Endereço
    cep: z.string().min(8, { message: 'O CEP deve ter 8 dígitos.' }),
    logradouro: z.string().min(3, { message: 'O nome da rua é obrigatório.' }),
    numero: z.string().min(1, { message: 'O número é obrigatório.' }),
    complemento: z.string().optional(),
    bairro: z.string().min(2, { message: 'O nome do bairro é obrigatório.' }),
    city: z.string().min(2, { message: 'O nome da cidade é obrigatório.' }),
    uf: z.string().length(2, { message: 'O estado (UF) deve ter 2 letras.' }),

}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], // Associa o erro ao campo de confirmação de senha
});

// O tipo é automaticamente inferido do schema, garantindo consistência.
export type RegisterFormData = z.infer<typeof registerSchema>;
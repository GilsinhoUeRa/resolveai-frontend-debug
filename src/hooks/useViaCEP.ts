// src/hooks/useViaCEP.ts (Versão Final Robusta)
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const useViaCEP = (cep: string) => {
  const [address, setAddress] = useState<ViaCEPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- GUARDA DE SEGURANÇA ADICIONADA AQUI ---
    // Se o CEP for indefinido ou nulo, não fazemos nada.
    if (!cep) {
      return;
    }

    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setAddress(null);
      setError(null);
      return;
    }

    const fetchAddress = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<ViaCEPResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (data.erro) {
          setAddress(null);
          setError('CEP não encontrado.');
        } else {
          setAddress(data);
        }
      } catch (err) {
        setAddress(null);
        setError('Erro ao consultar o CEP.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchAddress, 300);
    return () => clearTimeout(debounceTimeout);
  }, [cep]);

  return { address, loading, error };
};
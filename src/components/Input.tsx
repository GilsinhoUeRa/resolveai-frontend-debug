// src/components/Input.tsx (Versão Final com isLoading)
import React from 'react';

// 1. A interface agora aceita a propriedade opcional 'isLoading'
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  isLoading?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  error,
  className = '',
  containerClassName = '',
  isLoading = false, // 2. Definimos um valor padrão
  ...restProps
}) => {
  const inputId = name || restProps.id || `input-${Math.random()}`;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-grafite-profundo mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white sm:text-sm transition-colors duration-150 ease-in-out ${
            error
              ? 'border-red-500 focus:ring-red-400'
              : 'border-cinza-neutro focus:ring-orange-energia focus:border-orange-energia'
          } ${isLoading ? 'pr-10' : ''} ${className}`}
          {...restProps}
        />
        {/* 3. Se isLoading for true, mostramos um ícone de spinner dentro do input */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="animate-spin h-5 w-5 text-cinza-neutro" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
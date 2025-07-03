// src/components/Select.tsx
import React from 'react';

// A interface para cada opção no select
interface SelectOption {
  value: string | number;
  label: string;
}

// As propriedades que o nosso componente Select aceita
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[]; // A propriedade options agora é opcional para lidar com o estado de carregamento
  containerClassName?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  error,
  options, // A lista de opções pode ser indefinida inicialmente
  className = '',
  containerClassName = '',
  placeholder,
  ...restProps
}) => {
  const selectId = name || restProps.id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-grafite-profundo mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white sm:text-sm transition-colors duration-150 ease-in-out ${
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-cinza-neutro focus:ring-orange-energia focus:border-orange-energia'
        } ${className}`}
        {...restProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        
        {/* --- CORREÇÃO APLICADA AQUI --- */}
        {/*
          Verificamos se 'options' é de facto um array antes de tentar chamar a função .map().
          Isto previne o erro quando o componente renderiza antes dos dados da API chegarem.
        */}
        {Array.isArray(options) && options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
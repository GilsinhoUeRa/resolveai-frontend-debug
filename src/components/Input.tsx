
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, className = '', containerClassName = '', ...props }) => {
  const inputId = name || props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-grafite-profundo mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-colors duration-150 ease-in-out ${
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-cinza-neutro focus:ring-orange-energia focus:border-orange-energia'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
    

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, error, className = '', containerClassName = '', ...props }) => {
  const textareaId = name || props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-grafite-profundo mb-1">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={4}
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

export default Textarea;
    
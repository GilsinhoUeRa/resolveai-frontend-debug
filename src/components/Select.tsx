import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
  placeholder?: string; // Added placeholder as an explicit prop
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  error,
  options,
  className = '',
  containerClassName = '',
  placeholder, // Destructured placeholder
  ...restProps // Renamed to restProps to avoid confusion
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
        {...restProps} // Spread the rest of the HTML select attributes
      >
        {placeholder && <option value="">{placeholder}</option>} {/* Use the destructured placeholder */}
        {options.map(option => (
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
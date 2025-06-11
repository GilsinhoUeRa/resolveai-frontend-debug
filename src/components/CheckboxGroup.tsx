
import React from 'react';

interface CheckboxOption {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  error?: string;
  containerClassName?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error,
  containerClassName = '',
}) => {
  const handleChange = (optionId: string) => {
    const newSelectedValues = selectedValues.includes(optionId)
      ? selectedValues.filter((id) => id !== optionId)
      : [...selectedValues, optionId];
    onChange(newSelectedValues);
  };

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <legend className="block text-sm font-medium text-grafite-profundo mb-1">{label}</legend>}
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              id={option.id}
              name={option.id}
              type="checkbox"
              checked={selectedValues.includes(option.id)}
              onChange={() => handleChange(option.id)}
              className="h-4 w-4 text-orange-energia border-cinza-neutro rounded focus:ring-orange-energia"
            />
            <label htmlFor={option.id} className="ml-2 block text-sm text-grafite-profundo">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default CheckboxGroup;
    
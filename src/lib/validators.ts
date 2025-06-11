// lib/validators.ts

// Remove caracteres não numéricos
const stripNonNumeric = (value: string): string => value.replace(/\D/g, '');

// Validação de CPF
export const isValidCPF = (cpf: string): boolean => {
  cpf = stripNonNumeric(cpf);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica se tem 11 dígitos e se não são todos iguais

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// Formatação de CPF (XXX.XXX.XXX-XX)
export const formatCPF = (cpf: string): string => {
  const numericCPF = stripNonNumeric(cpf);
  if (numericCPF.length <= 3) return numericCPF;
  if (numericCPF.length <= 6) return `${numericCPF.slice(0, 3)}.${numericCPF.slice(3)}`;
  if (numericCPF.length <= 9) return `${numericCPF.slice(0, 3)}.${numericCPF.slice(3, 6)}.${numericCPF.slice(6)}`;
  return `${numericCPF.slice(0, 3)}.${numericCPF.slice(3, 6)}.${numericCPF.slice(6, 9)}-${numericCPF.slice(9, 11)}`;
};


// Validação de CNPJ
export const isValidCNPJ = (cnpj: string): boolean => {
  cnpj = stripNonNumeric(cnpj);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false; // Verifica se tem 14 dígitos e se não são todos iguais

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

// Formatação de CNPJ (XX.XXX.XXX/XXXX-XX)
export const formatCNPJ = (cnpj: string): string => {
  const numericCNPJ = stripNonNumeric(cnpj);
  if (numericCNPJ.length <= 2) return numericCNPJ;
  if (numericCNPJ.length <= 5) return `${numericCNPJ.slice(0, 2)}.${numericCNPJ.slice(2)}`;
  if (numericCNPJ.length <= 8) return `${numericCNPJ.slice(0, 2)}.${numericCNPJ.slice(2, 5)}.${numericCNPJ.slice(5)}`;
  if (numericCNPJ.length <= 12) return `${numericCNPJ.slice(0, 2)}.${numericCNPJ.slice(2, 5)}.${numericCNPJ.slice(5, 8)}/${numericCNPJ.slice(8)}`;
  return `${numericCNPJ.slice(0, 2)}.${numericCNPJ.slice(2, 5)}.${numericCNPJ.slice(5, 8)}/${numericCNPJ.slice(8, 12)}-${numericCNPJ.slice(12, 14)}`;
};

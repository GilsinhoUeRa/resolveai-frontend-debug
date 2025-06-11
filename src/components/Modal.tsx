
import React, { ReactNode } from 'react';
import Card from '@/components/Card'; // Reutiliza o Card para o corpo do modal
import XIcon from '@/components/icons/XIcon'; // Ícone para fechar

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode; // Conteúdo opcional para o rodapé do modal
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Tamanho do modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Fecha ao clicar no backdrop
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <Card 
        className={`w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeIn`}
        onClick={(e) => e.stopPropagation()} // Impede que o clique no card feche o modal
      >
        <style>
          {`
            @keyframes modalFadeIn {
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-modalFadeIn {
              animation: modalFadeIn 0.3s forwards;
            }
          `}
        </style>
        <header className="flex justify-between items-center pb-3 mb-4 border-b border-cinza-neutro/30">
          <h2 id="modal-title" className="text-xl font-semibold text-grafite-profundo">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-cinza-neutro hover:text-grafite-profundo hover:bg-light-bg focus:outline-none focus:ring-2 focus:ring-orange-energia"
            aria-label="Fechar modal"
          >
            <XIcon size={20} />
          </button>
        </header>
        <div className="max-h-[60vh] overflow-y-auto pr-2"> {/* Adiciona scroll se o conteúdo for grande */}
          {children}
        </div>
        {footer && (
          <footer className="mt-6 pt-4 border-t border-cinza-neutro/20">
            {footer}
          </footer>
        )}
      </Card>
    </div>
  );
};

export default Modal;

import React, { useEffect, useState } from 'react';
import { ToastMessage, ToastType } from '@/types';
import { COLORS, TOAST_DEFAULT_DURATION } from '@/constants';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Trigger enter animation
    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
      setTimeout(() => onDismiss(toast.id), 300); // Wait for animation to finish
    }, toast.duration || TOAST_DEFAULT_DURATION);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const bgColorClasses: Record<ToastType, string> = {
    success: `bg-green-500`,
    error: `bg-red-500`,
    info: `bg-blue-500`,
    warning: `bg-yellow-500`,
  };
  
  const iconClasses: Record<ToastType, string> = {
    success: 'M9 12l2 2 4-7', // Checkmark
    error: 'M6 18L18 6M6 6l12 12', // X
    info: 'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z', // Info circle
    warning: 'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' // Warning triangle
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`
        ${bgColorClasses[toast.type]} text-white
        p-4 rounded-md shadow-lg
        flex items-center space-x-3
        transition-all duration-300 ease-in-out
        mb-3
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconClasses[toast.type]}></path>
      </svg>
      <span className="flex-grow">{toast.message}</span>
      <button
        onClick={() => {setIsVisible(false); setTimeout(() => onDismiss(toast.id), 300);}}
        className="p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Fechar notificação"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
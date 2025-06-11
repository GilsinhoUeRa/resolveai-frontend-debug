import React from 'react';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 right-5 z-[100] w-full max-w-xs sm:max-w-sm"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
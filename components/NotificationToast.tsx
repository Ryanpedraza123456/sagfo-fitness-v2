import React, { useState, useEffect } from 'react';

export interface NotificationState {
  id: number;
  type: 'success' | 'error';
  message: string;
  onAction?: () => void;
}

interface NotificationToastProps {
  notification: NotificationState | null;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500); // Wait for animation
  };

  const handleActionClick = () => {
    if (notification?.onAction) {
      notification.onAction();
    }
    handleClose();
  };
  
  if (!notification) return null;

  const styles = {
    success: {
      bg: 'bg-neutral-900/90 dark:bg-black/80',
      iconBg: 'bg-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-600/90 dark:bg-red-800/80',
      iconBg: 'bg-white/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    }
  };

  const currentStyle = styles[notification.type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-5 inset-x-0 z-[200] flex justify-center transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      <div className={`backdrop-blur-lg rounded-full shadow-2xl border border-neutral-700/50 p-2 flex items-center space-x-3 text-white ${currentStyle.bg}`}>
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${currentStyle.iconBg}`}>
           {currentStyle.icon}
        </div>
        <p className="text-sm font-medium flex-grow pr-2">{notification.message}</p>
        {notification.onAction && (
          <button onClick={handleActionClick} className="text-sm font-bold text-blue-300 hover:text-blue-200 border-l border-white/20 pl-3 pr-2">
            Ver
          </button>
        )}
        <button onClick={handleClose} className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
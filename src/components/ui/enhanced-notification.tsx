
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useEnhancedNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useEnhancedNotification must be used within NotificationProvider');
  }
  return context;
};

export const EnhancedNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    if (!notification.persistent && notification.duration !== 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useEnhancedNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationCard: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[notification.type];

  return (
    <div className={cn(
      'p-4 rounded-lg border shadow-lg backdrop-blur-md animate-slide-in',
      colors[notification.type]
    )}>
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-sm opacity-90 mt-1">{notification.message}</p>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-medium transition-colors',
                    action.variant === 'primary' 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-white/80 hover:bg-white'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Hook utilitário para notificações comuns
export const useQuickNotify = () => {
  const { addNotification } = useEnhancedNotification();

  return {
    success: (title: string, message: string, actions?: Notification['actions']) => 
      addNotification({ type: 'success', title, message, actions }),
    
    error: (title: string, message: string) => 
      addNotification({ type: 'error', title, message }),
    
    warning: (title: string, message: string) => 
      addNotification({ type: 'warning', title, message }),
    
    info: (title: string, message: string) => 
      addNotification({ type: 'info', title, message }),
    
    calculationComplete: (type: string, result: any) => {
      const actions = [
        {
          label: 'Exportar PDF',
          action: () => console.log('Export PDF'),
          variant: 'primary' as const
        },
        {
          label: 'Compartilhar',
          action: () => console.log('Share'),
          variant: 'secondary' as const
        }
      ];
      
      addNotification({
        type: 'success',
        title: 'Cálculo Concluído!',
        message: `${type} calculado com sucesso`,
        actions,
        duration: 8000
      });
    }
  };
};

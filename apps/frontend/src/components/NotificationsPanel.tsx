import React, { useState } from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Bienvenido a InteliDent',
      message: 'Gracias por usar nuestra plataforma. Explora todas las funcionalidades.',
      type: 'success',
      read: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Recordatorio de cita',
      message: 'Tienes una cita programada para mañana a las 10:00 AM.',
      type: 'info',
      read: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Actualización del sistema',
      message: 'Nuevas funcionalidades disponibles. Revisa la configuración.',
      type: 'warning',
      read: true,
      createdAt: new Date(),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': 
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': 
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': 
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: 
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return 'Justo ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} horas`;
    return `Hace ${Math.floor(minutes / 1440)} días`;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 w-96 bg-white border border-gray-200 shadow-xl z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg font-light text-gray-900">Notificaciones</h2>
          {unreadCount > 0 && (
            <span className="text-xs font-mono text-white bg-red-500 px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-mono text-gray-400 hover:text-gray-600 transition-colors"
            >
              Marcar todas
            </button>
          )}
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-mono">No hay notificaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notif.read ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Icono */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs font-mono text-gray-400">
                        {getTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 text-center">
        <button 
          className="text-xs font-mono text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => {
            // Aquí puedes redirigir a una página de todas las notificaciones
            console.log('Ver todas las notificaciones');
          }}
        >
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
};
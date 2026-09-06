import React from 'react';
import { X, HelpCircle, Mail, Phone, MessageCircle, FileText, BookOpen, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const helpItems = [
    {
      icon: FileText,
      title: 'Documentación',
      description: 'Guías y tutoriales',
      href: '/docs',
      external: false,
    },
    {
      icon: BookOpen,
      title: 'Preguntas frecuentes',
      description: 'Respuestas rápidas',
      href: '/faq',
      external: false,
    },
    {
      icon: Mail,
      title: 'Correo electrónico',
      description: 'soporte@intelident.com',
      href: 'mailto:soporte@intelident.com',
      external: true,
    },
    {
      icon: Phone,
      title: 'Teléfono',
      description: '+56 9 1234 5678',
      href: 'tel:+56912345678',
      external: true,
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat en línea',
      href: 'https://wa.me/56912345678',
      external: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gray-900" />
            <h2 className="text-lg font-light text-gray-900">Ayuda y Soporte</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm font-mono text-gray-600">
            ¿Necesitas ayuda? Elige una de las siguientes opciones:
          </p>
          
          <div className="space-y-2">
            {helpItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between p-3 border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs font-mono text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs font-mono text-gray-400 text-center">
            Soporte disponible de Lunes a Viernes de 9:00 a 18:00 hrs
          </p>
        </div>
      </div>
    </div>
  );
};
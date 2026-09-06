import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, Settings,
  LogOut, Menu, X, ChevronRight, HelpCircle, Bell, Search, UserCog, Database
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '@intelident/shared';
import api from '../api/axiosClient';
import { Chatbot } from '../components/Chatbot';
import { HelpModal } from '../components/HelpModal';
import { NotificationsPanel } from '../components/NotificationsPanel';

// Items de navegación con organización por secciones
const navSections = [
  {
    title: 'Principal',
    items: [
      {
        to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />,
        label: 'Dashboard',
        roles: [UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST, UserRole.PATIENT],
      },
    ],
  },
  {
    title: 'Gestión',
    items: [
      {
        to: '/patients', icon: <Users className="w-5 h-5" />,
        label: 'Pacientes',
        roles: [UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST],
      },
      {
        to: '/appointments', icon: <Calendar className="w-5 h-5" />,
        label: 'Citas',
        roles: [UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST, UserRole.PATIENT],
      },
    ],
  },
  {
    title: 'Administración',
    items: [
      {
        to: '/admin/users', icon: <UserCog className="w-5 h-5" />,
        label: 'Usuarios',
        roles: [UserRole.ADMIN],
      },
      {
        to: '/admin/settings', icon: <Settings className="w-5 h-5" />,
        label: 'Configuración',
        roles: [UserRole.ADMIN],
      },
      {
        to: '/admin/backups', icon: <Database className="w-5 h-5" />,
        label: 'Respaldos',
        roles: [UserRole.ADMIN],
      },
    ],
  },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar sidebar en móvil al navegar
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => { clearAuth(); navigate('/login'); },
    onError: () => { clearAuth(); navigate('/login'); },
  });

  // Filtrar items según rol del usuario
  const filteredSections = navSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => user && item.roles.includes(user.role)),
    }))
    .filter(section => section.items.length > 0);

  const roleLabel: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.DENTIST]: 'Dentista',
    [UserRole.RECEPTIONIST]: 'Recepcionista',
    [UserRole.PATIENT]: 'Paciente',
  };

  // Atajo de teclado para cerrar sesión (Ctrl + Shift + L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        logoutMutation.mutate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Atajo de teclado para abrir ayuda (Ctrl + H)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setShowHelpModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Obtener el título de la página actual
  const getPageTitle = () => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.to === location.pathname) {
          return item.label;
        }
      }
    }
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-30
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'lg:w-20'} flex-shrink-0
        bg-white border-r border-gray-100
        flex flex-col transition-all duration-300 ease-in-out
        h-full shadow-lg lg:shadow-none
      `}>
        {/* Header con Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <img 
                src="/monochromatic_horizontal_black_logo.png" 
                alt="InteliDent"
                className="h-8 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <img 
                src="/monochromatic_horizontal_black_logo.png" 
                alt="InteliDent"
                className="h-6 w-auto object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={sidebarOpen ? 'Contraer menú' : 'Expandir menú'}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navegación por secciones */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto" role="navigation" aria-label="Menú principal">
          {filteredSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {sidebarOpen && (
                <p className="px-3 mb-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 group
                      ${isActive
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    title={!sidebarOpen ? item.label : undefined}
                    aria-current={location.pathname === item.to ? 'page' : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {sidebarOpen && (
                      <ChevronRight className={`
                        w-4 h-4 transition-opacity duration-200
                        ${location.pathname === item.to ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      `} />
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {user ? roleLabel[user.role] : ''}
                </p>
              </div>
              <button
                onClick={() => logoutMutation.mutate()}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Cerrar sesión (Ctrl + Shift + L)"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <button
                onClick={() => logoutMutation.mutate()}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header superior */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Botón para móvil */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 lg:hidden"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              
              {/* Título de la página actual */}
              <h1 className="text-xl font-light text-gray-900 tracking-tight">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón de búsqueda */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Botón de ayuda */}
              <button
                onClick={() => setShowHelpModal(true)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Ayuda (Ctrl+H)"
                title="Ayuda (Ctrl+H)"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Botón de notificaciones */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Notificaciones"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
                <NotificationsPanel 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              </div>
            </div>
          </div>

          {/* Barra de búsqueda expandible */}
          {showSearch && (
            <div className="px-6 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar pacientes, citas o configuraciones..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Chatbot flotante */}
      <Chatbot />

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      {/* Atajo de teclado visible (solo para admin) */}
      {user?.role === UserRole.ADMIN && (
        <div className="fixed bottom-4 left-4 text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded shadow-sm hidden lg:block">
          Ctrl + H → Ayuda | Ctrl + Shift + L → Cerrar sesión
        </div>
      )}
    </div>
  );
};
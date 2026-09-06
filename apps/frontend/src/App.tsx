import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { NotFoundPage } from './pages/errors/NotFoundPage';
import { UnauthorizedPage } from './pages/errors/UnauthorizedPage';
import { UserRole } from '@intelident/shared';

// Lazy loading
const DashboardLayout = lazy(() =>
  import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout }))
);
const DashboardPage = lazy(() =>
  import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const PatientsPage = lazy(() =>
  import('./pages/patients/PatientsPage').then((m) => ({ default: m.PatientsPage }))
);
const AppointmentsPage = lazy(() =>
  import('./pages/appointments/AppointmentsPage').then((m) => ({ default: m.AppointmentsPage }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// PageLoader - Estilo Palantir
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-white">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400 text-xs font-mono tracking-wide">
        Cargando InteliDent...
      </p>
    </div>
  </div>
);

export const App: React.FC = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Admin, Dentist, Receptionist */}
                <Route element={<ProtectedRoute allowedRoles={[
                  UserRole.ADMIN, 
                  UserRole.DENTIST, 
                  UserRole.RECEPTIONIST,
                ]} />}>
                  <Route path="/patients" element={<PatientsPage />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                </Route>

                {/* Solo Admin */}
                <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                  <Route path="/admin/users" element={<AdminPlaceholder title="Gestión de usuarios" />} />
                  <Route path="/admin/settings" element={<AdminPlaceholder title="Configuración" />} />
                </Route>
              </Route>
            </Route>

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Componente placeholder para páginas de administración
const AdminPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-96 border border-gray-100 bg-white">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 rounded-full" />
      </div>
      <h2 className="text-xl font-light text-gray-900 tracking-tight">
        {title}
      </h2>
      <p className="text-gray-400 text-sm mt-2 font-mono">
        Módulo en desarrollo
      </p>
    </div>
  </div>
);
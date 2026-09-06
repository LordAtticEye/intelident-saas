import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import api from '../../api/axiosClient';
import { useAuthStore } from '../../store/authStore';
import { type IUser } from '@intelident/shared';

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginForm = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const from = (location.state as any)?.from?.pathname ?? '/dashboard';

  const {
    register, handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoginForm>({ 
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await api.post<{
        success: boolean;
        data: { user: IUser; accessToken: string };
      }>('/auth/login', data);
      return res.data.data;
    },
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      navigate(from, { replace: true });
    },
  });

  const onSubmit = (data: LoginForm) => loginMutation.mutate(data);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12">
        <div className="w-full max-w-md">
          {/* Logo - Centrado con más espacio inferior */}
          <div className="mb-20 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/main_logo.png" 
                alt="InteliDent"
                className="h-32 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Iniciar sesión
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              Accede a tu panel de control
            </p>
          </div>

          {/* Error Message */}
          {loginMutation.isError && (
            <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500">
              <p className="text-red-600 text-xs font-mono">
                { (loginMutation.error as any)?.response?.data?.message || 'Error de autenticación' }
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-0 py-2 border-b text-gray-900 text-sm 
                  focus:outline-none focus:border-gray-900 transition-colors bg-transparent
                  ${errors.email 
                    ? 'border-red-500' 
                    : isDirty 
                      ? 'border-gray-900' 
                      : 'border-gray-200'
                  }`}
                placeholder="nombre@clinica.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-mono">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider">
                  Contraseña
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors"
                >
                  ¿Olvidaste?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full px-0 py-2 border-b text-gray-900 text-sm 
                    focus:outline-none focus:border-gray-900 transition-colors bg-transparent pr-8
                    ${errors.password 
                      ? 'border-red-500' 
                      : isDirty 
                        ? 'border-gray-900' 
                        : 'border-gray-200'
                    }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-mono">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group w-full mt-8 py-3 bg-gray-900 hover:bg-gray-800 
                text-white text-sm font-mono tracking-wide
                transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</>
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Sign up link */}
            <div className="text-center pt-6">
              <p className="text-xs font-mono text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-gray-900 hover:underline">
                  Crea una
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Abstract Data Visualization */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-96 h-96 border border-gray-200 rounded-full opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-gray-300 rounded-full opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-900 rounded-full opacity-5" />
            
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" viewBox="0 0 400 400">
              <line x1="200" y1="0" x2="200" y2="400" stroke="#e5e5e5" strokeWidth="0.5" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#e5e5e5" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="80" fill="none" stroke="#d4d4d4" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="#e5e5e5" strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>

            <div className="absolute bottom-12 left-12 right-12">
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-mono text-gray-400">SESIONES ACTIVAS</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">2,847</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-gray-400">TIEMPO ACTIVO</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">99.97%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
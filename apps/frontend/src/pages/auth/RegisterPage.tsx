import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { 
  Eye, EyeOff, Loader2, 
  User, Mail, Lock, Phone, ArrowRight
} from 'lucide-react';
import api from '../../api/axiosClient';
import { useAuthStore } from '../../store/authStore';

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().optional(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword, ...registerData } = data;
      const res = await api.post('/auth/register', registerData);
      return res.data.data;
    },
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      navigate('/dashboard');
    },
  });

  const onSubmit = (data: RegisterForm) => registerMutation.mutate(data);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Crear cuenta
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              Comienza tu prueba gratuita de 14 días
            </p>
          </div>

          {/* Error Message */}
          {registerMutation.isError && (
            <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500">
              <p className="text-red-600 text-xs font-mono">
                { (registerMutation.error as any)?.response?.data?.message || 'Error al registrar usuario. Intenta nuevamente.' }
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`w-full pl-6 py-2 border-b text-gray-900 text-sm 
                      focus:outline-none focus:border-gray-900 transition-colors bg-transparent
                      ${errors.firstName 
                        ? 'border-red-500' 
                        : touchedFields.firstName && isDirty
                          ? 'border-gray-900' 
                          : 'border-gray-200'
                      }`}
                    placeholder="Juan"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 font-mono">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    {...register('lastName')}
                    className={`w-full pl-6 py-2 border-b text-gray-900 text-sm 
                      focus:outline-none focus:border-gray-900 transition-colors bg-transparent
                      ${errors.lastName 
                        ? 'border-red-500' 
                        : touchedFields.lastName && isDirty
                          ? 'border-gray-900' 
                          : 'border-gray-200'
                      }`}
                    placeholder="Pérez"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 font-mono">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full pl-6 py-2 border-b text-gray-900 text-sm 
                    focus:outline-none focus:border-gray-900 transition-colors bg-transparent
                    ${errors.email 
                      ? 'border-red-500' 
                      : touchedFields.email && isDirty
                        ? 'border-gray-900' 
                        : 'border-gray-200'
                    }`}
                  placeholder="nombre@clinica.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-mono">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Teléfono <span className="text-gray-300 lowercase">(opcional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full pl-6 py-2 border-b border-gray-200 text-gray-900 text-sm 
                    focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full pl-6 pr-8 py-2 border-b text-gray-900 text-sm 
                    focus:outline-none focus:border-gray-900 transition-colors bg-transparent
                    ${errors.password 
                      ? 'border-red-500' 
                      : touchedFields.password && isDirty
                        ? 'border-gray-900' 
                        : 'border-gray-200'
                    }`}
                  placeholder="••••••••"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`w-full pl-6 pr-8 py-2 border-b text-gray-900 text-sm 
                    focus:outline-none focus:border-gray-900 transition-colors bg-transparent
                    ${errors.confirmPassword 
                      ? 'border-red-500' 
                      : touchedFields.confirmPassword && isDirty
                        ? 'border-gray-900' 
                        : 'border-gray-200'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-mono">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group w-full mt-8 py-3 bg-gray-900 hover:bg-gray-800 
                text-white text-sm font-mono tracking-wide
                transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...</>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Sign in link */}
            <div className="text-center pt-6">
              <p className="text-xs font-mono text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-gray-900 hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Abstract Data/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-sm">
            {/* Metrics */}
            <div className="mb-12">
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Clínicas activas
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">2,847</span>
                  <span className="text-xs font-mono text-gray-400">EN TODO EL MUNDO</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Pacientes gestionados
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">125.4K</span>
                  <span className="text-xs font-mono text-gray-400">ACTIVOS</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Tiempo de actividad
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">99.97</span>
                  <span className="text-xs font-mono text-gray-400">PORCENTAJE</span>
                </div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                <p className="text-xs font-mono text-gray-500">
                  Cumple con normativas sanitarias
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                <p className="text-xs font-mono text-gray-500">
                  Encriptación de 256 bits
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                <p className="text-xs font-mono text-gray-500">
                  Soporte 24/7 incluido
                </p>
              </div>
            </div>

            {/* Abstract grid pattern */}
            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <line x1="0" y1="100" x2="200" y2="100" stroke="#1a1a1a" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="#1a1a1a" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1a1a1a" strokeWidth="0.5" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../api/axiosClient';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Debe contener mayúscula, número y símbolo',
      }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty, touchedFields } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post(`/auth/reset-password/${token}`, { password: data.password }),
    onSuccess: () => setTimeout(() => navigate('/login'), 2000),
  });

  // Pantalla de éxito
  if (mutation.isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
            Contraseña restablecida
          </h1>
          
          <p className="text-gray-400 text-sm mb-6 font-mono">
            Tu contraseña ha sido actualizada correctamente.
          </p>
          
          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs font-mono text-gray-400">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio de sesión
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Nueva contraseña
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {/* Error Message */}
          {mutation.isError && (
            <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500">
              <p className="text-red-600 text-xs font-mono">
                { (mutation.error as any)?.response?.data?.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.' }
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full px-0 pr-8 py-2 border-b text-gray-900 text-sm 
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
              <p className="text-gray-400 text-xs mt-2 font-mono">
                Debe contener mayúscula, número y símbolo
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`w-full px-0 pr-8 py-2 border-b text-gray-900 text-sm 
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
              disabled={mutation.isPending}
              className="group w-full mt-8 py-3 bg-gray-900 hover:bg-gray-800 
                text-white text-sm font-mono tracking-wide
                transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : (
                <>
                  Restablecer contraseña
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - Abstract Data/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-sm">
            {/* Security metrics */}
            <div className="mb-12">
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Seguridad de la contraseña
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">256</span>
                  <span className="text-xs font-mono text-gray-400">BIT ENCRIPTACIÓN</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Requisitos
                </p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-xs font-mono text-gray-500">Mínimo 8 caracteres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-xs font-mono text-gray-500">Al menos una mayúscula</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-xs font-mono text-gray-500">Al menos un número</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-xs font-mono text-gray-500">Al menos un símbolo</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Validez del enlace
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">60</span>
                  <span className="text-xs font-mono text-gray-400">MINUTOS</span>
                </div>
              </div>
            </div>

            {/* Help text */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                <p className="text-xs font-mono text-gray-500">
                  Por seguridad, este enlace expirará después de ser utilizado
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
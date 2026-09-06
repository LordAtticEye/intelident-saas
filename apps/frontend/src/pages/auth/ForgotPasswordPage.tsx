import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { 
  CheckCircle, Loader2, ArrowLeft, Mail, 
  Shield, ArrowRight
} from 'lucide-react';
import api from '../../api/axiosClient';

const schema = z.object({ 
  email: z.string().email('Correo electrónico inválido') 
});
type FormData = z.infer<typeof schema>;

export const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/forgot-password', data),
    onSuccess: () => setSent(true),
  });

  // Pantalla de éxito
  if (sent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-12">
            <img 
              src="/main_logo.png" 
              alt="InteliDent"
              className="h-24 w-auto object-contain"
            />
          </div>

          <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
            Revisa tu correo
          </h1>
          
          <p className="text-gray-400 text-sm mb-6 font-mono">
            Hemos enviado las instrucciones para restablecer tu contraseña.
          </p>
          
          <div className="border-t border-gray-100 pt-6 mb-6">
            <p className="text-xs font-mono text-gray-400">
              ¿No recibiste el correo? Revisa tu carpeta de spam.
            </p>
          </div>
          
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

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
                className="h-28 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Restablecer contraseña
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              Ingresa tu correo para recibir instrucciones
            </p>
          </div>

          {/* Error Message */}
          {mutation.isError && (
            <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500">
              <p className="text-red-600 text-xs font-mono">
                { (mutation.error as any)?.response?.data?.message || 'Error en la solicitud. Intenta nuevamente.' }
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
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
                      : isDirty 
                        ? 'border-gray-900' 
                        : 'border-gray-200'
                    }`}
                  placeholder="nombre@clinica.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-mono">{errors.email.message}</p>
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
                <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
              ) : (
                <>
                  Enviar enlace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Back to login */}
            <div className="text-center pt-6">
              <Link 
                to="/login" 
                className="text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Abstract Data/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-sm">
            <div className="mb-12">
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Estado de seguridad
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">256</span>
                  <span className="text-xs font-mono text-gray-400">BIT ENCRIPTACIÓN</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Sesiones activas
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">1,847</span>
                  <span className="text-xs font-mono text-gray-400">ACTUALES</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Tasa de recuperación
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light text-gray-900">99.97</span>
                  <span className="text-xs font-mono text-gray-400">PORCENTAJE</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-mono text-gray-500 mb-1">
                    El enlace expira en 1 hora
                  </p>
                  <p className="text-xs font-mono text-gray-400">
                    Por seguridad, cada enlace solo puede usarse una vez
                  </p>
                </div>
              </div>
            </div>

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
import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="w-full max-w-md text-center">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-mono">ID</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 tracking-wide">INTELIDENT</span>
        </div>
      </div>

      {/* Icono */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto border border-gray-100 flex items-center justify-center">
          <FileQuestion className="w-10 h-10 text-gray-300" strokeWidth={1} />
        </div>
      </div>

      {/* Código de error */}
      <div className="mb-4">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
          Error
        </span>
        <h1 className="text-7xl font-light text-gray-900 tracking-tight">
          404
        </h1>
      </div>

      {/* Mensaje */}
      <h2 className="text-lg font-light text-gray-700 mb-2">
        Página no encontrada
      </h2>
      
      <p className="text-gray-400 text-sm mb-8 font-mono">
        La página que buscas no existe o ha sido movida.
      </p>

      {/* Enlaces */}
      <div className="space-y-3">
        <Link
          to="/dashboard"
          className="group block w-full py-3 border border-gray-200 hover:border-gray-900 transition-colors"
        >
          <span className="text-sm font-mono text-gray-700 group-hover:text-gray-900 flex items-center justify-center gap-2">
            <Home className="w-4 h-4" />
            Ir al dashboard
          </span>
        </Link>
        
        <Link
          to="/login"
          className="group inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio de sesión
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-gray-100">
        <p className="text-[10px] font-mono text-gray-300">
          INTELIDENT MANAGEMENT SOLUTIONS
        </p>
      </div>
    </div>
  </div>
);
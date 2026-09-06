import React from 'react';
import { ShieldCheck, FileText, X, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            ) : (
              <FileText className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="font-medium text-base tracking-tight">
              {type === 'privacy'
                ? 'Aviso de Privacidad y Protección de Datos Personales (LFPDPPP)'
                : 'Términos y Condiciones del Servicio SaaS'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-700 leading-relaxed font-sans">
          {type === 'privacy' ? (
            <>
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> de los Estados Unidos Mexicanos, este documento detalla el tratamiento, protección y derechos sobre sus datos personales en la plataforma <strong>InteliDent</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  1. Identidad y Domicilio del Responsable
                </h4>
                <p>
                  <strong>InteliDent Software S.A.S. de C.V.</strong>, con domicilio en San Juan del Río, Querétaro, México, es responsable del tratamiento legítimo, controlado e informado de sus datos personales y expedientes clínicos odontológicos.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  2. Datos Personales Recabados
                </h4>
                <p>
                  Para la prestación de los servicios clínicos y de gestión de citas, se recopilan: nombre completo, correo electrónico, teléfono, fecha de nacimiento, así como datos de salud bucal (alergias, tratamientos previos y notas clínicas) catalogados como datos sensibles.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  3. Finalidad del Tratamiento de Datos
                </h4>
                <p>
                  Los datos personales serán utilizados única y exclusivamente para:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li>Creación y administración de cuentas de usuario y control de acceso RBAC.</li>
                  <li>Agendamiento, confirmación y recordatorio automatizado de citas odontológicas.</li>
                  <li>Mantenimiento seguro del expediente clínico dental electrónico.</li>
                  <li>Emisión de comprobantes fiscales y contacto en caso de emergencia médica.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  4. Medidas de Seguridad y Cifrado
                </h4>
                <p>
                  Se implementan protocolos de cifrado <strong>TLS 1.3</strong> en tránsito y cifrado <strong>AES-256</strong> en reposo. Las contraseñas se almacenan mediante funciones hash irreversibles con algoritmo <strong>bcrypt (12 rondas de salting)</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  5. Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
                </h4>
                <p>
                  Usted tiene derecho a conocer qué datos tenemos (Acceso), solicitar su corrección (Rectificación), eliminarlos de nuestras bases (Cancelación) oponerse al tratamiento de los mismos (Oposición). Para ejercerlos, puede enviar una solicitud a <strong>privacidad@intelident.com</strong> o desde la sección de configuración de su perfil.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  6. Notificación de Brechas de Seguridad
                </h4>
                <p>
                  En caso de vulneración de seguridad que afecte de forma significativa los derechos patrimoniales o morales de los titulares, InteliDent notificará de inmediato a los usuarios conforme a los plazos previstos por el INAI y la LFPDPPP.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  1. Aceptación del Servicio
                </h4>
                <p>
                  Al registrarse y utilizar InteliDent, el usuario acepta de forma vinculante los términos de licenciamiento SaaS, uso de la plataforma clínica y directivas de seguridad informática.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  2. Responsabilidad de las Cuentas
                </h4>
                <p>
                  El titular de la cuenta es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su sesión.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm uppercase font-mono tracking-wider mb-1">
                  3. Disponibilidad del Software
                </h4>
                <p>
                  InteliDent ofrece un Acuerdo de Nivel de Servicio (SLA) del 99.9% de disponibilidad, garantizando respaldos continuos y mantenimiento preventivo con aviso previo.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

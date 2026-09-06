import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, Bell, Database, Bot, Save, RefreshCw, 
  Globe, Clock, Mail, Phone, MapPin, AlertCircle,
  CheckCircle, Loader2, Zap, Shield, MessageCircle
} from 'lucide-react';
import api from '../../api/axiosClient';

interface SettingsData {
  clinicName: string;
  clinicPhone: string;
  clinicEmail: string;
  clinicAddress: string;
  workingHours: {
    start: string;
    end: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  aiConfig: {
    enabled: boolean;
    autoRespond: boolean;
    sentimentAnalysis: boolean;
    openaiKey?: string;
    n8nWebhook?: string;
  };
}

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsData>({
    clinicName: 'InteliDent Clinic',
    clinicPhone: '+56 9 1234 5678',
    clinicEmail: 'contacto@intelident.com',
    clinicAddress: 'Av. Principal 123, Santiago',
    workingHours: { start: '09:00', end: '18:00' },
    notifications: { email: true, sms: false, whatsapp: true },
    aiConfig: { 
      enabled: true, 
      autoRespond: true, 
      sentimentAnalysis: false,
      openaiKey: '',
      n8nWebhook: '',
    },
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<{ [key: string]: 'idle' | 'testing' | 'success' | 'error' }>({
    openai: 'idle',
    n8n: 'idle',
  });
  const queryClient = useQueryClient();

  // Cargar configuración desde el backend - sin almacenar la variable no usada
  const { isLoading: isLoadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get('/admin/settings');
      const data = response.data.data;
      // Actualizar el estado local cuando se cargan los datos
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
      return data;
    },
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SettingsData) => {
      const response = await api.post('/admin/settings', data);
      return response.data;
    },
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (error: Error) => {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    },
  });

  const testConnection = async (type: 'openai' | 'n8n') => {
    setTestStatus(prev => ({ ...prev, [type]: 'testing' }));
    try {
      const response = await api.post('/admin/test-connection', { type });
      if (response.data.success) {
        setTestStatus(prev => ({ ...prev, [type]: 'success' }));
        setTimeout(() => setTestStatus(prev => ({ ...prev, [type]: 'idle' })), 3000);
      } else {
        setTestStatus(prev => ({ ...prev, [type]: 'error' }));
        setTimeout(() => setTestStatus(prev => ({ ...prev, [type]: 'idle' })), 3000);
      }
    } catch (error) {
      setTestStatus(prev => ({ ...prev, [type]: 'error' }));
      setTimeout(() => setTestStatus(prev => ({ ...prev, [type]: 'idle' })), 3000);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings, description: 'Información de la clínica' },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, description: 'Alertas y recordatorios' },
    { id: 'ai', label: 'Inteligencia Artificial', icon: Bot, description: 'Chatbot y análisis IA' },
    { id: 'integrations', label: 'Integraciones', icon: Database, description: 'APIs y servicios externos' },
  ];

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-gray-900" />
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            Configuración
          </h1>
        </div>
        <p className="text-gray-400 text-sm mt-1 font-mono">
          Gestiona la configuración de tu clínica
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border-l-2 border-green-500">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <p className="text-sm text-green-700 font-mono">Configuración guardada exitosamente</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-sm font-mono transition-colors flex flex-col items-start ${
              activeTab === tab.id
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </div>
            <span className="text-xs mt-1 opacity-70">{tab.description}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-2xl">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-mono text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Información de la clínica
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Nombre de la clínica</label>
                  <input
                    type="text"
                    value={settings.clinicName}
                    onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                    className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900"
                    placeholder="InteliDent Clinic"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Teléfono
                    </label>
                    <input
                      type="text"
                      value={settings.clinicPhone}
                      onChange={(e) => setSettings({ ...settings, clinicPhone: e.target.value })}
                      className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <input
                      type="email"
                      value={settings.clinicEmail}
                      onChange={(e) => setSettings({ ...settings, clinicEmail: e.target.value })}
                      className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900"
                      placeholder="contacto@intelident.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Dirección
                  </label>
                  <textarea
                    value={settings.clinicAddress}
                    onChange={(e) => setSettings({ ...settings, clinicAddress: e.target.value })}
                    className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900"
                    rows={2}
                    placeholder="Av. Principal 123, Santiago"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Hora apertura
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        workingHours: { ...settings.workingHours, start: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Hora cierre
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        workingHours: { ...settings.workingHours, end: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="border border-gray-100 bg-white p-5">
            <h3 className="text-sm font-mono text-gray-900 mb-4">Canales de notificación</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                <div>
                  <span className="text-sm text-gray-700">Correo electrónico</span>
                  <p className="text-xs font-mono text-gray-400">Recordatorios de citas y promociones</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    notifications: { ...settings.notifications, email: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                <div>
                  <span className="text-sm text-gray-700">SMS</span>
                  <p className="text-xs font-mono text-gray-400">Confirmaciones y alertas urgentes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    notifications: { ...settings.notifications, sms: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                <div>
                  <span className="text-sm text-gray-700">WhatsApp</span>
                  <p className="text-xs font-mono text-gray-400">Comunicación directa con pacientes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.whatsapp}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    notifications: { ...settings.notifications, whatsapp: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
              </label>
            </div>
          </div>
        )}

        {/* AI Configuration */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-mono text-gray-900 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Asistente IA
                  </h3>
                  <p className="text-xs font-mono text-gray-400 mt-1">Configuración del chatbot y análisis inteligente</p>
                </div>
                <button 
                  onClick={() => testConnection('openai')}
                  className="text-xs font-mono text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                  disabled={testStatus.openai === 'testing'}
                >
                  {testStatus.openai === 'testing' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : testStatus.openai === 'success' ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : testStatus.openai === 'error' ? (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  Probar conexión
                </button>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Habilitar asistente IA</span>
                  <input
                    type="checkbox"
                    checked={settings.aiConfig.enabled}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      aiConfig: { ...settings.aiConfig, enabled: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Respuestas automáticas</span>
                  <input
                    type="checkbox"
                    checked={settings.aiConfig.autoRespond}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      aiConfig: { ...settings.aiConfig, autoRespond: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Análisis de sentimiento</span>
                  <input
                    type="checkbox"
                    checked={settings.aiConfig.sentimentAnalysis}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      aiConfig: { ...settings.aiConfig, sentimentAnalysis: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                </label>
              </div>
            </div>

            <div className="border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-mono text-gray-900 mb-4">Modelos de IA</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      OpenAI GPT
                    </p>
                    <p className="text-xs font-mono text-gray-400">Para respuestas conversacionales y análisis</p>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 ${
                    settings.aiConfig.openaiKey ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
                  }`}>
                    {settings.aiConfig.openaiKey ? 'Conectado' : 'Configurar API Key'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      n8n Workflows
                    </p>
                    <p className="text-xs font-mono text-gray-400">Automatización de procesos y notificaciones</p>
                  </div>
                  <button 
                    onClick={() => testConnection('n8n')}
                    className="text-xs font-mono text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    {testStatus.n8n === 'testing' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : testStatus.n8n === 'success' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    Probar
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 bg-gray-50 p-5">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-mono text-gray-600">
                    Los datos procesados por IA son anónimos y seguros. 
                    No se almacenan conversaciones personales sin consentimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Settings */}
        {activeTab === 'integrations' && (
          <div className="border border-gray-100 bg-white p-5">
            <h3 className="text-sm font-mono text-gray-900 mb-4">Configuración de APIs</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  value={settings.aiConfig.openaiKey || ''}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    aiConfig: { ...settings.aiConfig, openaiKey: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900 font-mono"
                  placeholder="sk-..."
                />
                <p className="text-xs font-mono text-gray-400 mt-1">
                  Obtén tu API key en <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">platform.openai.com</a>
                </p>
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">n8n Webhook URL</label>
                <input
                  type="text"
                  value={settings.aiConfig.n8nWebhook || ''}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    aiConfig: { ...settings.aiConfig, n8nWebhook: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900 font-mono"
                  placeholder="http://localhost:5678/webhook"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => saveSettingsMutation.mutate(settings)}
            disabled={saveSettingsMutation.isPending}
            className="px-6 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-mono flex items-center gap-2 transition-colors"
          >
            {saveSettingsMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar configuración
          </button>
        </div>
      </div>
    </div>
  );
};
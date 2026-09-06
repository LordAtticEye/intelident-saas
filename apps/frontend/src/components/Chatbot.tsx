import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import api from '../api/axiosClient';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente virtual de InteliDent. ¿Cómo puedo ayudarte hoy? Puedo ayudarte con:\n- 📅 Agendar citas\n- 🦷 Información de tratamientos\n- ⏰ Horarios de atención\n- 📍 Dirección y contacto',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/chatbot/message', { 
        message: input,
        userId: localStorage.getItem('userId') || 'anonymous'
      });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, estoy teniendo problemas de conexión. Por favor intenta nuevamente o contacta con soporte al +56 9 1234 5678.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Sugerencias rápidas
  const quickSuggestions = [
    { text: '📅 Agendar cita', action: 'Quiero agendar una cita' },
    { text: '🦷 Tratamientos', action: '¿Qué tratamientos ofrecen?' },
    { text: '⏰ Horarios', action: '¿Cuál es el horario de atención?' },
    { text: '📍 Dirección', action: '¿Dónde está ubicada la clínica?' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-all duration-200 hover:scale-105 z-50 group"
        aria-label="Abrir chat de asistente"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white border border-gray-200 shadow-2xl flex flex-col z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-14' : 'w-96 h-[550px]'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white text-sm font-mono">Asistente InteliDent</span>
            <span className="text-xs text-green-400 ml-2">● Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-white transition-colors rounded"
            aria-label={isMinimized ? 'Expandir chat' : 'Minimizar chat'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-400 hover:text-white transition-colors rounded"
            aria-label="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 ${
                    msg.sender === 'user'
                      ? 'bg-gray-900 text-white rounded-t-lg rounded-bl-lg'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-t-lg rounded-br-lg shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'bot' ? (
                      <Bot className="w-3 h-3 text-gray-500" />
                    ) : (
                      <User className="w-3 h-3 text-gray-400" />
                    )}
                    <span className="text-xs font-mono">
                      {msg.sender === 'bot' ? 'Asistente' : 'Tú'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-t-lg rounded-br-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 border-t border-gray-100 bg-white">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(suggestion.action);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 text-xs font-mono text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                aria-label="Mensaje"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Enviar</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center font-mono">
              Respuestas automáticas • Disponible 24/7
            </p>
          </div>
        </>
      )}
    </div>
  );
};
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class ChatbotController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📨 Mensaje recibido:', req.body);
      
      const { message } = req.body;
      
      if (!message || message.trim().length === 0) {
        return res.json({ 
          success: true, 
          reply: 'Por favor, escribe un mensaje para poder ayudarte.' 
        });
      }

      const lowerMessage = message.toLowerCase();
      let reply = '';

      // Respuestas predefinidas
      if (lowerMessage.includes('horario') || lowerMessage.includes('atencion')) {
        reply = 'Nuestro horario de atención es:\n📅 Lunes a Viernes: 9:00 - 18:00\n📅 Sábados: 9:00 - 13:00\n📅 Domingos: Cerrado\n\n¿Te gustaría agendar una cita?';
      } 
      else if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('turno')) {
        reply = 'Para agendar una cita, necesito que me proporciones:\n1. 📝 Tu nombre completo\n2. 📞 Número de teléfono\n3. 🦷 Tipo de consulta\n4. 📅 Fecha preferida\n\n¿Me puedes dar esa información?';
      }
      else if (lowerMessage.includes('direccion') || lowerMessage.includes('ubicacion') || lowerMessage.includes('donde')) {
        reply = '📍 Estamos ubicados en:\nAv. Principal 123, Santiago\n\n¿Necesitas indicaciones para llegar?';
      }
      else if (lowerMessage.includes('telefono') || lowerMessage.includes('contacto') || lowerMessage.includes('whatsapp')) {
        reply = 'Puedes contactarnos por:\n📞 Teléfono: +56 9 1234 5678\n✉️ Email: contacto@intelident.com\n💬 WhatsApp: +56 9 1234 5678';
      }
      else if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('valor')) {
        reply = 'Los precios varían según el tratamiento. Te recomiendo agendar una consulta de evaluación para un presupuesto personalizado. ¿Te gustaría agendar una hora?';
      }
      else if (lowerMessage.includes('tratamiento') || lowerMessage.includes('limpieza') || lowerMessage.includes('ortodoncia')) {
        reply = 'Ofrecemos los siguientes tratamientos:\n🦷 Limpiezas dentales\n🦷 Ortodoncia (brackets)\n🦷 Endodoncias (conductos)\n🦷 Extracciones\n🦷 Implantes dentales\n🦷 Blanqueamiento dental\n\n¿Te interesa algún tratamiento en específico?';
      }
      else if (lowerMessage.includes('gracias') || lowerMessage.includes('ok') || lowerMessage.includes('vale')) {
        reply = '¡De nada! ¿Necesitas ayuda con algo más? Estoy aquí para ayudarte.';
      }
      else if (lowerMessage.includes('hola') || lowerMessage.includes('buenas') || lowerMessage.includes('saludos')) {
        reply = '¡Hola! ¿En qué puedo ayudarte hoy? Puedo ayudarte con:\n- 📅 Agendar citas\n- 🦷 Información de tratamientos\n- ⏰ Horarios de atención\n- 📍 Dirección y contacto\n- 💰 Consultar precios';
      }
      else {
        reply = 'Gracias por tu mensaje. ¿Podrías ser más específico? Puedo ayudarte con:\n- 📅 Agendar citas\n- 🦷 Información de tratamientos\n- ⏰ Horarios de atención\n- 📍 Dirección y contacto\n- 💰 Consultar precios';
      }

      console.log('📨 Respuesta enviada:', reply);
      res.json({ success: true, reply });
    } catch (error) {
      console.error('❌ Error en chatbot:', error);
      res.json({ 
        success: true, 
        reply: 'Lo siento, estoy teniendo problemas técnicos. Por favor intenta más tarde o contacta con soporte al +56 9 1234 5678.' 
      });
    }
  }
}
import axios from 'axios';
import { logger } from '../utils/logger';

class OpenAIService {
  private apiKey = process.env.OPENAI_API_KEY;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  async getChatbotResponse(message: string): Promise<string | null> {
    if (!this.apiKey) {
      logger.warn('OpenAI API key not configured');
      return null;
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Eres un asistente virtual para una clínica dental llamada InteliDent.
              Ayudas a los pacientes con:
              - Agendar citas
              - Información sobre tratamientos dentales (limpiezas, ortodoncia, endodoncias, extracciones, implantes, blanqueamiento)
              - Recordatorios de seguimiento
              - Responder preguntas comunes sobre procedimientos dentales
              - Información de horarios (Lun-Vie 9-18, Sab 9-13)
              - Dirección de la clínica
              - Precios orientativos
              Sé amable, profesional y conciso. Responde en español.`,
            },
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data.choices[0]?.message?.content || null;
    } catch (error) {
      logger.error('OpenAI API error:', error);
      return null;
    }
  }

  async analyzePatientData(patientData: any): Promise<any> {
    if (!this.apiKey) return null;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Analiza los siguientes datos del paciente y proporciona:
              1. Riesgos potenciales
              2. Recomendaciones de tratamiento
              3. Predicción de adherencia al tratamiento`,
            },
            { role: 'user', content: JSON.stringify(patientData) },
          ],
          max_tokens: 1000,
        },
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
          timeout: 15000,
        }
      );

      return { analysis: response.data.choices[0]?.message?.content };
    } catch (error) {
      logger.error('OpenAI analysis error:', error);
      return null;
    }
  }
}

export const openaiService = new OpenAIService();
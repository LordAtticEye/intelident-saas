import axios from 'axios';
import { logger } from '../utils/logger';

interface N8NWebhookData {
  event: string;
  data: any;
  patientId?: string;
}

class N8NService {
  private webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

  async triggerWorkflow(workflowId: string, data: N8NWebhookData) {
    try {
      const response = await axios.post(`${this.webhookUrl}/${workflowId}`, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });
      logger.info(`n8n workflow ${workflowId} triggered`, { data });
      return response.data;
    } catch (error) {
      logger.error('Error triggering n8n workflow:', error);
      return null;
    }
  }

  async sendAppointmentReminder(patientId: string, appointment: any) {
    return this.triggerWorkflow('appointment-reminder', {
      event: 'appointment.created',
      data: appointment,
      patientId,
    });
  }

  async sendFollowUpRecommendation(patientId: string, treatment: string) {
    return this.triggerWorkflow('follow-up', {
      event: 'treatment.completed',
      data: { treatment, patientId },
    });
  }

  async analyzePatientSentiment(patientId: string, interactions: any[]) {
    return this.triggerWorkflow('sentiment-analysis', {
      event: 'sentiment.analyze',
      data: { interactions },
      patientId,
    });
  }

  async generateTreatmentPlan(patientId: string, diagnosis: string) {
    return this.triggerWorkflow('treatment-plan', {
      event: 'treatment.generate',
      data: { diagnosis, patientId },
    });
  }
}

export const n8nService = new N8NService();
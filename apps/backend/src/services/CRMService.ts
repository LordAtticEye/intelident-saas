import { PatientCRM } from '../models/PatientCRM';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

class CRMService {
  async createPatientRecord(patientId: string, source: string = 'web') {
    const existing = await PatientCRM.findOne({ patientId });
    if (existing) return existing;

    const record = await PatientCRM.create({
      patientId,
      source,
      status: 'lead',
      tags: [],
      interactions: [],
    });

    logger.info(`CRM record created for patient: ${patientId}`);
    return record;
  }

  async addInteraction(patientId: string, interaction: any) {
    const record = await PatientCRM.findOne({ patientId });
    if (!record) throw new AppError('Patient CRM record not found', 404);

    record.interactions.push(interaction);
    record.lastContact = new Date();
    await record.save();

    return record;
  }

  async updatePatientStatus(patientId: string, status: string) {
    const record = await PatientCRM.findOneAndUpdate(
      { patientId },
      { status },
      { new: true }
    );
    return record;
  }

  async getCRMAnalytics() {
    const totalPatients = await PatientCRM.countDocuments();
    const activePatients = await PatientCRM.countDocuments({ status: 'active' });
    const leads = await PatientCRM.countDocuments({ status: 'lead' });
    
    const avgSatisfaction = await PatientCRM.aggregate([
      { $group: { _id: null, avg: { $avg: '$satisfactionScore' } } }
    ]);

    const sourceBreakdown = await PatientCRM.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    return {
      totalPatients,
      activePatients,
      leads,
      avgSatisfaction: avgSatisfaction[0]?.avg || 0,
      sourceBreakdown,
    };
  }

  async getPatientsNeedingFollowUp() {
    const today = new Date();
    return await PatientCRM.find({
      nextFollowUp: { $lte: today },
      status: { $in: ['lead', 'active'] }
    }).populate('patientId', 'firstName lastName email phone');
  }
}

export const crmService = new CRMService();
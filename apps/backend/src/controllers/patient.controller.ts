import { Response, NextFunction } from 'express';
import { Patient } from '../models/Patient';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/AppError';

export class PatientController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page  = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip  = (page - 1) * limit;

      const [patients, total] = await Promise.all([
        Patient.find({ isActive: true }).skip(skip).limit(limit).sort({ lastName: 1 }),
        Patient.countDocuments({ isActive: true }),
      ]);

      res.json({
        success: true,
        data: { patients, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
      });
    } catch (err) { next(err); }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) throw new AppError('Paciente no encontrado', 404);
      res.json({ success: true, data: { patient } });
    } catch (err) { next(err); }
  };

  search = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = req.query.q as string;
      const patients = await Patient.find(
        { $text: { $search: q }, isActive: true },
        { score: { $meta: 'textScore' } },
      ).sort({ score: { $meta: 'textScore' } }).limit(20);
      res.json({ success: true, data: { patients } });
    } catch (err) { next(err); }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patient = await Patient.create(req.body);
      res.status(201).json({ success: true, data: { patient } });
    } catch (err) { next(err); }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patient = await Patient.findByIdAndUpdate(
        req.params.id, req.body, { new: true, runValidators: true },
      );
      if (!patient) throw new AppError('Paciente no encontrado', 404);
      res.json({ success: true, data: { patient } });
    } catch (err) { next(err); }
  };

  addDentalNote = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) throw new AppError('Paciente no encontrado', 404);

      patient.medicalHistory.dentalNotes.push({
        ...req.body,
        dentistId: req.user!.userId,
        date:      new Date(),
      } as any);

      await patient.save();
      res.status(201).json({ success: true, data: { patient } });
    } catch (err) { next(err); }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Soft delete
      const patient = await Patient.findByIdAndUpdate(
        req.params.id, { isActive: false }, { new: true },
      );
      if (!patient) throw new AppError('Paciente no encontrado', 404);
      res.json({ success: true, message: 'Paciente eliminado' });
    } catch (err) { next(err); }
  };
}
import { Response, NextFunction } from 'express';
import { Appointment } from '../models/Appointment';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/AppError';
import { AppointmentStatus } from '@intelident/shared';

export class AppointmentController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filter: any = {};
      if (req.query.from || req.query.to) {
        filter.date = {};
        if (req.query.from) filter.date.$gte = new Date(req.query.from as string);
        if (req.query.to)   filter.date.$lte = new Date(req.query.to as string);
      }
      if (req.query.dentistId) filter.dentistId = req.query.dentistId;

      const appointments = await Appointment.find(filter)
        .populate('patientId', 'firstName lastName phone')
        .populate('dentistId', 'firstName lastName')
        .sort({ date: 1 });

      res.json({ success: true, data: { appointments } });
    } catch (err) { next(err); }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Verificar conflictos de horario
      const { dentistId, date, duration = 30 } = req.body;
      const from = new Date(date);
      const to   = new Date(from.getTime() + duration * 60_000);

      const conflict = await Appointment.findOne({
        dentistId,
        status: { $nin: [AppointmentStatus.CANCELLED] },
        date:   { $lt: to },
        $expr:  { $gt: [{ $add: ['$date', { $multiply: ['$duration', 60000] }] }, from.getTime()] },
      });

      if (conflict) throw new AppError('El dentista ya tiene una cita en ese horario', 409);

      const appointment = await Appointment.create({
        ...req.body,
        createdBy: req.user!.userId,
      });

      res.status(201).json({ success: true, data: { appointment } });
    } catch (err) { next(err); }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true },
      );
      if (!appointment) throw new AppError('Cita no encontrada', 404);
      res.json({ success: true, data: { appointment } });
    } catch (err) { next(err); }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status: AppointmentStatus.CANCELLED },
        { new: true },
      );
      if (!appointment) throw new AppError('Cita no encontrada', 404);
      res.json({ success: true, message: 'Cita cancelada' });
    } catch (err) { next(err); }
  };
}
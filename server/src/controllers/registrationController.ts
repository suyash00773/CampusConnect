import { Request, Response, NextFunction } from 'express';
import { store } from '../services/store.js';
import { exportRegistrationsToCsv } from '../utils/csvExporter.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await store.registerStudent(req.body);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! See you at the event.',
      data: {
        registrationId: result.registration.registrationId,
        studentName: result.registration.fullName,
        email: result.registration.email,
        college: result.registration.college,
        academicYear: result.registration.academicYear,
        phone: result.registration.phone,
        status: result.registration.status,
        registeredAt: result.registration.registeredAt,
        event: result.event,
      },
    });
  } catch (error: any) {
    if (error.message && error.message.includes('already registered')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message && error.message.includes('full capacity')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const getRegistrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId, search, academicYear, status, page = '1', limit = '50' } = req.query;

    const result = await store.getRegistrations({
      eventId: typeof eventId === 'string' ? eventId : undefined,
      search: typeof search === 'string' ? search : undefined,
      academicYear: typeof academicYear === 'string' ? academicYear : undefined,
      status: typeof status === 'string' ? status : undefined,
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 50,
    });

    return res.status(200).json({
      success: true,
      data: result.registrations,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteRegistration(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registration cancelled and record removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId } = req.query;
    const rows = await store.getRegistrationsForExport(
      typeof eventId === 'string' ? eventId : undefined
    );

    const csvContent = exportRegistrationsToCsv(rows);
    const dateStamp = new Date().toISOString().split('T')[0];
    const filename = `campusconnect-registrations-${dateStamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

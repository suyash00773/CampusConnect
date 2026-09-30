import { Request, Response, NextFunction } from 'express';
import { store } from '../services/store.js';
import { getDbStatus } from '../config/db.js';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await store.getDashboardStats();
    const dbStatus = getDbStatus();

    return res.status(200).json({
      success: true,
      data: {
        ...stats,
        database: dbStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const seedDatabase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await store.resetAndSeed();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

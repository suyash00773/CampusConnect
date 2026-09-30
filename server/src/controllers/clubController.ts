import { Request, Response, NextFunction } from 'express';
import { store } from '../services/store.js';

export const getClubs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clubs = await store.getClubs();
    return res.status(200).json({
      success: true,
      data: clubs,
    });
  } catch (error) {
    next(error);
  }
};

export const getClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrSlug } = req.params;
    const club = await store.getClubByIdOrSlug(idOrSlug);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found with that identifier or URL slug',
      });
    }

    return res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

export const createClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const club = await store.createClub(req.body);
    return res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await store.updateClub(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Club not found to update',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteClub(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Club not found to delete',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Club deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { store } from '../services/store.js';

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      club,
      timeframe,
      status,
      sort,
      page = '1',
      limit = '20',
    } = req.query;

    const result = await store.getEvents({
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      club: typeof club === 'string' ? club : undefined,
      timeframe: (timeframe as any) || 'all',
      status: typeof status === 'string' ? status : undefined,
      sort: typeof sort === 'string' ? sort : 'date-asc',
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 20,
    });

    return res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await store.getFeaturedEvents();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrSlug } = req.params;
    const event = await store.getEventByIdOrSlug(idOrSlug);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with that identifier or URL slug.',
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newEvent = await store.createEvent(req.body);
    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await store.updateEvent(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Event not found to update',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteEvent(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Event not found to delete',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event and related registrations removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

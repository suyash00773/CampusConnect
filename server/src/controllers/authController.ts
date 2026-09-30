import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../services/store.js';
import { ENV } from '../config/env.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const admin = await store.findAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No admin account found with that email.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.',
      });
    }

    const payload = {
      id: String(admin._id),
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        id: String(admin._id),
        username: admin.username,
        email: admin.email,
        name: admin.name || 'Campus Administrator',
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const admin = await store.findAdminById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    next(error);
  }
};

import { seedUserData } from '../utils/seedData.js';

export const triggerSeed = async (req, res, next) => {
  try {
    const stats = await seedUserData(req.user.id);
    res.json({
      success: true,
      message: 'Realistic 12-month sustainability dataset loaded successfully.',
      stats,
    });
  } catch (error) {
    next(error);
  }
};

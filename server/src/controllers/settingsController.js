import { DEFAULT_EMISSION_FACTORS } from '../config/factors.js';
import User from '../models/User.js';

export const getEmissionFactors = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const custom = user?.customEmissionFactors || {};

    const factors = Object.entries(DEFAULT_EMISSION_FACTORS).map(([key, def]) => {
      const customVal = custom instanceof Map ? custom.get(key) : custom[key];
      return {
        key,
        name: def.name,
        unit: def.unit,
        scope: def.scope,
        defaultFactor: def.factor,
        activeFactor: typeof customVal === 'number' ? customVal : def.factor,
        isCustomized: typeof customVal === 'number',
        description: def.description,
      };
    });

    res.json({ success: true, factors });
  } catch (error) {
    next(error);
  }
};

export const updateEmissionFactors = async (req, res, next) => {
  try {
    const { factors } = req.body; // e.g. { electricity: 0.41, natural_gas: 2.1 }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.customEmissionFactors = factors || {};
    await user.save();

    res.json({
      success: true,
      message: 'Emission factors updated successfully',
      customFactors: user.customEmissionFactors,
    });
  } catch (error) {
    next(error);
  }
};

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { seedUserData } from '../utils/seedData.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'TerraTrack_jwt_secret_dev_2026', {
    expiresIn: '30d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, organization, unitSystem, facilityArea, headcount } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with that email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      organization: organization || `${name}'s Organization`,
      unitSystem: unitSystem || 'metric',
      facilityArea: facilityArea || 12000,
      headcount: headcount || 35,
    });

    // Automatically seed an initial starter baseline for smooth onboarding
    try {
      await seedUserData(user._id);
    } catch (seedErr) {
      console.warn('Initial seed creation note:', seedErr.message);
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        unitSystem: user.unitSystem,
        facilityArea: user.facilityArea,
        headcount: user.headcount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        unitSystem: user.unitSystem,
        facilityArea: user.facilityArea,
        headcount: user.headcount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Instant Demo Login handler: guarantees immediate access with rich realistic sample data
 */
export const demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'sustainability.demo@TerraTrack.io';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Elena Vance',
        email: demoEmail,
        password: 'TerraTrackDemoPassword2026!',
        organization: 'Verdant Global Technologies',
        role: 'sustainability_lead',
        unitSystem: 'metric',
        facilityArea: 24000,
        headcount: 75,
      });
      await seedUserData(user._id);
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        unitSystem: user.unitSystem,
        facilityArea: user.facilityArea,
        headcount: user.headcount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, organization, role, unitSystem, facilityArea, headcount, customEmissionFactors } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (organization) user.organization = organization;
    if (role) user.role = role;
    if (unitSystem) user.unitSystem = unitSystem;
    if (facilityArea !== undefined) user.facilityArea = facilityArea;
    if (headcount !== undefined) user.headcount = headcount;
    if (customEmissionFactors) user.customEmissionFactors = customEmissionFactors;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        unitSystem: user.unitSystem,
        facilityArea: user.facilityArea,
        headcount: user.headcount,
        customEmissionFactors: user.customEmissionFactors,
      },
    });
  } catch (error) {
    next(error);
  }
};

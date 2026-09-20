import User from '../models/User.js';
import ResourceLog from '../models/ResourceLog.js';
import { generateSustainabilityInsights } from '../services/aiAdvisorService.js';
import { aggregateEmissions } from '../services/carbonService.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const logs = await ResourceLog.find({ user: req.user.id }).sort({ periodStart: 1 });

    const emissionsData = aggregateEmissions(logs);
    const recommendations = await generateSustainabilityInsights(user, logs);

    res.json({
      success: true,
      data: {
        summary: {
          totalCO2eKg: emissionsData.totalCO2eKg,
          totalCO2eTonnes: emissionsData.totalCO2eTonnes,
          scope1Kg: emissionsData.scope1Kg,
          scope2Kg: emissionsData.scope2Kg,
          scope3Kg: emissionsData.scope3Kg,
        },
        recommendations,
        provider: process.env.GEMINI_API_KEY ? 'Gemini 1.5 Pro/Flash' : 'EcoPulse GHG Protocol Rule Engine',
      },
    });
  } catch (error) {
    next(error);
  }
};

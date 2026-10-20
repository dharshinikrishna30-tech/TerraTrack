import ResourceLog from '../models/ResourceLog.js';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { aggregateEmissions } from '../services/carbonService.js';

export const getReportSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const logs = await ResourceLog.find({ user: req.user.id }).sort({ periodStart: 1 });
    const goals = await Goal.find({ user: req.user.id });

    const emissionsData = aggregateEmissions(logs);

    // Identify top emitting resource
    let topEmitter = { resource: 'None', co2eKg: 0, percentage: 0 };
    Object.entries(emissionsData.byResource).forEach(([resKey, val]) => {
      if (val.co2eKg > topEmitter.co2eKg) {
        topEmitter = {
          resource: resKey,
          co2eKg: Math.round(val.co2eKg),
          percentage: emissionsData.totalCO2eKg > 0 ? Math.round((val.co2eKg / emissionsData.totalCO2eKg) * 100) : 0,
        };
      }
    });

    const goalsSummary = {
      total: goals.length,
      achieved: goals.filter((g) => g.status === 'achieved').length,
      inProgress: goals.filter((g) => g.status === 'in_progress').length,
      atRisk: goals.filter((g) => g.status === 'at_risk').length,
    };

    res.json({
      success: true,
      report: {
        organization: user.organization,
        headcount: user.headcount,
        facilityArea: user.facilityArea,
        unitSystem: user.unitSystem,
        generatedAt: new Date(),
        emissions: emissionsData,
        topEmitter,
        goalsSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportCSV = async (req, res, next) => {
  try {
    const logs = await ResourceLog.find({ user: req.user.id }).sort({ periodStart: -1 });

    const headers = [
      'Log ID',
      'Resource Type',
      'Scope',
      'Quantity',
      'Unit',
      'Normalized Quantity',
      'Emission Factor (kg CO2e/unit)',
      'Estimated CO2e (kg)',
      'Estimated CO2e (tonnes)',
      'Cost (USD)',
      'Period Start',
      'Period End',
      'Location',
      'Notes',
    ];

    const rows = logs.map((log) => [
      `"${log._id}"`,
      `"${log.resourceType}"`,
      `"${log.scope}"`,
      log.quantity,
      `"${log.unit}"`,
      log.normalizedQuantity,
      log.emissionFactorUsed,
      log.estimatedCO2e,
      Math.round((log.estimatedCO2e / 1000) * 1000) / 1000,
      log.cost || 0,
      `"${new Date(log.periodStart).toISOString().slice(0, 10)}"`,
      `"${new Date(log.periodEnd).toISOString().slice(0, 10)}"`,
      `"${(log.location || '').replace(/"/g, '""')}"`,
      `"${(log.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="TerraTrack-carbon-report.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

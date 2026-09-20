import ResourceLog from '../models/ResourceLog.js';
import User from '../models/User.js';
import { calculateCO2e, aggregateEmissions } from '../services/carbonService.js';
import { runAnomalyDetection } from '../services/anomalyService.js';

export const createLog = async (req, res, next) => {
  try {
    const { resourceType, quantity, unit, cost, periodStart, periodEnd, location, notes } = req.body;

    if (!resourceType || quantity === undefined || !unit || !periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resourceType, quantity, unit, periodStart, and periodEnd.',
      });
    }

    const user = await User.findById(req.user.id);
    const customFactors = user?.customEmissionFactors || {};

    const calculation = calculateCO2e(resourceType, quantity, unit, customFactors);

    const log = await ResourceLog.create({
      user: req.user.id,
      resourceType,
      quantity: parseFloat(quantity),
      unit,
      normalizedQuantity: calculation.normalizedQuantity,
      emissionFactorUsed: calculation.factorUsed,
      estimatedCO2e: calculation.estimatedCO2e,
      scope: calculation.scope,
      cost: cost ? parseFloat(cost) : 0,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      location: location || 'Main Facility',
      notes: notes || '',
    });

    // Run anomaly detection asynchronously to update alerts in real-time
    runAnomalyDetection(req.user.id).catch((err) =>
      console.error('Background anomaly detection note:', err.message)
    );

    res.status(201).json({
      success: true,
      log,
      calculationDetails: {
        formula: `${calculation.normalizedQuantity} ${calculation.standardUnit} × ${calculation.factorUsed} kg CO2e/${calculation.standardUnit} = ${calculation.estimatedCO2e} kg CO2e`,
        scope: calculation.scope,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const { resourceType, scope, startDate, endDate, search, limit = 100, page = 1 } = req.query;

    const query = { user: req.user.id };

    if (resourceType && resourceType !== 'all') {
      query.resourceType = resourceType;
    }

    if (scope && scope !== 'all') {
      query.scope = scope;
    }

    if (startDate || endDate) {
      query.periodStart = {};
      if (startDate) query.periodStart.$gte = new Date(startDate);
      if (endDate) query.periodStart.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { location: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await ResourceLog.countDocuments(query);
    const logs = await ResourceLog.find(query)
      .sort({ periodStart: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      logs,
    });
  } catch (error) {
    next(error);
  }
};

export const getLogById = async (req, res, next) => {
  try {
    const log = await ResourceLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Resource log not found' });
    }
    res.json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

export const updateLog = async (req, res, next) => {
  try {
    const { resourceType, quantity, unit, cost, periodStart, periodEnd, location, notes } = req.body;

    let log = await ResourceLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Resource log not found' });
    }

    const type = resourceType || log.resourceType;
    const qty = quantity !== undefined ? parseFloat(quantity) : log.quantity;
    const u = unit || log.unit;

    const user = await User.findById(req.user.id);
    const customFactors = user?.customEmissionFactors || {};
    const calculation = calculateCO2e(type, qty, u, customFactors);

    log.resourceType = type;
    log.quantity = qty;
    log.unit = u;
    log.normalizedQuantity = calculation.normalizedQuantity;
    log.emissionFactorUsed = calculation.factorUsed;
    log.estimatedCO2e = calculation.estimatedCO2e;
    log.scope = calculation.scope;
    if (cost !== undefined) log.cost = parseFloat(cost);
    if (periodStart) log.periodStart = new Date(periodStart);
    if (periodEnd) log.periodEnd = new Date(periodEnd);
    if (location) log.location = location;
    if (notes !== undefined) log.notes = notes;

    await log.save();

    res.json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

export const deleteLog = async (req, res, next) => {
  try {
    const log = await ResourceLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Resource log not found' });
    }
    res.json({ success: true, message: 'Resource log deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getEmissionSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const logs = await ResourceLog.find({ user: req.user.id }).sort({ periodStart: 1 });

    const summary = aggregateEmissions(logs);

    // Calculate Carbon Intensity metrics
    const headcount = user?.headcount || 1;
    const area = user?.facilityArea || 1;
    const intensityPerEmployee = Math.round((summary.totalCO2eKg / headcount) * 10) / 10;
    const intensityPerArea = Math.round((summary.totalCO2eKg / area) * 100) / 100;

    // Month-over-month comparison
    const months = Object.keys(summary.byMonth).sort();
    let momChangePercent = 0;
    if (months.length >= 2) {
      const currentMonth = summary.byMonth[months[months.length - 1]].totalCO2e;
      const priorMonth = summary.byMonth[months[months.length - 2]].totalCO2e;
      if (priorMonth > 0) {
        momChangePercent = Math.round(((currentMonth - priorMonth) / priorMonth) * 100);
      }
    }

    res.json({
      success: true,
      summary: {
        ...summary,
        intensity: {
          perEmployee: intensityPerEmployee,
          perArea: intensityPerArea,
          areaUnit: user?.unitSystem === 'imperial' ? 'sq ft' : 'sq m',
        },
        momChangePercent,
        activeLogCount: logs.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

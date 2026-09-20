import Goal from '../models/Goal.js';
import ResourceLog from '../models/ResourceLog.js';

export const createGoal = async (req, res, next) => {
  try {
    const { title, resourceType, baselineValue, targetValue, targetReductionPercent, targetDate, category, notes } = req.body;

    if (!title || baselineValue === undefined || targetValue === undefined || !targetDate) {
      return res.status(400).json({ success: false, message: 'Please provide title, baselineValue, targetValue, and targetDate.' });
    }

    const goal = await Goal.create({
      user: req.user.id,
      title,
      resourceType: resourceType || 'all',
      baselineValue: parseFloat(baselineValue),
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(baselineValue),
      targetReductionPercent: targetReductionPercent || Math.round(((baselineValue - targetValue) / baselineValue) * 100),
      targetDate: new Date(targetDate),
      category: category || 'carbon_neutrality',
      notes: notes || '',
    });

    res.status(201).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ targetDate: 1 });

    // Dynamic progress evaluation against recent 30-day logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        const query = {
          user: req.user.id,
          periodStart: { $gte: thirtyDaysAgo },
        };
        if (goal.resourceType !== 'all') {
          query.resourceType = goal.resourceType;
        }

        const recentLogs = await ResourceLog.find(query);
        const recentEmissionTotal = recentLogs.reduce((acc, l) => acc + (l.estimatedCO2e || 0), 0);

        if (recentLogs.length > 0) {
          goal.currentValue = Math.round(recentEmissionTotal * 100) / 100;
        }

        // Evaluate Status
        if (goal.currentValue <= goal.targetValue) {
          goal.status = 'achieved';
        } else if (new Date() > new Date(goal.targetDate)) {
          goal.status = 'at_risk';
        }

        await goal.save();
        return goal;
      })
    );

    res.json({ success: true, goals: updatedGoals });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    next(error);
  }
};

import Alert from '../models/Alert.js';
import ResourceLog from '../models/ResourceLog.js';
import Goal from '../models/Goal.js';

/**
 * Evaluates user consumption logs and active goals to detect anomalies, spikes, and drifts.
 * Creates or updates Alert documents accordingly.
 */
export const runAnomalyDetection = async (userId) => {
  const alertsCreated = [];

  try {
    // 1. Check for resource consumption spikes (>25% over rolling 3-month average)
    const logs = await ResourceLog.find({ user: userId }).sort({ periodStart: -1 });

    // Group logs by resourceType and month
    const resourceMonthly = {};
    logs.forEach((log) => {
      const month = new Date(log.periodStart).toISOString().slice(0, 7);
      if (!resourceMonthly[log.resourceType]) resourceMonthly[log.resourceType] = {};
      if (!resourceMonthly[log.resourceType][month]) resourceMonthly[log.resourceType][month] = 0;
      resourceMonthly[log.resourceType][month] += log.estimatedCO2e;
    });

    for (const [resource, monthsMap] of Object.entries(resourceMonthly)) {
      const months = Object.keys(monthsMap).sort().reverse();
      if (months.length >= 2) {
        const latestMonth = months[0];
        const latestVal = monthsMap[latestMonth];
        const priorMonths = months.slice(1, 4); // Up to 3 previous months
        const avgPrior = priorMonths.reduce((acc, m) => acc + monthsMap[m], 0) / priorMonths.length;

        if (avgPrior > 0 && latestVal > avgPrior * 1.25) {
          const percentIncrease = Math.round(((latestVal - avgPrior) / avgPrior) * 100);
          const title = `Consumption Surge: ${resource.replace('_', ' ').toUpperCase()}`;
          const message = `Usage in ${latestMonth} (${Math.round(latestVal)} kg CO2e) is ${percentIncrease}% higher than your 3-month rolling average (${Math.round(avgPrior)} kg CO2e).`;

          // Check if alert already exists for this month and resource
          const existing = await Alert.findOne({
            user: userId,
            type: 'spike',
            resourceType: resource,
            title,
          });

          if (!existing) {
            const newAlert = await Alert.create({
              user: userId,
              type: 'spike',
              severity: percentIncrease > 50 ? 'critical' : 'warning',
              title,
              message,
              resourceType: resource,
              threshold: avgPrior,
              detectedValue: latestVal,
            });
            alertsCreated.push(newAlert);
          }
        }
      }
    }

    // 2. Check Goal Drift
    const activeGoals = await Goal.find({ user: userId, status: 'in_progress' });
    const now = new Date();

    for (const goal of activeGoals) {
      const totalDuration = new Date(goal.targetDate) - new Date(goal.startDate);
      const elapsed = now - new Date(goal.startDate);

      if (totalDuration > 0 && elapsed > totalDuration * 0.5) {
        // More than half time has passed
        const targetReduction = goal.baselineValue - goal.targetValue;
        const actualReduction = goal.baselineValue - (goal.currentValue || goal.baselineValue);
        const progressRatio = targetReduction > 0 ? actualReduction / targetReduction : 0;

        if (progressRatio < 0.25) {
          // At less than 25% progress halfway through
          const title = `Goal at Risk: ${goal.title}`;
          const existing = await Alert.findOne({ user: userId, type: 'goal_drift', title });

          if (!existing) {
            const newAlert = await Alert.create({
              user: userId,
              type: 'goal_drift',
              severity: 'warning',
              title,
              message: `Goal is past 50% of the timeline (${new Date(goal.targetDate).toLocaleDateString()}), but reduction is pacing significantly behind target pace.`,
              resourceType: goal.resourceType,
              threshold: targetReduction,
              detectedValue: actualReduction,
            });
            alertsCreated.push(newAlert);

            // Update goal status
            goal.status = 'at_risk';
            await goal.save();
          }
        }
      }
    }

    return alertsCreated;
  } catch (error) {
    console.error('Error running anomaly detection:', error);
    return [];
  }
};

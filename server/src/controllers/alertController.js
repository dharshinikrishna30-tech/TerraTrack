import Alert from '../models/Alert.js';
import { runAnomalyDetection } from '../services/anomalyService.js';

export const getAlerts = async (req, res, next) => {
  try {
    // Run real-time check for latest consumption trends
    await runAnomalyDetection(req.user.id);

    const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
    const unreadCount = alerts.filter((a) => !a.isRead).length;

    res.json({
      success: true,
      unreadCount,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

export const markAlertRead = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.json({ success: true, alert });
  } catch (error) {
    next(error);
  }
};

export const resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isResolved: true, isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.json({ success: true, alert });
  } catch (error) {
    next(error);
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.json({ success: true, message: 'Alert removed' });
  } catch (error) {
    next(error);
  }
};

export const clearAllAlerts = async (req, res, next) => {
  try {
    await Alert.deleteMany({ user: req.user.id });
    res.json({ success: true, message: 'All alerts cleared' });
  } catch (error) {
    next(error);
  }
};

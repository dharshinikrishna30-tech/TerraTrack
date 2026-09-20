import ResourceLog from '../models/ResourceLog.js';
import Goal from '../models/Goal.js';
import Alert from '../models/Alert.js';
import { calculateCO2e } from '../services/carbonService.js';

export const seedUserData = async (userId) => {
  // Clear any existing logs, goals, and alerts for this user
  await ResourceLog.deleteMany({ user: userId });
  await Goal.deleteMany({ user: userId });
  await Alert.deleteMany({ user: userId });

  const now = new Date();
  const logsToInsert = [];

  // Generate 12 months of realistic multi-resource historical consumption
  // Month 0 = 11 months ago, Month 11 = current month
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEndDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthIndex = monthDate.getMonth(); // 0-11

    // Seasonal fluctuations: higher AC in summer (Jun-Aug), higher Gas heating in winter (Dec-Feb)
    const isSummer = monthIndex >= 5 && monthIndex <= 8;
    const isWinter = monthIndex >= 11 || monthIndex <= 2;

    // 1. Electricity (kWh)
    const baseElec = isSummer ? 4200 + Math.floor(Math.random() * 600) : 3100 + Math.floor(Math.random() * 400);
    const elecCalc = calculateCO2e('electricity', baseElec, 'kWh');
    logsToInsert.push({
      user: userId,
      resourceType: 'electricity',
      quantity: baseElec,
      unit: 'kWh',
      normalizedQuantity: elecCalc.normalizedQuantity,
      emissionFactorUsed: elecCalc.factorUsed,
      estimatedCO2e: elecCalc.estimatedCO2e,
      scope: elecCalc.scope,
      cost: Math.round(baseElec * 0.16 * 100) / 100,
      periodStart: monthDate,
      periodEnd: monthEndDate,
      location: 'Primary Headquarters & Labs',
      notes: isSummer ? 'Summer cooling and high computing lab loads' : 'Standard facility lighting and workstations',
    });

    // 2. Natural Gas (m3)
    const baseGas = isWinter ? 850 + Math.floor(Math.random() * 150) : 180 + Math.floor(Math.random() * 60);
    const gasCalc = calculateCO2e('natural_gas', baseGas, 'm3');
    logsToInsert.push({
      user: userId,
      resourceType: 'natural_gas',
      quantity: baseGas,
      unit: 'm3',
      normalizedQuantity: gasCalc.normalizedQuantity,
      emissionFactorUsed: gasCalc.factorUsed,
      estimatedCO2e: gasCalc.estimatedCO2e,
      scope: gasCalc.scope,
      cost: Math.round(baseGas * 0.78 * 100) / 100,
      periodStart: monthDate,
      periodEnd: monthEndDate,
      location: 'Central Boiler & Heating Facility',
      notes: isWinter ? 'Winter central hydronic heating loop' : 'Cafeteria kitchen supply and domestic hot water',
    });

    // 3. Fuel Diesel (Fleet transport)
    const baseDiesel = 420 + Math.floor(Math.random() * 80);
    const dieselCalc = calculateCO2e('fuel_diesel', baseDiesel, 'L');
    logsToInsert.push({
      user: userId,
      resourceType: 'fuel_diesel',
      quantity: baseDiesel,
      unit: 'L',
      normalizedQuantity: dieselCalc.normalizedQuantity,
      emissionFactorUsed: dieselCalc.factorUsed,
      estimatedCO2e: dieselCalc.estimatedCO2e,
      scope: dieselCalc.scope,
      cost: Math.round(baseDiesel * 1.55 * 100) / 100,
      periodStart: monthDate,
      periodEnd: monthEndDate,
      location: 'Logistics Depot',
      notes: 'Heavy commercial delivery van routes',
    });

    // 4. Fuel Petrol (Sales vehicles)
    const basePetrol = 280 + Math.floor(Math.random() * 50);
    const petrolCalc = calculateCO2e('fuel_petrol', basePetrol, 'L');
    logsToInsert.push({
      user: userId,
      resourceType: 'fuel_petrol',
      quantity: basePetrol,
      unit: 'L',
      normalizedQuantity: petrolCalc.normalizedQuantity,
      emissionFactorUsed: petrolCalc.factorUsed,
      estimatedCO2e: petrolCalc.estimatedCO2e,
      scope: petrolCalc.scope,
      cost: Math.round(basePetrol * 1.48 * 100) / 100,
      periodStart: monthDate,
      periodEnd: monthEndDate,
      location: 'Regional Sales Fleet',
      notes: 'Customer site inspection trips',
    });

    // 5. Water (m3)
    const baseWater = 190 + Math.floor(Math.random() * 30);
    const waterCalc = calculateCO2e('water', baseWater, 'm3');
    logsToInsert.push({
      user: userId,
      resourceType: 'water',
      quantity: baseWater,
      unit: 'm3',
      normalizedQuantity: waterCalc.normalizedQuantity,
      emissionFactorUsed: waterCalc.factorUsed,
      estimatedCO2e: waterCalc.estimatedCO2e,
      scope: waterCalc.scope,
      cost: Math.round(baseWater * 2.30 * 100) / 100,
      periodStart: monthDate,
      periodEnd: monthEndDate,
      location: 'Campus Utility Mains',
      notes: 'Domestic sanitation and landscape irrigation',
    });

    // 6. Waste Landfill (kg)
    const baseWaste = 450 + Math.floor(Math.random() * 70);
    const wasteCalc = calculateCO2e('waste_landfill', baseWaste, 'kg');
    logsToInsert.push({
      user: userId,
      resourceType: 'waste_landfill',
      quantity: baseWaste,
      unit: 'kg',
      normalizedQuantity: wasteCalc.normalizedQuantity,
      emissionFactorUsed: wasteCalc.factorUsed,
      estimatedCO2e: wasteCalc.estimatedCO2e,
      scope: wasteCalc.scope,
      cost: Math.round(baseWaste * 0.18 * 100) / 100,
      periodStart: monthDate,
      periodEnd: monthEndDate,
      location: 'Central Waste Compactor',
      notes: 'Non-diverted municipal solid waste',
    });

    // 7. Waste Recycled (kg)
    const baseRecycled = 310 + Math.floor(Math.random() * 60);
    const recCalc = calculateCO2e('waste_recycled', baseRecycled, 'kg');
    logsToInsert.push({
      user: userId,
      resourceType: 'waste_recycled',
      quantity: baseRecycled,
      unit: 'kg',
      normalizedQuantity: recCalc.normalizedQuantity,
      emissionFactorUsed: recCalc.factorUsed,
      estimatedCO2e: recCalc.estimatedCO2e,
      scope: recCalc.scope,
      cost: Math.round(baseRecycled * 0.08 * 100) / 100,
      periodStart: monthDate,
      periodEnd: monthEndDate,
      location: 'Materials Recovery Station',
      notes: 'Corrugated cardboard, clean aluminum, and shredded paper',
    });
  }

  await ResourceLog.insertMany(logsToInsert);

  // Seed Realistic Goals
  const targetDate1 = new Date();
  targetDate1.setMonth(targetDate1.getMonth() + 6);
  const targetDate2 = new Date();
  targetDate2.setMonth(targetDate2.getMonth() + 10);
  const targetDate3 = new Date();
  targetDate3.setMonth(targetDate3.getMonth() + 3);

  await Goal.create([
    {
      user: userId,
      title: 'Reduce Scope 2 Grid Electricity by 20%',
      resourceType: 'electricity',
      baselineValue: 1600, // kg CO2e monthly
      targetValue: 1280,
      currentValue: 1390,
      targetReductionPercent: 20,
      startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
      targetDate: targetDate1,
      category: 'energy_efficiency',
      status: 'in_progress',
      notes: 'Focus on smart thermostat setbacks, LED retrofit in warehouse, and employee shutdown pledges.',
    },
    {
      user: userId,
      title: 'Achieve 70% Solid Waste Diversion Rate',
      resourceType: 'waste_landfill',
      baselineValue: 260,
      targetValue: 100,
      currentValue: 145,
      targetReductionPercent: 61,
      startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      targetDate: targetDate2,
      category: 'waste_diversion',
      status: 'in_progress',
      notes: 'Eliminate single-use breakroom plastics and partner with local composting hauler.',
    },
    {
      user: userId,
      title: 'Fleet Mobile Combustion Transition to EV Pilot',
      resourceType: 'fuel_diesel',
      baselineValue: 1125,
      targetValue: 800,
      currentValue: 1040,
      targetReductionPercent: 28,
      startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      targetDate: targetDate3,
      category: 'fleet_decarbonization',
      status: 'in_progress',
      notes: 'Acquire 2 electric courier vans and optimize logistics delivery clusters.',
    },
  ]);

  // Seed Realistic Alerts
  await Alert.create([
    {
      user: userId,
      type: 'spike',
      severity: 'warning',
      title: 'HVAC Summer Peak Load Surge',
      message: 'Electricity consumption spiked 24% over the 3-month baseline during recent heatwave. Recommended action: inspect chiller economizer.',
      resourceType: 'electricity',
      threshold: 3400,
      detectedValue: 4216,
      isRead: false,
      isResolved: false,
    },
    {
      user: userId,
      type: 'anomaly',
      severity: 'info',
      title: 'Favorable Waste Diversion Trend Detected',
      message: 'Recycled waste ratio exceeded 40% of total mass for two consecutive months, outpacing initial baseline projections.',
      resourceType: 'waste_recycled',
      threshold: 30,
      detectedValue: 42,
      isRead: false,
      isResolved: false,
    },
  ]);

  return { logsCount: logsToInsert.length, goalsCount: 3, alertsCount: 2 };
};

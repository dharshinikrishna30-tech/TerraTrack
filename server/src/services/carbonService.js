import { DEFAULT_EMISSION_FACTORS, UNIT_CONVERSIONS } from '../config/factors.js';

/**
 * Normalizes input quantities to standard metric units and calculates CO2e.
 * Returns normalized quantity, factor applied, scope, and estimated CO2e in kg.
 */
export const calculateCO2e = (resourceType, quantity, unit, customFactors = {}) => {
  const baseDef = DEFAULT_EMISSION_FACTORS[resourceType];
  if (!baseDef) {
    throw new Error(`Unsupported resource type: ${resourceType}`);
  }

  const numQty = parseFloat(quantity);
  if (isNaN(numQty) || numQty < 0) {
    throw new Error('Quantity must be a positive numeric value');
  }

  let normalizedQuantity = numQty;
  const primaryUnit = baseDef.unit;

  // Convert secondary or imperial units to primary metric unit
  switch (unit) {
    case 'MWh':
      normalizedQuantity = numQty * 1000;
      break;
    case 'gal':
      normalizedQuantity = numQty * UNIT_CONVERSIONS.gal_to_L;
      break;
    case 'therm':
      normalizedQuantity = numQty * UNIT_CONVERSIONS.therm_to_m3;
      break;
    case 'lb':
      normalizedQuantity = numQty * UNIT_CONVERSIONS.lb_to_kg;
      break;
    case 'ton':
      normalizedQuantity = numQty * 1000;
      break;
    default:
      // If already in primary unit or compatible
      normalizedQuantity = numQty;
      break;
  }

  // Determine factor (User custom override if present, else standard GHG factor)
  let factorUsed = baseDef.factor;
  if (customFactors && typeof customFactors[resourceType] === 'number') {
    factorUsed = customFactors[resourceType];
  } else if (customFactors && customFactors instanceof Map && customFactors.has(resourceType)) {
    factorUsed = customFactors.get(resourceType);
  }

  const rawCO2e = normalizedQuantity * factorUsed;
  const estimatedCO2e = Math.round(rawCO2e * 100) / 100; // 2 decimal precision

  return {
    normalizedQuantity: Math.round(normalizedQuantity * 100) / 100,
    factorUsed,
    estimatedCO2e,
    scope: baseDef.scope,
    standardUnit: primaryUnit,
  };
};

/**
 * Aggregates logs by month and calculates Scope 1, 2, 3 totals
 */
export const aggregateEmissions = (logs) => {
  const result = {
    totalCO2eKg: 0,
    totalCO2eTonnes: 0,
    scope1Kg: 0,
    scope2Kg: 0,
    scope3Kg: 0,
    totalCost: 0,
    byResource: {},
    byMonth: {},
  };

  logs.forEach((log) => {
    const co2 = log.estimatedCO2e || 0;
    const cost = log.cost || 0;

    result.totalCO2eKg += co2;
    result.totalCost += cost;

    if (log.scope === 'Scope 1') result.scope1Kg += co2;
    else if (log.scope === 'Scope 2') result.scope2Kg += co2;
    else if (log.scope === 'Scope 3') result.scope3Kg += co2;

    // By Resource
    if (!result.byResource[log.resourceType]) {
      result.byResource[log.resourceType] = {
        co2eKg: 0,
        quantity: 0,
        unit: log.unit,
        cost: 0,
      };
    }
    result.byResource[log.resourceType].co2eKg += co2;
    result.byResource[log.resourceType].quantity += log.quantity;
    result.byResource[log.resourceType].cost += cost;

    // By Month (YYYY-MM)
    const monthKey = new Date(log.periodStart).toISOString().slice(0, 7);
    if (!result.byMonth[monthKey]) {
      result.byMonth[monthKey] = {
        month: monthKey,
        totalCO2e: 0,
        scope1: 0,
        scope2: 0,
        scope3: 0,
        electricity: 0,
        fuel: 0,
        gas: 0,
        water: 0,
        waste: 0,
        cost: 0,
      };
    }

    result.byMonth[monthKey].totalCO2e += co2;
    result.byMonth[monthKey].cost += cost;
    if (log.scope === 'Scope 1') result.byMonth[monthKey].scope1 += co2;
    if (log.scope === 'Scope 2') result.byMonth[monthKey].scope2 += co2;
    if (log.scope === 'Scope 3') result.byMonth[monthKey].scope3 += co2;

    if (log.resourceType === 'electricity') result.byMonth[monthKey].electricity += co2;
    if (log.resourceType.startsWith('fuel_')) result.byMonth[monthKey].fuel += co2;
    if (log.resourceType === 'natural_gas') result.byMonth[monthKey].gas += co2;
    if (log.resourceType === 'water') result.byMonth[monthKey].water += co2;
    if (log.resourceType.startsWith('waste_')) result.byMonth[monthKey].waste += co2;
  });

  result.totalCO2eTonnes = Math.round((result.totalCO2eKg / 1000) * 100) / 100;
  result.totalCO2eKg = Math.round(result.totalCO2eKg * 100) / 100;
  result.scope1Kg = Math.round(result.scope1Kg * 100) / 100;
  result.scope2Kg = Math.round(result.scope2Kg * 100) / 100;
  result.scope3Kg = Math.round(result.scope3Kg * 100) / 100;

  return result;
};

/**
 * Standard GHG Protocol & EPA / DEFRA Emission Factors
 * All base factors normalized to metric standard (kg CO2e per primary unit)
 */

export const DEFAULT_EMISSION_FACTORS = {
  electricity: {
    name: 'Grid Electricity',
    unit: 'kWh',
    factor: 0.385, // kg CO2e per kWh
    scope: 'Scope 2',
    description: 'National grid average electricity generation and transmission loss'
  },
  fuel_diesel: {
    name: 'Diesel Fuel',
    unit: 'L',
    factor: 2.68, // kg CO2e per Liter
    scope: 'Scope 1',
    description: 'Direct combustion of commercial diesel in fleet vehicles or generators'
  },
  fuel_petrol: {
    name: 'Motor Gasoline / Petrol',
    unit: 'L',
    factor: 2.31, // kg CO2e per Liter
    scope: 'Scope 1',
    description: 'Direct combustion of petrol/gasoline in corporate vehicles'
  },
  natural_gas: {
    name: 'Natural Gas',
    unit: 'm3',
    factor: 2.03, // kg CO2e per cubic meter
    scope: 'Scope 1',
    description: 'On-site natural gas heating and boiler systems'
  },
  water: {
    name: 'Municipal Water Supply',
    unit: 'm3',
    factor: 0.344, // kg CO2e per m3
    scope: 'Scope 3',
    description: 'Emissions associated with water extraction, municipal treatment, and distribution'
  },
  waste_landfill: {
    name: 'Municipal Solid Waste (Landfill)',
    unit: 'kg',
    factor: 0.58, // kg CO2e per kg
    scope: 'Scope 3',
    description: 'Methane and carbon release from municipal landfill decomposition'
  },
  waste_recycled: {
    name: 'Diverted / Recycled Waste',
    unit: 'kg',
    factor: 0.05, // kg CO2e per kg
    scope: 'Scope 3',
    description: 'Transport & processing of recyclable materials (offsets virgin extraction)'
  }
};

/**
 * Conversion rates for Imperial units to Metric standard
 */
export const UNIT_CONVERSIONS = {
  gal_to_L: 3.78541,
  therm_to_m3: 2.83168,
  lb_to_kg: 0.453592,
  sqft_to_sqm: 0.092903
};

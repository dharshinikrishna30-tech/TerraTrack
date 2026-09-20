import { aggregateEmissions } from './carbonService.js';

/**
 * High-precision rule-based sustainability recommendation generator
 * Calibrated against real GHG Protocol corporate sustainability benchmarks
 */
const generateAlgorithmicRecommendations = (emissionsData, user) => {
  const recommendations = [];
  const { totalCO2eKg, scope1Kg, scope2Kg, scope3Kg, byResource, totalCost } = emissionsData;

  const total = totalCO2eKg || 1; // prevent div by zero
  const elecCO2 = byResource['electricity']?.co2eKg || 0;
  const gasCO2 = byResource['natural_gas']?.co2eKg || 0;
  const dieselCO2 = byResource['fuel_diesel']?.co2eKg || 0;
  const petrolCO2 = byResource['fuel_petrol']?.co2eKg || 0;
  const waterCO2 = byResource['water']?.co2eKg || 0;
  const wasteCO2 = byResource['waste_landfill']?.co2eKg || 0;

  // 1. Electricity / Scope 2 Efficiency
  if (elecCO2 > 0) {
    const elecShare = Math.round((elecCO2 / total) * 100);
    const potentialElecSavingsKg = Math.round(elecCO2 * 0.22);
    const costSavings = Math.round((byResource['electricity']?.cost || 1200) * 0.22);

    recommendations.push({
      id: 'rec_elec_hvac',
      title: 'Commercial HVAC Smart Setback & Automated Thermostats',
      category: 'Energy Efficiency',
      priority: elecShare > 40 ? 'High' : 'Medium',
      difficulty: 'Easy',
      observation: `Grid electricity accounts for ${elecShare}% (${Math.round(elecCO2)} kg CO2e) of your total footprint. Typical facilities waste up to 25% of HVAC cooling during off-peak and unoccupied hours.`,
      recommendation: 'Deploy programmable IoT smart thermostats with automated 4°F setbacks during unoccupied evenings and weekends, alongside variable frequency drives (VFD) on supply fans.',
      estimatedCO2eSavedKg: potentialElecSavingsKg,
      estimatedCostSavedUSD: costSavings,
      paybackPeriod: '2 - 4 months',
      actionSteps: [
        'Audit facility schedule and establish automated thermostat schedules (74°F cool / 68°F heat during occupancy).',
        'Install smart occupancy sensors in conference rooms, warehouses, and low-traffic zones.',
        'Review monthly peak demand interval data with your utility to identify unnecessary startup surges.'
      ],
      isAiGenerated: false,
    });

    if (elecCO2 > 1500) {
      recommendations.push({
        id: 'rec_elec_solar',
        title: 'Virtual Power Purchase Agreement (VPPA) or Rooftop Solar',
        category: 'Renewable Energy',
        priority: 'High',
        difficulty: 'Hard',
        observation: `With continuous annual Scope 2 electricity load, transitioning grid reliance to dedicated renewables will eliminate substantial long-term emissions.`,
        recommendation: 'Initiate a preliminary solar feasibility assessment or enter a Community Solar subscription to offset up to 80% of Scope 2 grid emissions with certified Renewable Energy Certificates (RECs).',
        estimatedCO2eSavedKg: Math.round(elecCO2 * 0.75),
        estimatedCostSavedUSD: Math.round((byResource['electricity']?.cost || 2000) * 0.35),
        paybackPeriod: '3 - 5 years (or immediate with zero-CAPEX PPA)',
        actionSteps: [
          'Request 12-month interval billing files from electricity provider.',
          'Issue RFP for zero-capital-outlay Power Purchase Agreement (PPA).',
          'Verify that Green-e certified RECs are permanently retired on your behalf.'
        ],
        isAiGenerated: false,
      });
    }
  }

  // 2. Natural Gas & Thermal Combustion
  if (gasCO2 > 0) {
    const gasShare = Math.round((gasCO2 / total) * 100);
    recommendations.push({
      id: 'rec_gas_boiler',
      title: 'Boiler Combustion Tuning & Thermal Insulation Retrofit',
      category: 'Heating & Gas',
      priority: gasShare > 25 ? 'High' : 'Medium',
      difficulty: 'Medium',
      observation: `Natural gas combustion produces ${Math.round(gasCO2)} kg CO2e (${gasShare}% of footprint). Uninsulated steam pipes and suboptimal fuel-to-air ratios result in 15-20% thermal losses.`,
      recommendation: 'Perform flue gas combustion tuning to optimize oxygen trim on boilers, and wrap all exposed valves and hot water distribution pipes with removable thermal insulation blankets.',
      estimatedCO2eSavedKg: Math.round(gasCO2 * 0.18),
      estimatedCostSavedUSD: Math.round((byResource['natural_gas']?.cost || 800) * 0.18),
      paybackPeriod: '6 - 9 months',
      actionSteps: [
        'Hire a certified mechanical technician to measure flue gas O2 levels and calibrate burner heads.',
        'Inspect mechanical rooms with an infrared thermal camera to locate heat dissipation leaks.',
        'Install high-density insulation covers across uninsulated steam lines and fittings.'
      ],
      isAiGenerated: false,
    });
  }

  // 3. Fleet & Transportation Fuel
  const totalFleetCO2 = dieselCO2 + petrolCO2;
  if (totalFleetCO2 > 0) {
    recommendations.push({
      id: 'rec_fleet_eco',
      title: 'Telematics Route Optimization & Fleet Electrification',
      category: 'Fleet & Logistics',
      priority: totalFleetCO2 > 1000 ? 'High' : 'Medium',
      difficulty: 'Medium',
      observation: `Corporate mobile combustion contributes ${Math.round(totalFleetCO2)} kg CO2e in direct Scope 1 emissions across fleet operations.`,
      recommendation: 'Implement GPS telematics for dynamic route clustering to eliminate idle engine time and reduce empty return miles by 14%. Begin phased EV pilot for light-duty urban vehicles.',
      estimatedCO2eSavedKg: Math.round(totalFleetCO2 * 0.16),
      estimatedCostSavedUSD: Math.round(((byResource['fuel_diesel']?.cost || 0) + (byResource['fuel_petrol']?.cost || 0)) * 0.16),
      paybackPeriod: '4 - 8 months',
      actionSteps: [
        'Deploy telematics devices to monitor vehicle idle times exceeding 3 minutes.',
        'Adopt algorithmic multi-stop route optimization software for daily transit.',
        'Conduct total cost of ownership (TCO) evaluation for transitioning passenger vehicles to electric.'
      ],
      isAiGenerated: false,
    });
  }

  // 4. Waste & Circularity
  if (wasteCO2 > 0) {
    recommendations.push({
      id: 'rec_waste_divert',
      title: 'Zero-Waste Stream Diversion & Organic Composting',
      category: 'Waste & Materials',
      priority: 'Medium',
      difficulty: 'Easy',
      observation: `Landfill waste generated ${Math.round(wasteCO2)} kg CO2e. Up to 60% of municipal commercial landfill waste is compostable food scraps, paper, or clean recyclables.`,
      recommendation: 'Transition to a 3-bin zero-waste station model (Compost, Clean Recyclables, Landfill) and negotiate weight-based hauler fees to capture diversion credits.',
      estimatedCO2eSavedKg: Math.round(wasteCO2 * 0.45),
      estimatedCostSavedUSD: Math.round((byResource['waste_landfill']?.cost || 300) * 0.3),
      paybackPeriod: 'Immediate',
      actionSteps: [
        'Conduct a 1-day waste characterization audit to quantify recyclable vs organic fractions.',
        'Replace individual desk trash cans with centralized high-visibility sorting stations.',
        'Partner with a commercial organic composting hauler for cafeteria and food waste.'
      ],
      isAiGenerated: false,
    });
  }

  // 5. Water Conservation
  if (waterCO2 > 0) {
    recommendations.push({
      id: 'rec_water_fixtures',
      title: 'Aerated Low-Flow Restroom Fixtures & Sub-metering',
      category: 'Water Conservation',
      priority: 'Low',
      difficulty: 'Easy',
      observation: `Facility water throughput generated ${Math.round(waterCO2)} kg CO2e in indirect municipal pumping and wastewater aeration footprint.`,
      recommendation: 'Install 0.5 GPM faucet aerators and pressure-compensating dual-flush valves across all commercial restrooms to reduce municipal throughput by 30%.',
      estimatedCO2eSavedKg: Math.round(waterCO2 * 0.32),
      estimatedCostSavedUSD: Math.round((byResource['water']?.cost || 250) * 0.32),
      paybackPeriod: '1 - 3 months',
      actionSteps: [
        'Retrofit standard sink faucets with tamper-proof 0.5 GPM laminar flow aerators.',
        'Perform dye-tablet testing on commercial toilets to eliminate silent flapper leaks.',
        'Install smart ultrasonic sub-meters on irrigation and cooling tower supply lines.'
      ],
      isAiGenerated: false,
    });
  }

  return recommendations;
};

/**
 * Fetches AI Sustainability recommendations using Gemini API if key is set,
 * or our GHG Protocol Rule Engine as reliable fallback.
 */
export const generateSustainabilityInsights = async (user, logs) => {
  const emissionsData = aggregateEmissions(logs);
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const prompt = `You are a certified corporate GHG Protocol Sustainability Auditor and ESG decarbonization expert.
Analyze the following environmental data for ${user.organization || 'the enterprise'} (Headcount: ${user.headcount}, Facility: ${user.facilityArea} sq meters):

Summary:
- Total Carbon Footprint: ${emissionsData.totalCO2eKg} kg CO2e (${emissionsData.totalCO2eTonnes} metric tonnes)
- Scope 1 (Direct Fuel & Gas): ${emissionsData.scope1Kg} kg CO2e
- Scope 2 (Grid Electricity): ${emissionsData.scope2Kg} kg CO2e
- Scope 3 (Water & Landfill Waste): ${emissionsData.scope3Kg} kg CO2e
- Total Resource Cost: $${emissionsData.totalCost}

Resource Breakdown:
${JSON.stringify(emissionsData.byResource, null, 2)}

Provide 4 to 5 highly specific, prioritized decarbonization recommendations.
Respond ONLY with a JSON array formatted exactly like this:
[
  {
    "id": "unique_string",
    "title": "Action Title",
    "category": "Energy Efficiency | Renewable Energy | Fleet & Logistics | Waste & Materials | Water Conservation",
    "priority": "High | Medium | Low",
    "difficulty": "Easy | Medium | Hard",
    "observation": "Data-backed observation referencing specific numbers from their data",
    "recommendation": "Concrete engineering or operational decarbonization step",
    "estimatedCO2eSavedKg": 120,
    "estimatedCostSavedUSD": 250,
    "paybackPeriod": "X months",
    "actionSteps": ["Step 1", "Step 2", "Step 3"]
  }
]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item) => ({ ...item, isAiGenerated: true }));
          }
        }
      }
    } catch (apiError) {
      console.warn('Gemini API call encountered error, falling back to rule engine:', apiError.message);
    }
  }

  // Fallback to rule engine
  return generateAlgorithmicRecommendations(emissionsData, user);
};

export interface SoilMoistureEstimate {
  estimatedPercentage: number;
  condition: 'Dry / Deficit' | 'Optimal' | 'Saturated / Waterlogged';
  evapotranspirationRate: number; // mm/day
}

export interface IrrigationGuidance {
  shouldIrrigate: boolean;
  recommendation: string;
  nextRecommendedWindow: string;
  waterSavingsPotential: string;
}

export interface SpraySuitability {
  isSuitable: boolean;
  score: number; // 0-100
  windSafety: 'Safe' | 'Marginal' | 'Unsafe (High Drift Risk)';
  rainWashoutRisk: 'Low' | 'Moderate' | 'High (Immediate Washout)';
  recommendation: string;
}

export interface CropAdvisory {
  cropName: string;
  growthStage: string;
  weatherRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  advisoryText: string;
  preventiveActions: string[];
}

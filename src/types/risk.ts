export type RiskLevel = 'low' | 'moderate' | 'high' | 'extreme';

export interface RiskFactor {
  id: string;
  name: string;
  points: number;
  maxPoints: number;
  description: string;
  category: 'rain' | 'wind' | 'lightning' | 'heat' | 'official_warning';
}

export interface WeatherRiskAssessment {
  score: number; // 0 to 100
  level: RiskLevel; // low, moderate, high, extreme
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReasons: string[];
  factors: RiskFactor[];
  summary: string;
  calculatedAt: string;
  primaryRiskHazard: string;
}

export interface OutdoorActivityAssessment {
  score: number; // 0 to 100 (higher means better conditions for outdoor sports/travel)
  status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Hazardous';
  suitableForCricket: boolean;
  suitableForRunning: boolean;
  suitableForCommuting: boolean;
  reasons: string[];
  precautions: string[];
}

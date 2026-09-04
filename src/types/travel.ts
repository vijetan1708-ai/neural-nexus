export interface RouteWeatherPoint {
  cityName: string;
  temperature: number;
  condition: string;
  rainProbability: number;
  windSpeed: number;
  visibilityKm: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
}

export interface TravelAssessment {
  origin: string;
  destination: string;
  travelDate: string;
  departureTime: string;
  travelMode: 'road' | 'train' | 'flight';
  travelRiskScore: number; // 0-100
  overallRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  originWeather: RouteWeatherPoint;
  destinationWeather: RouteWeatherPoint;
  delayProbability: number;
  recommendedGear: {
    umbrella: boolean;
    sunglasses: boolean;
    rainJacket: boolean;
    fogCaution: boolean;
    highWindCaution: boolean;
  };
  summaryAdvice: string;
}

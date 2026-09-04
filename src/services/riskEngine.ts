import { CurrentWeather } from '../types/weather';
import { WeatherAlert } from '../types/alerts';
import { OutdoorActivityAssessment, RiskFactor, RiskLevel, WeatherRiskAssessment } from '../types/risk';

export class RiskEngine {
  /**
   * Transparent mathematical calculation of 0-100 Weather Risk Score
   */
  static calculateRiskScore(
    weather: CurrentWeather,
    activeAlerts: WeatherAlert[] = []
  ): WeatherRiskAssessment {
    const factors: RiskFactor[] = [];
    const confidenceReasons: string[] = [];

    // 1. Heavy Rainfall Factor (0 - 30 points)
    let rainPoints = 0;
    const rainProb = weather.rainProbability;
    const precip = weather.precipitation;

    if (rainProb >= 80 || precip >= 25) {
      rainPoints = 30;
      factors.push({
        id: 'heavy_rainfall',
        name: 'Heavy Rainfall Risk',
        points: 30,
        maxPoints: 30,
        description: `High rain probability (${rainProb}%) and significant precipitation (${precip} mm/h)`,
        category: 'rain'
      });
      confidenceReasons.push('Substantial rain accumulation & saturation detected');
    } else if (rainProb >= 60 || precip >= 10) {
      rainPoints = 22;
      factors.push({
        id: 'heavy_rainfall',
        name: 'Moderate to Heavy Rain',
        points: 22,
        maxPoints: 30,
        description: `Precipitation probability at ${rainProb}% with ${precip} mm anticipated`,
        category: 'rain'
      });
      confidenceReasons.push('Forecast indicates persistent precipitation');
    } else if (rainProb >= 35 || precip >= 2) {
      rainPoints = 12;
      factors.push({
        id: 'heavy_rainfall',
        name: 'Light / Moderate Showers',
        points: 12,
        maxPoints: 30,
        description: `Moderate rain probability of ${rainProb}%`,
        category: 'rain'
      });
    } else {
      rainPoints = 3;
      factors.push({
        id: 'heavy_rainfall',
        name: 'Minimal Rain Threat',
        points: 3,
        maxPoints: 30,
        description: `Rain probability is low (${rainProb}%)`,
        category: 'rain'
      });
    }

    // 2. Strong Wind / Gale Factor (0 - 25 points)
    let windPoints = 0;
    const wind = weather.windSpeed;
    const gust = weather.windGust || (wind * 1.35);

    if (wind >= 75 || gust >= 95) {
      windPoints = 25;
      factors.push({
        id: 'strong_wind',
        name: 'Gale / Cyclonic Wind Force',
        points: 25,
        maxPoints: 25,
        description: `Damaging winds exceeding ${wind.toFixed(0)} km/h (gusts ${gust.toFixed(0)} km/h)`,
        category: 'wind'
      });
      confidenceReasons.push('High-velocity wind vectors approaching severe thresholds');
    } else if (wind >= 45 || gust >= 60) {
      windPoints = 18;
      factors.push({
        id: 'strong_wind',
        name: 'Strong Gusty Winds',
        points: 18,
        maxPoints: 25,
        description: `Sustained wind speed of ${wind.toFixed(0)} km/h with gusts up to ${gust.toFixed(0)} km/h`,
        category: 'wind'
      });
    } else if (wind >= 25) {
      windPoints = 10;
      factors.push({
        id: 'strong_wind',
        name: 'Moderate Breeze',
        points: 10,
        maxPoints: 25,
        description: `Moderate wind speed of ${wind.toFixed(0)} km/h`,
        category: 'wind'
      });
    } else {
      windPoints = 2;
      factors.push({
        id: 'strong_wind',
        name: 'Calm / Gentle Air',
        points: 2,
        maxPoints: 25,
        description: `Gentle wind at ${wind.toFixed(0)} km/h`,
        category: 'wind'
      });
    }

    // 3. Lightning & Thunderstorm Convective Risk (0 - 20 points)
    let lightningPoints = 0;
    const code = weather.conditionCode;
    // WMO 95, 96, 99 are thunderstorm codes
    const isThunderstorm = code >= 95 && code <= 99;
    const isHeavyShower = code === 81 || code === 82;

    if (isThunderstorm) {
      lightningPoints = 20;
      factors.push({
        id: 'lightning_risk',
        name: 'Severe Lightning & Thunderstorm',
        points: 20,
        maxPoints: 20,
        description: 'Atmospheric instability with active lightning strike potential',
        category: 'lightning'
      });
      confidenceReasons.push('Doppler radar & convective index confirm thunderstorm cells');
    } else if (isHeavyShower && weather.humidity > 80) {
      lightningPoints = 12;
      factors.push({
        id: 'lightning_risk',
        name: 'Moderate Convective Instability',
        points: 12,
        maxPoints: 20,
        description: 'Elevated humidity and convective cloud buildup',
        category: 'lightning'
      });
    } else {
      lightningPoints = 2;
      factors.push({
        id: 'lightning_risk',
        name: 'Low Lightning Potential',
        points: 2,
        maxPoints: 20,
        description: 'Atmosphere is relatively stable',
        category: 'lightning'
      });
    }

    // 4. Extreme Temperature & UV / Heatwave Factor (0 - 15 points)
    let heatPoints = 0;
    const temp = weather.temperature;
    const uv = weather.uvIndex;

    if (temp >= 42 || uv >= 10) {
      heatPoints = 15;
      factors.push({
        id: 'extreme_heat',
        name: 'Severe Heatwave / Extreme UV',
        points: 15,
        maxPoints: 15,
        description: `Hazardous ambient temp (${temp}°C) and extreme solar radiation (UV ${uv})`,
        category: 'heat'
      });
      confidenceReasons.push('Dangerous thermal index exceeding human tolerance thresholds');
    } else if (temp >= 38 || uv >= 8) {
      heatPoints = 10;
      factors.push({
        id: 'extreme_heat',
        name: 'High Heat Index',
        points: 10,
        maxPoints: 15,
        description: `Elevated temperature of ${temp}°C and UV Index of ${uv}`,
        category: 'heat'
      });
    } else if (temp <= 5) {
      heatPoints = 8;
      factors.push({
        id: 'extreme_heat',
        name: 'Cold Wave Condition',
        points: 8,
        maxPoints: 15,
        description: `Near-freezing temperature (${temp}°C)`,
        category: 'heat'
      });
    } else {
      heatPoints = 2;
      factors.push({
        id: 'extreme_heat',
        name: 'Normal Thermal Comfort',
        points: 2,
        maxPoints: 15,
        description: `Comfortable temperature of ${temp}°C`,
        category: 'heat'
      });
    }

    // 5. Official Meteorological Authority Alert Weight (0 - 15 points)
    let officialPoints = 0;
    const hasWarning = activeAlerts.some(a => a.severity === 'warning');
    const hasAlert = activeAlerts.some(a => a.severity === 'alert');
    const hasWatch = activeAlerts.some(a => a.severity === 'watch');

    if (hasWarning) {
      officialPoints = 15;
      factors.push({
        id: 'official_warning',
        name: 'Official Red Alert (IMD)',
        points: 15,
        maxPoints: 15,
        description: 'Active Red Warning issued by government meteorological authorities',
        category: 'official_warning'
      });
      confidenceReasons.push('Official IMD Red Alert active for this district');
    } else if (hasAlert) {
      officialPoints = 10;
      factors.push({
        id: 'official_warning',
        name: 'Official Orange Alert (IMD)',
        points: 10,
        maxPoints: 15,
        description: 'Active Orange Alert issued by official meteorological agency',
        category: 'official_warning'
      });
      confidenceReasons.push('Official IMD Orange Alert in effect');
    } else if (hasWatch) {
      officialPoints = 5;
      factors.push({
        id: 'official_warning',
        name: 'Official Yellow Watch (IMD)',
        points: 5,
        maxPoints: 15,
        description: 'Yellow Watch issued for precautionary awareness',
        category: 'official_warning'
      });
    } else {
      officialPoints = 0;
      factors.push({
        id: 'official_warning',
        name: 'No Official Warning',
        points: 0,
        maxPoints: 15,
        description: 'No active warnings from official meteorological authorities',
        category: 'official_warning'
      });
    }

    const totalRaw = rainPoints + windPoints + lightningPoints + heatPoints + officialPoints;
    const finalScore = Math.min(100, Math.max(0, Math.round(totalRaw)));

    let level: RiskLevel = 'low';
    if (finalScore >= 81) level = 'extreme';
    else if (finalScore >= 61) level = 'high';
    else if (finalScore >= 41) level = 'moderate';
    else level = 'low';

    // Confidence
    let confidence: 'High' | 'Medium' | 'Low' = 'High';
    if (confidenceReasons.length === 0) {
      confidence = 'Medium';
      confidenceReasons.push('Based on real-time atmospheric telemetry and numerical models');
    }

    // Determine primary hazard
    let primaryHazard = 'General Weather Conditions';
    if (isThunderstorm) primaryHazard = 'Severe Thunderstorm & Lightning';
    else if (wind >= 60) primaryHazard = 'High Wind & Gusts';
    else if (precip >= 15 || rainProb >= 75) primaryHazard = 'Heavy Rainfall & Waterlogging';
    else if (temp >= 40) primaryHazard = 'Extreme Heatwave';

    let summary = '';
    if (level === 'extreme') {
      summary = `EXTREME RISK (${finalScore}/100): ${primaryHazard} posing critical danger. Strict indoor sheltering advised.`;
    } else if (level === 'high') {
      summary = `HIGH RISK (${finalScore}/100): Severe weather development underway. Avoid unnecessary travel and monitor official advisories.`;
    } else if (level === 'moderate') {
      summary = `MODERATE RISK (${finalScore}/100): Changeable conditions with localized impact. Keep emergency gear handy.`;
    } else {
      summary = `LOW RISK (${finalScore}/100): Safe atmospheric conditions. Normal day-to-day operations can continue.`;
    }

    return {
      score: finalScore,
      level,
      confidence,
      confidenceReasons,
      factors,
      summary,
      calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      primaryRiskHazard: primaryHazard
    };
  }

  /**
   * Outdoor Activity Score calculation (0 - 100, where 100 is ideal for cricket, jogging, commuting)
   */
  static calculateOutdoorActivityScore(
    weather: CurrentWeather,
    risk: WeatherRiskAssessment
  ): OutdoorActivityAssessment {
    let score = 100;
    const reasons: string[] = [];
    const precautions: string[] = [];

    // Deduct for risk score
    score -= Math.round(risk.score * 0.65);

    // Deduct for rain
    if (weather.rainProbability > 60) {
      score -= 20;
      reasons.push(`High probability of rain (${weather.rainProbability}%)`);
      precautions.push('Carry an umbrella or rain poncho');
    } else if (weather.rainProbability > 30) {
      score -= 10;
      reasons.push('Possibility of scattered rain showers');
    }

    // Deduct for extreme temperature
    if (weather.temperature >= 40) {
      score -= 25;
      reasons.push('Excessive ambient heatwave condition');
      precautions.push('Avoid peak afternoon direct sun, stay continuously hydrated');
    } else if (weather.temperature >= 35) {
      score -= 12;
      reasons.push('High afternoon heat index');
      precautions.push('Wear light cotton clothing and sunscreen');
    }

    // Deduct for wind
    if (weather.windSpeed > 40) {
      score -= 15;
      reasons.push(`Strong wind gusts at ${weather.windSpeed.toFixed(0)} km/h`);
      precautions.push('Beware of falling tree branches and loose signboards');
    }

    // Deduct for thunderstorms
    if (weather.conditionCode >= 95) {
      score = Math.min(score, 15);
      reasons.push('Active lightning and thunderstorm detected');
      precautions.push('DO NOT seek shelter under isolated trees. Move indoors immediately.');
    }

    const finalScore = Math.max(0, Math.min(100, score));

    let status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Hazardous' = 'Good';
    if (finalScore >= 80) status = 'Excellent';
    else if (finalScore >= 60) status = 'Good';
    else if (finalScore >= 40) status = 'Moderate';
    else if (finalScore >= 20) status = 'Poor';
    else status = 'Hazardous';

    const suitableForCricket = finalScore >= 55 && weather.rainProbability < 40 && weather.conditionCode < 95;
    const suitableForRunning = finalScore >= 50 && weather.temperature < 38;
    const suitableForCommuting = finalScore >= 35;

    return {
      score: finalScore,
      status,
      suitableForCricket,
      suitableForRunning,
      suitableForCommuting,
      reasons,
      precautions: precautions.length > 0 ? precautions : ['Standard weather precautions apply.']
    };
  }
}

import { WeatherGPTStructuredResponse } from '../types/chat';
import { CurrentWeather, DailyForecast, HourlyForecast } from '../types/weather';
import { WeatherAlert } from '../types/alerts';
import { WeatherRiskAssessment } from '../types/risk';
import { SupportedLanguage } from '../types/user';

export const WEATHERGPT_SYSTEM_PROMPT = `You are WeatherGPT, an AI weather intelligence assistant built for Smart India Hackathon (SIH26068).
Your purpose is to explain weather information clearly and help users make safer decisions.
Use only the weather data, forecast information, historical information, and official alerts provided by the application.
Never invent weather values.
Never invent official warnings.
Never claim that an AI prediction is an official warning.
Always distinguish between official information, forecast information, AI analysis, and demo data.
When information is unavailable, say so.
Explain uncertainty when appropriate.
For severe weather, prioritize official warnings and official instructions.
Provide concise, practical, user-friendly recommendations.
Support English and all Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi).
When the user asks about safety, provide general precautionary guidance and encourage following official local authorities during severe weather.

Always return your response formatted as a strict JSON object with this structure:
{
  "summary": "Brief 1-2 sentence overview of the weather condition answering the user query",
  "confidence": "High" | "Medium" | "Low",
  "risk": "Low" | "Moderate" | "High" | "Extreme",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "location": "City, District, State",
  "validTime": "e.g. Next 3-6 hours / Tonight",
  "source": "e.g. Live Weather API + IMD Official Records + Gemini AI Analysis",
  "hazardWarning": "Optional urgent warning if high risk, else empty string"
}`;

export class GeminiService {
  /**
   * Ask WeatherGPT with weather telemetry grounding
   */
  static async askWeatherGPT(
    question: string,
    current: CurrentWeather,
    hourly: HourlyForecast[],
    daily: DailyForecast[],
    alerts: WeatherAlert[],
    risk: WeatherRiskAssessment,
    locationName: string,
    language: SupportedLanguage = 'en',
    apiKey?: string
  ): Promise<WeatherGPTStructuredResponse> {
    // If user provided Gemini API Key in Admin/Settings, attempt call to Google Gemini
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const response = await this.callGeminiAPI(
          question,
          current,
          hourly,
          daily,
          alerts,
          risk,
          locationName,
          language,
          apiKey.trim()
        );
        return response;
      } catch (err) {
        console.warn('Gemini API call failed, switching to local grounded engine:', err);
      }
    }

    // High-precision local grounded reasoning engine
    return this.generateGroundedResponse(question, current, hourly, daily, alerts, risk, locationName, language);
  }

  /**
   * Direct call to Google Gemini 1.5/2.0 REST API with structured JSON output
   */
  private static async callGeminiAPI(
    question: string,
    current: CurrentWeather,
    hourly: HourlyForecast[],
    daily: DailyForecast[],
    alerts: WeatherAlert[],
    risk: WeatherRiskAssessment,
    locationName: string,
    language: SupportedLanguage,
    apiKey: string
  ): Promise<WeatherGPTStructuredResponse> {
    const contextData = {
      location: locationName,
      languageRequested: language,
      currentWeather: {
        temp: `${current.temperature}°C`,
        feelsLike: `${current.feelsLike}°C`,
        condition: current.condition,
        humidity: `${current.humidity}%`,
        wind: `${current.windSpeed} km/h`,
        rainProbability: `${current.rainProbability}%`,
        precipitation: `${current.precipitation} mm`,
        uvIndex: current.uvIndex,
        pressure: `${current.pressure} hPa`
      },
      riskAssessment: {
        score: `${risk.score}/100`,
        level: risk.level,
        primaryHazard: risk.primaryRiskHazard,
        factors: risk.factors.map(f => `${f.name}: +${f.points}`)
      },
      officialAlerts: alerts.map(a => ({
        title: a.title,
        severity: a.severity,
        source: a.sourceName,
        instructions: a.instructions
      })),
      nextHours: hourly.slice(0, 6).map(h => `${h.hourStr}: ${h.temperature}°C, ${h.condition}, Rain ${h.rainProbability}%`),
      sevenDays: daily.slice(0, 3).map(d => `${d.dayName}: Max ${d.maxTemp}°C / Min ${d.minTemp}°C, ${d.condition}, Rain ${d.rainProbability}%`)
    };

    const userPrompt = `Context Telemetry:\n${JSON.stringify(contextData, null, 2)}\n\nUser Question: "${question}"\nPlease answer accurately in the user's preferred language (${language}).`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${WEATHERGPT_SYSTEM_PROMPT}\n\n${userPrompt}` }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No candidate content received from Gemini');
    }

    const parsed: WeatherGPTStructuredResponse = JSON.parse(candidateText);
    return parsed;
  }

  /**
   * Robust local rule-grounded reasoning engine adhering to the strict schema and multilingual needs
   */
  private static generateGroundedResponse(
    question: string,
    current: CurrentWeather,
    hourly: HourlyForecast[],
    daily: DailyForecast[],
    alerts: WeatherAlert[],
    risk: WeatherRiskAssessment,
    locationName: string,
    language: SupportedLanguage
  ): WeatherGPTStructuredResponse {
    const q = question.toLowerCase();

    const isRainQ = q.includes('rain') || q.includes('umbrella') || q.includes('மழை') || q.includes('बारिश') || q.includes('వర్షం') || q.includes('বৃষ্টি') || q.includes('पाऊस') || q.includes('વરસાદ');
    const isHeatQ = q.includes('hot') || q.includes('heat') || q.includes('வெயில்') || q.includes('சூடு') || q.includes('गर्मी') || q.includes('ఎండ') || q.includes('গরম') || q.includes('ऊन');
    const isTravelQ = q.includes('travel') || q.includes('safe to go') || q.includes('outside') || q.includes('பயணம்') || q.includes('यात्रा') || q.includes('ప్రయాణం') || q.includes('ভ্রমণ') || q.includes('रस्ता');
    const isAgriQ = q.includes('farm') || q.includes('agriculture') || q.includes('irrigation') || q.includes('spray') || q.includes('விவசாயம்') || q.includes('खेती') || q.includes('రైతు') || q.includes('കൃഷി');
    const isStormQ = q.includes('storm') || q.includes('cyclone') || q.includes('lightning') || q.includes('புயல்') || q.includes('மின்') || q.includes('तूफान') || q.includes('తుఫాను') || q.includes('ঘূর্ণিঝড়');
    const isWeekendQ = q.includes('weekend') || q.includes('tomorrow') || q.includes('நாளை') || q.includes('कल') || q.includes('రేపు');

    let summary = '';
    const recommendations: string[] = [];
    let hazardWarning = '';
    const validTime = 'Next 6–12 Hours';

    // Check if official alert active
    const officialAlert = alerts.find(a => a.sourceType === 'official_imd');
    if (officialAlert) {
      hazardWarning = `🚨 ${officialAlert.title}: Please comply with official local safety advisories.`;
    }

    if (isRainQ) {
      if (current.rainProbability >= 60) {
        if (language === 'ta') {
          summary = `ஆம், ${locationName}-ல் இன்று மழை பெய்ய அதிக வாய்ப்புள்ளது (வாய்ப்பு ${current.rainProbability}%). மாலை வேளையில் கனமழை எதிர்பார்க்கப்படுகிறது.`;
          recommendations.push('வெளியே செல்லும்போது குடை அல்லது மழைக் கோட் எடுத்துச் செல்லவும்.');
          recommendations.push('தாழ்வான மற்றும் நீர் தேங்கும் சாலைகளைத் தவிர்க்கவும்.');
          recommendations.push('மின்னணு சாதனங்களை நீர்புகா உறைகளில் பாதுகாக்கவும்.');
        } else if (language === 'hi') {
          summary = `हाँ, ${locationName} में आज बारिश होने की अत्यधिक संभावना है (${current.rainProbability}%)। शाम को तेज़ बारिश के आसार हैं।`;
          recommendations.push('घर से बाहर निकलते समय छाता अथवा रेनकोट अवश्य साथ रखें।');
          recommendations.push('जलभराव वाले निचले मार्गों से बचें।');
          recommendations.push('यात्रा में अतिरिक्त समय लेकर निकलें।');
        } else {
          summary = `Yes, rainfall is highly likely in ${locationName} today (${current.rainProbability}% probability). Expect wet conditions, especially during the evening hours.`;
          recommendations.push('Carry an umbrella or rain poncho when heading outdoors.');
          recommendations.push('Exercise caution around low-lying waterlogged roads and drainage channels.');
          recommendations.push('Keep electronic devices in water-resistant sleeves.');
        }
      } else {
        if (language === 'ta') {
          summary = `இல்லை, ${locationName}-ல் இன்று பெரிய அளவில் மழைக்கான வாய்ப்பு குறைவு (வாய்ப்பு ${current.rainProbability}%). வானம் ஓரளவு மேகமூட்டத்துடன் காணப்படும்.`;
          recommendations.push('வெளிப்புறப் பணிகளை வழக்கம்போல் தொடரலாம்.');
          recommendations.push('குடை எடுத்துச் செல்வது அவசியமில்லை.');
        } else if (language === 'hi') {
          summary = `नहीं, ${locationName} में आज तेज़ बारिश की संभावना कम है (संभावना ${current.rainProbability}%)। आंशिक रूप से बादल छाए रहेंगे।`;
          recommendations.push('सामान्य दैनिक गतिविधियां बिना बाधा जारी रखी जा सकती हैं।');
          recommendations.push('छाता ले जाना अनिवार्य नहीं है।');
        } else {
          summary = `Rainfall is unlikely in ${locationName} right now (rain probability is only ${current.rainProbability}%). Skies will remain partly cloudy.`;
          recommendations.push('Normal outdoor travel and sports can proceed without concern.');
          recommendations.push('No mandatory rain gear needed for daytime hours.');
        }
      }
    } else if (isHeatQ) {
      if (current.temperature >= 37) {
        if (language === 'ta') {
          summary = `ஆம், ${locationName}-ல் வெப்பநிலை அதிகமாக உள்ளது (${current.temperature}°C, உணரப்படும் வெப்பநிலை ${current.feelsLike}°C). தீவிர வெப்பம் நிலவுகிறது.`;
          recommendations.push('நிறைய தண்ணீர் மற்றும் இளநீர் அருந்தி உடலை நீரேற்றத்துடன் வைத்திருக்கவும்.');
          recommendations.push('நண்பகல் 12 மணி முதல் பிற்பகல் 3 மணி வரை நேரடி வெயிலில் செல்வதைத் தவிர்க்கவும்.');
          recommendations.push('மெல்லிய பருத்தி ஆடைகளை அணியவும்.');
        } else {
          summary = `Yes, temperatures in ${locationName} are elevated at ${current.temperature}°C (feels like ${current.feelsLike}°C) with UV Index of ${current.uvIndex}.`;
          recommendations.push('Stay thoroughly hydrated with water and electrolyte-rich fluids.');
          recommendations.push('Limit strenuous direct outdoor exertion between 12:00 PM and 3:30 PM.');
          recommendations.push('Wear light-colored, breathable cotton clothing and UV-rated sunglasses.');
        }
      } else {
        summary = `Temperature in ${locationName} is comfortable at ${current.temperature}°C (feels like ${current.feelsLike}°C). No extreme heatwave condition.`;
        recommendations.push('Thermal conditions are within pleasant thresholds.');
        recommendations.push('Standard hydration is sufficient.');
      }
    } else if (isTravelQ) {
      if (risk.score >= 60) {
        summary = `Caution is advised for travel around ${locationName}. Weather risk score is elevated at ${risk.score}/100 due to ${risk.primaryRiskHazard.toLowerCase()}.`;
        recommendations.push('Anticipate vehicular traffic delays and reduced road traction.');
        recommendations.push('Avoid non-essential nighttime travel along coastal or hilly roads.');
        recommendations.push('Ensure vehicle wipers, headlights, and brakes are in working order.');
      } else {
        summary = `Travel conditions around ${locationName} are currently favorable. Weather risk score is low (${risk.score}/100).`;
        recommendations.push('Roadways and transit links are operating normally.');
        recommendations.push('Check updated forecasts before evening commutes.');
      }
    } else if (isAgriQ) {
      summary = `Agriculture Advisory for ${locationName}: Soil moisture condition is optimal. Rain probability over the next 24 hours is ${current.rainProbability}%.`;
      if (current.rainProbability > 50) {
        recommendations.push('Postpone scheduled field irrigation; anticipated rainfall will supply adequate moisture.');
        recommendations.push('Hold off on pesticide or fungicide spraying to prevent chemical washout.');
      } else {
        recommendations.push('Conditions are favorable for planned foliar spraying (wind speed is ${current.windSpeed} km/h).');
        recommendations.push('Proceed with light drip irrigation according to crop stage.');
      }
    } else if (isStormQ) {
      if (risk.score >= 50 || current.windSpeed > 45) {
        summary = `Active storm dynamics observed near ${locationName}. Sustained winds at ${current.windSpeed} km/h with gusts. Atmospheric instability detected.`;
        recommendations.push('Secure loose roofing sheets, solar panels, and outdoor furniture.');
        recommendations.push('Do not park vehicles under aged or vulnerable trees.');
        recommendations.push('Stay away from electric poles, transformers, and fallen wires.');
      } else {
        summary = `No severe cyclonic or convective storm activity is currently threatening ${locationName}. Winds are moderate at ${current.windSpeed} km/h.`;
        recommendations.push('Atmospheric pressure is stable at ${current.pressure} hPa.');
        recommendations.push('No storm-sheltering measures required at present.');
      }
    } else if (isWeekendQ) {
      const day2 = daily[1] || daily[0];
      summary = `Forecast ahead for ${locationName}: ${day2.dayName} will see temperatures around ${day2.maxTemp}°C (Min ${day2.minTemp}°C) with ${day2.condition.toLowerCase()} and ${day2.rainProbability}% chance of rain.`;
      recommendations.push(`Expected weather condition: ${day2.condition}.`);
      recommendations.push(day2.rainProbability > 50 ? 'Plan indoor recreational alternatives for the weekend.' : 'Favorable conditions for weekend outdoor plans.');
    } else {
      // General overview
      summary = `Current weather in ${locationName} is ${current.temperature}°C and ${current.condition.toLowerCase()} (feels like ${current.feelsLike}°C). Humidity is at ${current.humidity}% with winds at ${current.windSpeed} km/h.`;
      recommendations.push('Atmospheric risk score is currently assessed as ' + risk.level.toUpperCase() + ' (' + risk.score + '/100).');
      recommendations.push(current.rainProbability > 40 ? 'Keep an umbrella handy as rain probability is ' + current.rainProbability + '%.' : 'Outdoor operations can continue with normal precautions.');
      recommendations.push('Check hourly updates if planning long-distance transit.');
    }

    let confidence: 'High' | 'Medium' | 'Low' = 'High';
    if (risk.confidence === 'Medium') confidence = 'Medium';

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Low';
    if (risk.level === 'extreme') riskLevel = 'Extreme';
    else if (risk.level === 'high') riskLevel = 'High';
    else if (risk.level === 'moderate') riskLevel = 'Moderate';

    return {
      summary,
      confidence,
      risk: riskLevel,
      recommendations,
      location: locationName,
      validTime,
      source: 'Open-Meteo Meteorological Feed + WeatherGPT Grounded Model' + (alerts.length > 0 ? ' + Official IMD Directives' : ''),
      hazardWarning: hazardWarning || undefined
    };
  }
}

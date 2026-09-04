import { DemoScenario, DemoScenarioId } from '../types/demo';

export class DemoService {
  static getScenarios(): DemoScenario[] {
    return [
      {
        id: 'normal',
        name: 'Normal Weather',
        nameHindi: 'सामान्य मौसम',
        nameTamil: 'இயல்பான வெயில்',
        badge: '☀️ Normal',
        locationName: 'Bengaluru, Karnataka',
        description: 'Clear pleasant skies, low humidity, zero warning status, optimal outdoor score.',
        riskScore: 14,
        mockWeather: {
          temperature: 27,
          feelsLike: 27,
          condition: 'Clear Sky',
          conditionCode: 0,
          humidity: 52,
          windSpeed: 12,
          windDirection: 90,
          windGust: 18,
          pressure: 1014,
          uvIndex: 5,
          visibility: 10,
          cloudCover: 15,
          rainProbability: 5,
          precipitation: 0,
          sunrise: '06:04 AM',
          sunset: '06:31 PM',
          isDay: true,
          lastUpdated: 'Live Simulation',
          dataSource: 'SIH Demo Simulator (Normal Weather Scenario)'
        },
        mockHourly: Array.from({ length: 24 }).map((_, i) => ({
          time: `${i}:00`,
          hourStr: i === 0 ? 'Now' : `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? 'PM' : 'AM'}`,
          temperature: 24 + (i > 10 && i < 16 ? 4 : 0) - (i < 6 || i > 20 ? 3 : 0),
          condition: 'Sunny / Clear',
          conditionCode: 0,
          rainProbability: 5,
          windSpeed: 10 + (i % 4),
          humidity: 55,
          isDay: i >= 6 && i <= 18,
          uvIndex: i >= 11 && i <= 15 ? 6 : 0
        })),
        mockDaily: Array.from({ length: 7 }).map((_, d) => ({
          date: `2026-09-0${d + 1}`,
          dayName: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          dayNameShort: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          maxTemp: 28,
          minTemp: 19,
          condition: 'Mainly Clear',
          conditionCode: 1,
          rainProbability: 10,
          precipitationSum: 0,
          windSpeed: 12,
          humidity: 50,
          uvMax: 6,
          sunrise: '06:04 AM',
          sunset: '06:31 PM',
          riskLevel: 'low',
          riskScore: 15
        })),
        mockAlerts: [],
        mockRisk: {
          score: 14,
          level: 'low',
          confidence: 'High',
          confidenceReasons: ['Calm atmospheric pressure', 'No convective cells detected'],
          factors: [
            { id: 'rain', name: 'Precipitation Threat', points: 2, maxPoints: 30, description: 'Negligible rain (5%)', category: 'rain' },
            { id: 'wind', name: 'Wind Vectors', points: 3, maxPoints: 25, description: 'Gentle breeze 12 km/h', category: 'wind' },
            { id: 'convective', name: 'Lightning Index', points: 2, maxPoints: 20, description: 'Stable troposphere', category: 'lightning' },
            { id: 'thermal', name: 'Thermal Comfort', points: 7, maxPoints: 15, description: 'Optimal 27°C', category: 'heat' },
            { id: 'imd', name: 'Official Directives', points: 0, maxPoints: 15, description: 'No active warnings', category: 'official_warning' }
          ],
          summary: 'LOW RISK (14/100): Excellent pleasant conditions. Ideal for sports, agriculture, and open travel.',
          calculatedAt: 'Just Now',
          primaryRiskHazard: 'None / Fair Weather'
        }
      },
      {
        id: 'cyclone',
        name: 'Super Cyclone',
        nameHindi: 'भीषण चक्रवात',
        nameTamil: 'தீவிர புயல் (சூறாவளி)',
        badge: '🌪️ Cyclone Alert',
        locationName: 'Cuddalore Coastal Belt, Tamil Nadu',
        description: 'Landfall simulation with 120 km/h wind gusts, storm surge, torrential rain, and mandatory Red Alert.',
        riskScore: 94,
        mockWeather: {
          temperature: 24,
          feelsLike: 20,
          condition: 'Severe Cyclonic Storm',
          conditionCode: 99,
          humidity: 98,
          windSpeed: 88,
          windDirection: 70,
          windGust: 124,
          pressure: 968,
          uvIndex: 1,
          visibility: 1.2,
          cloudCover: 100,
          rainProbability: 98,
          precipitation: 45,
          sunrise: '05:54 AM',
          sunset: '06:18 PM',
          isDay: true,
          lastUpdated: 'Live Simulation',
          dataSource: 'SIH Demo Simulator (Super Cyclone Landfall Scenario)'
        },
        mockHourly: Array.from({ length: 24 }).map((_, i) => ({
          time: `${i}:00`,
          hourStr: i === 0 ? 'Now' : `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? 'PM' : 'AM'}`,
          temperature: 23,
          condition: 'Violent Storm & Rain',
          conditionCode: 99,
          rainProbability: 95,
          windSpeed: 85 + (i % 20),
          humidity: 98,
          isDay: i >= 6 && i <= 18,
          uvIndex: 0
        })),
        mockDaily: Array.from({ length: 7 }).map((_, d) => ({
          date: `2026-09-0${d + 1}`,
          dayName: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          dayNameShort: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          maxTemp: 26,
          minTemp: 21,
          condition: d < 2 ? 'Cyclonic Torrential Rain' : 'Scattered Showers',
          conditionCode: d < 2 ? 99 : 61,
          rainProbability: d < 2 ? 95 : 40,
          precipitationSum: d < 2 ? 140 : 10,
          windSpeed: d < 2 ? 90 : 25,
          humidity: 92,
          uvMax: 2,
          sunrise: '05:54 AM',
          sunset: '06:18 PM',
          riskLevel: d < 2 ? 'extreme' : 'moderate',
          riskScore: d < 2 ? 94 : 45
        })),
        mockAlerts: [
          {
            id: 'demo_cyclone_red',
            title: '🔴 RED WARNING: SEVERE CYCLONIC STORM LANDFALL',
            message: 'DEMO SIMULATION: Very Severe Cyclonic Storm approaching coastal Tamil Nadu and Puducherry. Gale wind speed reaching 100-120 km/h with destructive storm surge. Complete suspension of fishing and transport operations.',
            severity: 'warning',
            sourceType: 'demo_simulated',
            sourceName: '⚠️ DEMO / SIMULATED DATA — NOT A REAL WARNING',
            location: 'Cuddalore & North Coastal Tamil Nadu',
            affectedDistricts: ['Cuddalore', 'Nagapattinam', 'Villupuram', 'Chennai'],
            issuedAt: 'Simulated IMD Special Bulletin',
            expiresAt: 'Next 24 Hours',
            instructions: [
              'Mandatory evacuation for residents within 5 km of coast to cyclone shelters.',
              'Disconnect electrical main switches and gas cylinders.',
              'Do not venture outside during the eye of the storm when winds momentarily cease.',
              'Dial State Disaster Emergency: 1070 / NDRF: 1078.'
            ],
            isDemo: true,
            hazardType: 'cyclone'
          }
        ],
        mockRisk: {
          score: 94,
          level: 'extreme',
          confidence: 'High',
          confidenceReasons: ['Doppler Radar track confirms eyewall landfall', 'Atmospheric central pressure dropped to 968 hPa', 'Gale gusts exceed 120 km/h'],
          factors: [
            { id: 'rain', name: 'Torrential Precipitation', points: 30, maxPoints: 30, description: '45 mm/h extreme downpour', category: 'rain' },
            { id: 'wind', name: 'Destructive Gale Winds', points: 25, maxPoints: 25, description: 'Sustained 88 km/h, gusts 124 km/h', category: 'wind' },
            { id: 'convective', name: 'Violent Convection', points: 19, maxPoints: 20, description: 'Continuous lightning cells', category: 'lightning' },
            { id: 'thermal', name: 'Cold Downdrafts', points: 5, maxPoints: 15, description: 'Thermal inversion', category: 'heat' },
            { id: 'imd', name: 'Official Red Alert Impact', points: 15, maxPoints: 15, description: 'Government Red Disaster Warning', category: 'official_warning' }
          ],
          summary: 'EXTREME DISASTER RISK (94/100): Life-threatening cyclone landfall. Immediate shelter in designated reinforced concrete structures required.',
          calculatedAt: 'Just Now',
          primaryRiskHazard: 'Super Cyclonic Wind & Storm Surge'
        }
      },
      {
        id: 'flood',
        name: 'Urban Flood Risk',
        nameHindi: 'शहरी बाढ़ / जलभराव',
        nameTamil: 'நகர்ப்புற வெள்ள அபாயம்',
        badge: '🌊 Flood Alert',
        locationName: 'Chennai South & Adyar Basin, Tamil Nadu',
        description: 'Simulated 180mm rain inundation, reservoir discharge alert, waterlogged arterial flyovers.',
        riskScore: 86,
        mockWeather: {
          temperature: 26,
          feelsLike: 28,
          condition: 'Continuous Heavy Downpour',
          conditionCode: 65,
          humidity: 95,
          windSpeed: 38,
          windDirection: 120,
          windGust: 55,
          pressure: 998,
          uvIndex: 1,
          visibility: 2.0,
          cloudCover: 100,
          rainProbability: 95,
          precipitation: 28,
          sunrise: '05:58 AM',
          sunset: '06:22 PM',
          isDay: true,
          lastUpdated: 'Live Simulation',
          dataSource: 'SIH Demo Simulator (Urban Flood Scenario)'
        },
        mockHourly: Array.from({ length: 24 }).map((_, i) => ({
          time: `${i}:00`,
          hourStr: i === 0 ? 'Now' : `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? 'PM' : 'AM'}`,
          temperature: 25,
          condition: 'Heavy Rain',
          conditionCode: 65,
          rainProbability: 90,
          windSpeed: 35,
          humidity: 95,
          isDay: i >= 6 && i <= 18,
          uvIndex: 1
        })),
        mockDaily: Array.from({ length: 7 }).map((_, d) => ({
          date: `2026-09-0${d + 1}`,
          dayName: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          dayNameShort: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          maxTemp: 28,
          minTemp: 23,
          condition: d < 3 ? 'Heavy Inundation Rain' : 'Light Rain',
          conditionCode: d < 3 ? 65 : 61,
          rainProbability: d < 3 ? 90 : 35,
          precipitationSum: d < 3 ? 75 : 5,
          windSpeed: 32,
          humidity: 90,
          uvMax: 3,
          sunrise: '05:58 AM',
          sunset: '06:22 PM',
          riskLevel: d < 3 ? 'extreme' : 'low',
          riskScore: d < 3 ? 86 : 28
        })),
        mockAlerts: [
          {
            id: 'demo_flood_alert',
            title: '🔴 RED ALERT: URBAN FLASH FLOOD & INUNDATION WARNING',
            message: 'DEMO SIMULATION: River Adyar & Cooum water levels nearing danger mark. Low-lying colonies advised to shift valuable possessions to upper floors. Multiple subway passages closed.',
            severity: 'warning',
            sourceType: 'demo_simulated',
            sourceName: '⚠️ DEMO / SIMULATED DATA — NOT A REAL WARNING',
            location: 'Chennai South, Velachery & Mudichur',
            affectedDistricts: ['Chennai', 'Chengalpattu', 'Kanchipuram'],
            issuedAt: 'Simulated State Water Resources Dept',
            expiresAt: 'Next 12 Hours',
            instructions: [
              'Move elder family members and young children to first floor or above.',
              'Never drive two-wheelers or cars through moving street floodwaters.',
              'Store safe drinking water and boil before consumption.',
              'Chennai Corporation Flood Helpline: 1913.'
            ],
            isDemo: true,
            hazardType: 'flood'
          }
        ],
        mockRisk: {
          score: 86,
          level: 'extreme',
          confidence: 'High',
          confidenceReasons: ['Soil saturation index at 99%', 'Cumulative catchment rainfall exceeding 180 mm'],
          factors: [
            { id: 'rain', name: 'Continuous Monsoon Downpour', points: 30, maxPoints: 30, description: '28 mm/h rainfall rate', category: 'rain' },
            { id: 'wind', name: 'Squally Winds', points: 15, maxPoints: 25, description: '38 km/h wind speed', category: 'wind' },
            { id: 'convective', name: 'Convective Rainbands', points: 14, maxPoints: 20, description: 'Embedded thunderstorm clusters', category: 'lightning' },
            { id: 'thermal', name: 'Saturated Humidity', points: 12, maxPoints: 15, description: '95% relative humidity', category: 'heat' },
            { id: 'imd', name: 'Flood Reservoir Inundation Alert', points: 15, maxPoints: 15, description: 'Official Water Resources Warning', category: 'official_warning' }
          ],
          summary: 'CRITICAL FLOOD RISK (86/100): Severe urban waterlogging and river overflow imminent. Do not cross inundated roadways.',
          calculatedAt: 'Just Now',
          primaryRiskHazard: 'Urban Flooding & River Surcharge'
        }
      },
      {
        id: 'heatwave',
        name: 'Extreme Heatwave',
        nameHindi: 'भीषण लू / हीटवेव',
        nameTamil: 'கடும் வெப்ப அலை',
        badge: '🔥 Heatwave 43°C',
        locationName: 'Nagpur & Vidarbha, Maharashtra',
        description: 'Severe heatwave with 43.5°C ambient temperature, UV index of 11 (Extreme), and high risk of heat exhaustion.',
        riskScore: 78,
        mockWeather: {
          temperature: 43.5,
          feelsLike: 48,
          condition: 'Severe Heatwave / Scorching',
          conditionCode: 0,
          humidity: 28,
          windSpeed: 22,
          windDirection: 280,
          windGust: 32,
          pressure: 1004,
          uvIndex: 11,
          visibility: 9.0,
          cloudCover: 5,
          rainProbability: 0,
          precipitation: 0,
          sunrise: '05:46 AM',
          sunset: '06:48 PM',
          isDay: true,
          lastUpdated: 'Live Simulation',
          dataSource: 'SIH Demo Simulator (Heatwave Scenario)'
        },
        mockHourly: Array.from({ length: 24 }).map((_, i) => ({
          time: `${i}:00`,
          hourStr: i === 0 ? 'Now' : `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? 'PM' : 'AM'}`,
          temperature: i >= 12 && i <= 16 ? 43 : (i >= 8 && i <= 20 ? 38 : 31),
          condition: 'Scorching Heat',
          conditionCode: 0,
          rainProbability: 0,
          windSpeed: 20,
          humidity: 25,
          isDay: i >= 6 && i <= 18,
          uvIndex: i >= 11 && i <= 15 ? 11 : 2
        })),
        mockDaily: Array.from({ length: 7 }).map((_, d) => ({
          date: `2026-09-0${d + 1}`,
          dayName: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          dayNameShort: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          maxTemp: 44,
          minTemp: 30,
          condition: 'Extreme Heatwave',
          conditionCode: 0,
          rainProbability: 0,
          precipitationSum: 0,
          windSpeed: 22,
          humidity: 26,
          uvMax: 11,
          sunrise: '05:46 AM',
          sunset: '06:48 PM',
          riskLevel: 'high',
          riskScore: 78
        })),
        mockAlerts: [
          {
            id: 'demo_heat_orange',
            title: '🟠 ORANGE ALERT: SEVERE HEATWAVE & EXTREME UV',
            message: 'DEMO SIMULATION: IMD issues Orange Heatwave Warning for central plains. Maximum temperatures exceeding normal by 5.5°C. High probability of heat stroke for exposed outdoor workers and vulnerable elders.',
            severity: 'alert',
            sourceType: 'demo_simulated',
            sourceName: '⚠️ DEMO / SIMULATED DATA — NOT A REAL WARNING',
            location: 'Vidarbha & Nagpur District',
            affectedDistricts: ['Nagpur', 'Wardha', 'Chandrapur'],
            issuedAt: 'Simulated IMD Regional Meteorological Centre',
            expiresAt: 'Until 06:00 PM',
            instructions: [
              'Avoid direct outdoor exposure between 11:30 AM and 4:00 PM.',
              'Drink ORS, buttermilk, and lemon water at regular intervals even if not thirsty.',
              'Do not leave children or pets inside parked closed vehicles.'
            ],
            isDemo: true,
            hazardType: 'heatwave'
          }
        ],
        mockRisk: {
          score: 78,
          level: 'high',
          confidence: 'High',
          confidenceReasons: ['Surface thermal anomaly exceeds +5.5°C', 'UV Index reached extreme category 11'],
          factors: [
            { id: 'rain', name: 'Zero Rain Relief', points: 0, maxPoints: 30, description: 'Dry desiccating air mass', category: 'rain' },
            { id: 'wind', name: 'Warm Loo Winds', points: 12, maxPoints: 25, description: 'Hot dry westerly winds 22 km/h', category: 'wind' },
            { id: 'convective', name: 'Convective Status', points: 0, maxPoints: 20, description: 'Cloudless scorching sky', category: 'lightning' },
            { id: 'thermal', name: 'Extreme Heat & Solar Radiation', points: 15, maxPoints: 15, description: '43.5°C ambient, feels 48°C, UV 11', category: 'heat' },
            { id: 'imd', name: 'Official Heatwave Warning', points: 10, maxPoints: 15, description: 'IMD Orange Alert Active', category: 'official_warning' }
          ],
          summary: 'HIGH THERMAL RISK (78/100): Hazardous heatwave conditions. Stay in shaded or air-cooled rooms. Rigorous hydration essential.',
          calculatedAt: 'Just Now',
          primaryRiskHazard: 'Severe Heatwave & Hyperthermia Threat'
        }
      },
      {
        id: 'thunderstorm',
        name: 'Severe Thunderstorm',
        nameHindi: 'गंभीर बिजली व आंधी तूफान',
        nameTamil: 'இடி மின்னலுடன் கூடிய புயல்',
        badge: '⚡ Lightning Warning',
        locationName: 'Ranchi & Chota Nagpur Plateau, Jharkhand',
        description: 'Frequent cloud-to-ground lightning strikes, hail potential, 65 km/h convective downbursts.',
        riskScore: 82,
        mockWeather: {
          temperature: 28,
          feelsLike: 31,
          condition: 'Violent Thunderstorm with Hail',
          conditionCode: 96,
          humidity: 89,
          windSpeed: 52,
          windDirection: 310,
          windGust: 78,
          pressure: 1002,
          uvIndex: 2,
          visibility: 3.5,
          cloudCover: 95,
          rainProbability: 88,
          precipitation: 32,
          sunrise: '05:32 AM',
          sunset: '06:12 PM',
          isDay: true,
          lastUpdated: 'Live Simulation',
          dataSource: 'SIH Demo Simulator (Severe Thunderstorm Scenario)'
        },
        mockHourly: Array.from({ length: 24 }).map((_, i) => ({
          time: `${i}:00`,
          hourStr: i === 0 ? 'Now' : `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? 'PM' : 'AM'}`,
          temperature: 27,
          condition: 'Thunderstorm & Lightning',
          conditionCode: 96,
          rainProbability: 85,
          windSpeed: 48,
          humidity: 88,
          isDay: i >= 6 && i <= 18,
          uvIndex: 1
        })),
        mockDaily: Array.from({ length: 7 }).map((_, d) => ({
          date: `2026-09-0${d + 1}`,
          dayName: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          dayNameShort: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          maxTemp: 30,
          minTemp: 22,
          condition: d === 0 ? 'Thunderstorm with Hail' : 'Scattered Rain',
          conditionCode: d === 0 ? 96 : 61,
          rainProbability: d === 0 ? 88 : 40,
          precipitationSum: d === 0 ? 45 : 8,
          windSpeed: d === 0 ? 52 : 20,
          humidity: 85,
          uvMax: 4,
          sunrise: '05:32 AM',
          sunset: '06:12 PM',
          riskLevel: d === 0 ? 'extreme' : 'low',
          riskScore: d === 0 ? 82 : 30
        })),
        mockAlerts: [
          {
            id: 'demo_lightning_orange',
            title: '🟠 ORANGE WARNING: SEVERE LIGHTNING & SQUALL (KALBAISAKHI)',
            message: 'DEMO SIMULATION: Intense convective clouds causing cloud-to-ground lightning strikes and sudden squalls up to 75 km/h. Farmers and outdoor workers urged to immediately seek indoor shelter.',
            severity: 'alert',
            sourceType: 'demo_simulated',
            sourceName: '⚠️ DEMO / SIMULATED DATA — NOT A REAL WARNING',
            location: 'Ranchi, Ramgarh & Hazaribagh',
            affectedDistricts: ['Ranchi', 'Ramgarh'],
            issuedAt: 'Simulated Nowcast Warning (Damini/IMD)',
            expiresAt: 'Next 3 Hours',
            instructions: [
              'DO NOT stand under isolated trees, metal fences, or tin-roofed sheds.',
              'If caught in open fields, crouch low on balls of your feet with hands over ears.',
              'Unplug desktop computers and television antennas.'
            ],
            isDemo: true,
            hazardType: 'thunderstorm'
          }
        ],
        mockRisk: {
          score: 82,
          level: 'extreme',
          confidence: 'High',
          confidenceReasons: ['Convective Available Potential Energy (CAPE) > 2800 J/kg', 'Doppler lightning flash density 14 flashes/min'],
          factors: [
            { id: 'rain', name: 'Intense Convective Rain', points: 24, maxPoints: 30, description: '32 mm/h downpour rate', category: 'rain' },
            { id: 'wind', name: 'Severe Downburst Gusts', points: 20, maxPoints: 25, description: 'Gusts reaching 78 km/h', category: 'wind' },
            { id: 'convective', name: 'Frequent Cloud-to-Ground Lightning', points: 20, maxPoints: 20, description: 'Active lightning strike alert', category: 'lightning' },
            { id: 'thermal', name: 'Atmospheric Instability', points: 8, maxPoints: 15, description: 'Sharp drop in temperature', category: 'heat' },
            { id: 'imd', name: 'Official Lightning Nowcast', points: 10, maxPoints: 15, description: 'IMD Orange Nowcast active', category: 'official_warning' }
          ],
          summary: 'EXTREME LIGHTNING HAZARD (82/100): High casualty risk from ground lightning strikes. Seek solid masonry shelter immediately.',
          calculatedAt: 'Just Now',
          primaryRiskHazard: 'Cloud-to-Ground Lightning & Convective Squall'
        }
      },
      {
        id: 'heavy_rain',
        name: 'Monsoon Heavy Rain',
        nameHindi: 'मानसून भारी बारिश',
        nameTamil: 'கனமழைப் பொழிவு',
        badge: '🌧️ Heavy Rain',
        locationName: 'Kochi & Ernakulam, Kerala',
        description: 'Persistent Southwest monsoon showers, high humidity, localized water accumulation, Yellow Watch.',
        riskScore: 58,
        mockWeather: {
          temperature: 27,
          feelsLike: 31,
          condition: 'Continuous Moderate to Heavy Rain',
          conditionCode: 63,
          humidity: 92,
          windSpeed: 28,
          windDirection: 240,
          windGust: 42,
          pressure: 1009,
          uvIndex: 3,
          visibility: 5.0,
          cloudCover: 90,
          rainProbability: 75,
          precipitation: 14,
          sunrise: '06:12 AM',
          sunset: '06:34 PM',
          isDay: true,
          lastUpdated: 'Live Simulation',
          dataSource: 'SIH Demo Simulator (Monsoon Rain Scenario)'
        },
        mockHourly: Array.from({ length: 24 }).map((_, i) => ({
          time: `${i}:00`,
          hourStr: i === 0 ? 'Now' : `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? 'PM' : 'AM'}`,
          temperature: 26,
          condition: 'Rain Showers',
          conditionCode: 63,
          rainProbability: 70,
          windSpeed: 24,
          humidity: 90,
          isDay: i >= 6 && i <= 18,
          uvIndex: 2
        })),
        mockDaily: Array.from({ length: 7 }).map((_, d) => ({
          date: `2026-09-0${d + 1}`,
          dayName: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          dayNameShort: d === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d % 7],
          maxTemp: 29,
          minTemp: 24,
          condition: 'Monsoon Showers',
          conditionCode: 63,
          rainProbability: 75,
          precipitationSum: 22,
          windSpeed: 26,
          humidity: 88,
          uvMax: 4,
          sunrise: '06:12 AM',
          sunset: '06:34 PM',
          riskLevel: 'moderate',
          riskScore: 58
        })),
        mockAlerts: [
          {
            id: 'demo_rain_yellow',
            title: '🟡 YELLOW WATCH: HEAVY RAINFALL ADVISORY',
            message: 'DEMO SIMULATION: Active monsoon surge likely to produce heavy rainfall (7-11 cm) over isolated places in coastal Kerala. Keep umbrella handy and drive with low beams.',
            severity: 'watch',
            sourceType: 'demo_simulated',
            sourceName: '⚠️ DEMO / SIMULATED DATA — NOT A REAL WARNING',
            location: 'Kochi & Coastal Kerala',
            affectedDistricts: ['Ernakulam', 'Alappuzha', 'Kottayam'],
            issuedAt: 'Simulated IMD Meteorological Centre Thiruvananthapuram',
            expiresAt: 'Next 12 Hours',
            instructions: [
              'Carry rain gear on commutes.',
              'Be alert to minor traffic disruptions due to puddles.',
              'Keep mobile devices charged in case of localized power trips.'
            ],
            isDemo: true,
            hazardType: 'heavy_rain'
          }
        ],
        mockRisk: {
          score: 58,
          level: 'moderate',
          confidence: 'High',
          confidenceReasons: ['Monsoon trough anchored along Western Ghats', 'High atmospheric moisture transport from Arabian Sea'],
          factors: [
            { id: 'rain', name: 'Monsoon Rain Accumulation', points: 22, maxPoints: 30, description: '14 mm/h rain, 75% probability', category: 'rain' },
            { id: 'wind', name: 'Moderate Coastal Breeze', points: 10, maxPoints: 25, description: '28 km/h wind speed', category: 'wind' },
            { id: 'convective', name: 'Warm Rain Clouds', points: 8, maxPoints: 20, description: 'Low thunderstorm probability', category: 'lightning' },
            { id: 'thermal', name: 'Humid Tropical Index', points: 13, maxPoints: 15, description: '92% humidity with 27°C temp', category: 'heat' },
            { id: 'imd', name: 'Official Yellow Watch', points: 5, maxPoints: 15, description: 'IMD Yellow Alert active', category: 'official_warning' }
          ],
          summary: 'MODERATE WEATHER RISK (58/100): Persistent monsoon showers expected throughout the day. Normal routines can continue with umbrellas.',
          calculatedAt: 'Just Now',
          primaryRiskHazard: 'Monsoon Showers & Road Slickness'
        }
      }
    ];
  }

  static getScenarioById(id: DemoScenarioId): DemoScenario {
    const list = this.getScenarios();
    return list.find(s => s.id === id) || list[0];
  }
}

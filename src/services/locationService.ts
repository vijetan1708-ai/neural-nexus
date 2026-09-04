import { LocationData } from '../types/weather';

export interface IndianDistrict {
  city: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  pincode: string;
}

// Curated database of key Indian metro areas, coastal zones, and district headquarters
export const INDIAN_DISTRICTS: IndianDistrict[] = [
  // Tamil Nadu
  { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, pincode: '600001' },
  { city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, pincode: '641001' },
  { city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, pincode: '625001' },
  { city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu', latitude: 10.7905, longitude: 78.7047, pincode: '620001' },
  { city: 'Salem', district: 'Salem', state: 'Tamil Nadu', latitude: 11.6643, longitude: 78.1460, pincode: '636001' },
  { city: 'Cuddalore', district: 'Cuddalore', state: 'Tamil Nadu', latitude: 11.7480, longitude: 79.7714, pincode: '607001' },
  { city: 'Kanyakumari', district: 'Kanyakumari', state: 'Tamil Nadu', latitude: 8.0883, longitude: 77.5385, pincode: '629702' },
  { city: 'Nagapattinam', district: 'Nagapattinam', state: 'Tamil Nadu', latitude: 10.7672, longitude: 79.8449, pincode: '611001' },

  // Maharashtra
  { city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, pincode: '400001' },
  { city: 'Pune', district: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, pincode: '411001' },
  { city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, pincode: '440001' },
  { city: 'Ratnagiri', district: 'Ratnagiri', state: 'Maharashtra', latitude: 16.9902, longitude: 73.3120, pincode: '415612' },

  // Delhi NCR
  { city: 'New Delhi', district: 'New Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, pincode: '110001' },

  // Karnataka
  { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, pincode: '560001' },
  { city: 'Mangaluru', district: 'Dakshina Kannada', state: 'Karnataka', latitude: 12.9141, longitude: 74.8560, pincode: '575001' },
  { city: 'Mysuru', district: 'Mysuru', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394, pincode: '570001' },

  // West Bengal
  { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, pincode: '700001' },
  { city: 'Digha', district: 'Purba Medinipur', state: 'West Bengal', latitude: 21.6266, longitude: 87.5074, pincode: '721428' },

  // Telangana & Andhra Pradesh
  { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, pincode: '500001' },
  { city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185, pincode: '530001' },
  { city: 'Vijayawada', district: 'NTR', state: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480, pincode: '520001' },

  // Gujarat
  { city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, pincode: '380001' },
  { city: 'Surat', district: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, pincode: '395001' },

  // Kerala
  { city: 'Kochi', district: 'Ernakulam', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, pincode: '682001' },
  { city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', latitude: 8.5241, longitude: 76.9366, pincode: '695001' },
  { city: 'Wayanad', district: 'Wayanad', state: 'Kerala', latitude: 11.6854, longitude: 76.1320, pincode: '673121' },

  // Odisha
  { city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, pincode: '751001' },
  { city: 'Puri', district: 'Puri', state: 'Odisha', latitude: 19.8135, longitude: 85.8312, pincode: '752001' },

  // Punjab & North
  { city: 'Amritsar', district: 'Amritsar', state: 'Punjab', latitude: 31.6340, longitude: 74.8723, pincode: '143001' },
  { city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', latitude: 30.9010, longitude: 75.8573, pincode: '141001' },
  { city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, pincode: '302001' },
  { city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, pincode: '226001' },
];

export const DEFAULT_LOCATION: LocationData = {
  city: 'Chennai',
  district: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India',
  latitude: 13.0827,
  longitude: 80.2707,
  accuracyMeters: 12,
  isGPS: false,
  pincode: '600001'
};

export class LocationService {
  /**
   * Request user's current GPS position via browser Geolocation API
   */
  static async getCurrentGPSLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          try {
            // Reverse geocode via Open-Meteo or Nominatim
            const geoInfo = await this.reverseGeocode(lat, lon);
            resolve({
              city: geoInfo.city,
              district: geoInfo.district,
              state: geoInfo.state,
              country: geoInfo.country || 'India',
              latitude: Number(lat.toFixed(4)),
              longitude: Number(lon.toFixed(4)),
              accuracyMeters: accuracy,
              isGPS: true,
              pincode: geoInfo.pincode
            });
          } catch {
            // Fallback to nearest district if reverse geocoding network fails
            const nearest = this.findNearestDistrict(lat, lon);
            resolve({
              city: nearest.city,
              district: nearest.district,
              state: nearest.state,
              country: 'India',
              latitude: Number(lat.toFixed(4)),
              longitude: Number(lon.toFixed(4)),
              accuracyMeters: accuracy,
              isGPS: true,
              pincode: nearest.pincode
            });
          }
        },
        (error) => {
          let message = 'Location access denied or unavailable.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Location permission was denied. Please allow location access or search manually.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'GPS location position is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            message = 'Location acquisition timed out.';
          }
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  /**
   * Reverse geocode coordinates using Open-Meteo or fallback
   */
  static async reverseGeocode(lat: number, lon: number): Promise<{ city: string; district: string; state: string; country: string; pincode?: string }> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
        { headers: { 'User-Agent': 'WeatherGPT-SIH26068/1.0' } }
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.suburb || 'Local Area';
        const district = address.state_district || address.county || address.district || city;
        const state = address.state || 'India';
        const country = address.country || 'India';
        const pincode = address.postcode;
        return { city, district, state, country, pincode };
      }
    } catch {
      // Ignore network fail and fall through to nearest
    }

    const nearest = this.findNearestDistrict(lat, lon);
    return {
      city: nearest.city,
      district: nearest.district,
      state: nearest.state,
      country: 'India',
      pincode: nearest.pincode
    };
  }

  /**
   * Search Indian cities/districts by keyword, district, state, or pincode
   */
  static searchLocations(query: string): LocationData[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches = INDIAN_DISTRICTS.filter(d => 
      d.city.toLowerCase().includes(q) ||
      d.district.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.pincode.includes(q)
    );

    return matches.map(d => ({
      city: d.city,
      district: d.district,
      state: d.state,
      country: 'India',
      latitude: d.latitude,
      longitude: d.longitude,
      isGPS: false,
      pincode: d.pincode
    }));
  }

  /**
   * Calculate nearest Indian district using Euclidean distance approximation
   */
  static findNearestDistrict(lat: number, lon: number): IndianDistrict {
    let nearest = INDIAN_DISTRICTS[0];
    let minDistance = Infinity;

    for (const d of INDIAN_DISTRICTS) {
      const dist = Math.hypot(d.latitude - lat, d.longitude - lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = d;
      }
    }

    return nearest;
  }
}

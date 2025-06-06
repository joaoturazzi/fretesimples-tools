
interface RouteResponse {
  distance: number;
  duration: number;
  route: {
    geometry: Array<{ lat: number; lng: number }>;
  };
}

interface GeocodeResponse {
  lat: number;
  lng: number;
  address: string;
}

const HERE_APP_ID = 'Bzof1AaU0q5fVzy4KMii';
const HERE_API_KEY = 'JeglUu9l7gXwCMcH6x5-FaX0AkwABnmICqMupmCfIng';

export class HereMapsService {
  private static baseUrl = 'https://router.hereapi.com/v8';
  private static geocodeUrl = 'https://geocode.search.hereapi.com/v1';

  static async geocodeAddress(address: string): Promise<GeocodeResponse | null> {
    try {
      const response = await fetch(
        `${this.geocodeUrl}/geocode?q=${encodeURIComponent(address)}&apiKey=${HERE_API_KEY}`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return {
          lat: item.position.lat,
          lng: item.position.lng,
          address: item.address.label
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  static async calculateRoute(origin: string, destination: string): Promise<RouteResponse | null> {
    try {
      // First geocode the addresses
      const originCoords = await this.geocodeAddress(origin);
      const destCoords = await this.geocodeAddress(destination);
      
      if (!originCoords || !destCoords) {
        throw new Error('Could not geocode addresses');
      }

      const response = await fetch(
        `${this.baseUrl}/routes?transportMode=truck&origin=${originCoords.lat},${originCoords.lng}&destination=${destCoords.lat},${destCoords.lng}&return=summary,polyline&apiKey=${HERE_API_KEY}`
      );
      
      if (!response.ok) throw new Error('Route calculation failed');
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: Math.round(route.sections[0].summary.length / 1000), // Convert to km
          duration: Math.round(route.sections[0].summary.duration / 60), // Convert to minutes
          route: {
            geometry: this.decodePolyline(route.sections[0].polyline)
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Route calculation error:', error);
      return null;
    }
  }

  private static decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
    // Simplified polyline decoding - in production, use a proper library
    // For now, return empty array
    return [];
  }
}

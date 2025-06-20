
export class PolylineDecoder {
  static decode(encoded: string): Array<{ lat: number; lng: number }> {
    if (!encoded) return [];
    
    try {
      const coords: Array<{ lat: number; lng: number }> = [];
      let index = 0;
      let lat = 0;
      let lng = 0;

      while (index < encoded.length) {
        let b;
        let shift = 0;
        let result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const deltaLat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const deltaLng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        coords.push({
          lat: lat / 1e5,
          lng: lng / 1e5
        });
      }

      return coords;
    } catch (error) {
      console.error('Error decoding polyline:', error);
      return [];
    }
  }
}


declare global {
  interface Window {
    H: {
      service: {
        Platform: {
          new (options: { apikey: string }): HerePlatform;
        };
      };
      Map: {
        new (
          container: HTMLElement,
          mapType: any,
          options: {
            zoom: number;
            center: { lat: number; lng: number };
          }
        ): HereMap;
      };
      mapview: {
        behavior: {
          Behavior: {
            new (options: any): any;
          };
        };
      };
      ui: {
        UI: {
          createDefault: (map: any) => any;
        };
      };
      map: {
        Marker: {
          new (position: { lat: number; lng: number }, options?: any): any;
        };
        Polyline: {
          new (lineString: any, options?: any): any;
        };
      };
      geo: {
        LineString: {
          new (): HereLineString;
        };
      };
    };
  }

  interface HerePlatform {
    createDefaultMapTypes: () => any;
  }

  interface HereMap {
    addObject: (object: any) => void;
    getViewPort: () => any;
    dispose: () => void;
  }

  interface HereLineString {
    pushPoint: (point: { lat: number; lng: number }) => void;
  }
}

export {};

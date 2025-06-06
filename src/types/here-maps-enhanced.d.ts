
declare global {
  interface Window {
    H: {
      Map: any;
      mapevents: {
        Behavior: any;
        MapEvents: any;
      };
      ui: {
        UI: {
          createDefault: (map: any) => any;
        };
      };
      service: {
        Platform: new (options: { apikey: string }) => {
          createDefaultLayers: () => any;
          getSearchService: () => any;
          getRoutingService: () => any;
        };
      };
      map: {
        Marker: new (position: { lat: number; lng: number }) => any;
        Polyline: new (lineString: any, options?: any) => any;
      };
      geo: {
        LineString: new () => {
          pushPoint: (point: { lat: number; lng: number }) => void;
        };
      };
    };
  }
}

export {};

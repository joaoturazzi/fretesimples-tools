
declare global {
  interface Window {
    H: {
      service: {
        Platform: new (options: { apikey: string }) => {
          createDefaultMapTypes: () => any;
        };
      };
      Map: new (
        container: HTMLElement,
        mapType: any,
        options: {
          zoom: number;
          center: { lat: number; lng: number };
        }
      ) => {
        dispose: () => void;
        getViewPort: () => {
          removeEventListener: (event: string, handler: () => void) => void;
          resize: () => void;
        };
        addObjects: (objects: any[]) => void;
        setCenter: (center: { lat: number; lng: number }) => void;
        setZoom: (zoom: number) => void;
      };
      mapview: {
        behavior: {
          Behavior: new (options: any) => any;
        };
      };
      ui: {
        UI: {
          createDefault: (map: any) => any;
        };
      };
      map: {
        Marker: new (position: { lat: number; lng: number }, options?: any) => any;
        Polyline: new (lineString: any, options?: any) => any;
      };
      geo: {
        LineString: new () => {
          pushPoint: (lat: number, lng: number) => void;
        };
      };
    };
  }
}

export {};

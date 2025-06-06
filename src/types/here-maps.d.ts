
declare global {
  interface Window {
    H: {
      service: {
        Platform: {
          new (options: { apikey: string }): {
            createDefaultMapTypes: () => any;
          };
        };
      };
      Map: {
        new (container: HTMLElement, mapTypes: any, options: any): {
          getViewPort: () => {
            removeEventListener: (event: string, handler: () => void) => void;
            resize: () => void;
          };
          dispose: () => void;
          addObject: (object: any) => void;
          setViewBounds: (bounds: any) => void;
        };
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
          new (position: any, options?: any): any;
        };
      };
      geo: {
        LineString: {
          new (): {
            pushPoint: (point: any) => void;
          };
        };
        Point: {
          new (lat: number, lng: number): any;
        };
      };
    };
  }
}

export {};

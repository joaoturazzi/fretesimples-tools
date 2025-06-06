
declare global {
  interface Window {
    H: {
      service: {
        Platform: new (options: { apikey: string }) => {
          createDefaultMapTypes: () => any;
        };
      };
      Map: new (container: HTMLElement, mapTypes: any, options: any) => {
        getViewPort: () => {
          removeEventListener: (event: string, handler: () => void) => void;
          resize: () => void;
        };
        dispose: () => void;
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
    };
  }
}

export {};

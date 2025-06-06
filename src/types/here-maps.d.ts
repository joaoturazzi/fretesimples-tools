
declare global {
  interface Window {
    H: typeof H;
  }

  namespace H {
    namespace service {
      class Platform {
        constructor(options: { apikey: string });
        createDefaultMapTypes(): any;
        getSearchService(): any;
        getRoutingService(): any;
      }
      interface ServiceResult {
        Response?: {
          View?: Array<{
            Result?: Array<{
              Location: {
                DisplayPosition: {
                  Latitude: number;
                  Longitude: number;
                };
              };
            }>;
          }>;
        };
      }
    }

    class Map {
      constructor(
        container: HTMLElement,
        mapType: any,
        options: {
          zoom: number;
          center: { lat: number; lng: number };
        }
      );
      addObject(object: any): void;
      removeObject(object: any): void;
      getViewModel(): any;
      dispose(): void;
    }

    namespace mapview {
      namespace behavior {
        class Behavior {
          constructor(options?: any);
        }
      }
    }

    namespace ui {
      class UI {
        static createDefault(map: any): any;
      }
    }

    namespace map {
      class Marker {
        constructor(position: { lat: number; lng: number }, options?: any);
      }
      class Polyline {
        constructor(lineString: any, options?: any);
      }
      class Group {
        constructor();
        addObject(object: any): void;
        getBoundingBox(): any;
      }
    }

    namespace geo {
      class LineString {
        constructor();
        pushPoint(point: { lat: number; lng: number }): void;
      }
    }
  }

  const H: typeof H;
}

export {};

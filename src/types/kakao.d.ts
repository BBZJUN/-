declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void;

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(level: number, options?: { animate?: boolean }): void;
      getLevel(): number;
    }

    interface MapOptions {
      center: LatLng;
      level: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    class Polygon {
      constructor(options: PolygonOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setOptions(options: Partial<PolygonOptions>): void;
      setPath(path: LatLng[]): void;
      getPath(): LatLng[];
    }

    interface PolygonOptions {
      map?: Map;
      path: LatLng[];
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      fillColor?: string;
      fillOpacity?: number;
      zIndex?: number;
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
      setPosition(position: LatLng): void;
      setContent(content: string | HTMLElement): void;
      setVisible(visible: boolean): void;
    }

    interface CustomOverlayOptions {
      map?: Map;
      position: LatLng;
      content: string | HTMLElement;
      xAnchor?: number;
      yAnchor?: number;
      zIndex?: number;
    }

    namespace event {
      function addListener(
        target: Map | Polygon | Marker,
        type: string,
        handler: (...args: unknown[]) => void
      ): void;
      function removeListener(
        target: Map | Polygon | Marker,
        type: string,
        handler: (...args: unknown[]) => void
      ): void;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }

    interface MarkerOptions {
      map?: Map;
      position: LatLng;
    }
  }
}

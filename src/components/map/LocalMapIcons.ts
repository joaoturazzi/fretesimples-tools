
import L from 'leaflet';

// Ícones SVG inline para evitar dependência de URLs externas
const greenIconSvg = `data:image/svg+xml;base64,${btoa(`
<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#22c55e"/>
  <circle cx="12.5" cy="12.5" r="6" fill="white"/>
</svg>
`)}`;

const redIconSvg = `data:image/svg+xml;base64,${btoa(`
<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#ef4444"/>
  <circle cx="12.5" cy="12.5" r="6" fill="white"/>
</svg>
`)}`;

const shadowSvg = `data:image/svg+xml;base64,${btoa(`
<svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20.5" cy="36" rx="15" ry="5" fill="rgba(0,0,0,0.3)"/>
</svg>
`)}`;

export const createSafeIcons = () => {
  try {
    return {
      greenIcon: new L.Icon({
        iconUrl: greenIconSvg,
        shadowUrl: shadowSvg,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),
      redIcon: new L.Icon({
        iconUrl: redIconSvg,
        shadowUrl: shadowSvg,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    };
  } catch (error) {
    console.warn('Erro ao criar ícones:', error);
    // Fallback para ícones padrão sem customização
    return {
      greenIcon: new L.Icon.Default(),
      redIcon: new L.Icon.Default()
    };
  }
};

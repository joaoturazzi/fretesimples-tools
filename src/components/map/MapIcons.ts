
import L from 'leaflet';

// Ícones customizados usando data URLs para evitar dependências externas
const createCustomIcon = (color: string) => {
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.9 12.5 41 12.5 41S25 19.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="7" fill="white"/>
    </svg>
  `;
  
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;
  
  return new L.Icon({
    iconUrl: dataUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export const greenIcon = createCustomIcon('#10B981'); // Verde para origem
export const redIcon = createCustomIcon('#EF4444');   // Vermelho para destino

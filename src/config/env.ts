
// Environment configuration
const env = {
  // HERE Maps API configuration - API key fornecida pelo usuário
  HERE_API_KEY: 'K7MXfdjJY8KO06EJgp52akxWMWhSzVypUKZ84hUpAYY',
  
  // API endpoints
  HERE_ROUTER_API: 'https://router.hereapi.com/v8',
  HERE_GEOCODE_API: 'https://geocode.search.hereapi.com/v1',
  
  // Fallback geocoding (OpenStreetMap/Nominatim) para problemas de CORS
  NOMINATIM_API: 'https://nominatim.openstreetmap.org',
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Rate limiting
  API_RATE_LIMIT: 100, // requests per minute
  API_RETRY_ATTEMPTS: 3,
  API_RETRY_DELAY: 1000, // milliseconds
} as const;

export default env;

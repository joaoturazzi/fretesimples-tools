
// Environment configuration
const env = {
  // HERE Maps API configuration
  HERE_API_KEY: import.meta.env.VITE_HERE_API_KEY || 'JeglUu9l7gXwCMcH6x5-FaX0AkwABnmICqMupmCfIng',
  
  // API endpoints
  HERE_ROUTER_API: 'https://router.hereapi.com/v8',
  HERE_GEOCODE_API: 'https://geocode.search.hereapi.com/v1',
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Rate limiting
  API_RATE_LIMIT: 60, // requests per minute
  API_RETRY_ATTEMPTS: 3,
  API_RETRY_DELAY: 1000, // milliseconds
} as const;

export default env;

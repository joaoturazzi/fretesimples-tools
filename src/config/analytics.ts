
// Analytics configuration
export const analyticsConfig = {
  // Google Analytics
  GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID',
  
  // Events tracking
  events: {
    CALCULATION_STARTED: 'calculation_started',
    CALCULATION_COMPLETED: 'calculation_completed',
    EXPORT_PDF: 'export_pdf',
    EXPORT_JSON: 'export_json',
    ROUTE_CALCULATED: 'route_calculated',
    ERROR_OCCURRED: 'error_occurred',
    PAGE_VIEW: 'page_view',
  },
  
  // Categories
  categories: {
    CALCULATOR: 'calculator',
    EXPORT: 'export',
    NAVIGATION: 'navigation',
    ERROR: 'error',
    PERFORMANCE: 'performance',
  }
} as const;

export default analyticsConfig;

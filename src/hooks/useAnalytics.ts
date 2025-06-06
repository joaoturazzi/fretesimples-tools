
import { useEffect } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const trackEvent = (event: AnalyticsEvent) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }

    // Console log for development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', event);
    }
  };

  const trackPageView = (page: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: page,
      });
    }
  };

  const trackCalculation = (type: string, result: any) => {
    trackEvent({
      action: 'calculation_completed',
      category: 'calculator',
      label: type,
      value: type === 'freight' ? result.totalFreight : undefined
    });
  };

  const trackExport = (type: string, format: string) => {
    trackEvent({
      action: 'export_completed',
      category: 'export',
      label: `${type}_${format}`
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackCalculation,
    trackExport
  };
};


import { useEffect } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = (event: AnalyticsEvent) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // Console log for development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', event);
    }
  };

  const trackPageView = (page: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
        page_path: page,
        page_title: title,
      });
    }
  };

  const trackCalculatorStart = (calculatorType: string) => {
    trackEvent({
      action: 'calculator_started',
      category: 'engagement',
      label: calculatorType,
      custom_parameters: {
        calculator_type: calculatorType,
        timestamp: Date.now()
      }
    });
  };

  const trackCalculation = (type: string, result: any, duration?: number) => {
    trackEvent({
      action: 'calculation_completed',
      category: 'calculator',
      label: type,
      value: type === 'freight' ? result.totalFreight : undefined,
      custom_parameters: {
        calculation_type: type,
        calculation_duration: duration,
        result_value: typeof result === 'object' ? JSON.stringify(result) : result
      }
    });
  };

  const trackExport = (type: string, format: string) => {
    trackEvent({
      action: 'export_completed',
      category: 'conversion',
      label: `${type}_${format}`,
      custom_parameters: {
        export_type: type,
        export_format: format
      }
    });
  };

  const trackError = (error: string, component?: string) => {
    trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: error,
      custom_parameters: {
        error_message: error,
        component_name: component,
        user_agent: navigator.userAgent
      }
    });
  };

  const trackPerformance = (metric: string, value: number, component?: string) => {
    trackEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metric,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metric,
        metric_value: value,
        component_name: component
      }
    });
  };

  const trackUserInteraction = (action: string, element: string, section?: string) => {
    trackEvent({
      action: 'user_interaction',
      category: 'engagement',
      label: `${action}_${element}`,
      custom_parameters: {
        interaction_type: action,
        element_type: element,
        section_name: section
      }
    });
  };

  const trackFormSubmission = (formType: string, success: boolean, errors?: string[]) => {
    trackEvent({
      action: success ? 'form_submission_success' : 'form_submission_error',
      category: 'conversion',
      label: formType,
      custom_parameters: {
        form_type: formType,
        submission_success: success,
        form_errors: errors?.join(', ')
      }
    });
  };

  // Auto-track page performance on mount
  useEffect(() => {
    const trackPagePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime;
          
          if (loadTime > 0) {
            trackPerformance('page_load_time', loadTime, 'page');
          }
          
          if (domContentLoaded > 0) {
            trackPerformance('dom_content_loaded', domContentLoaded, 'page');
          }
          
          if (firstPaint) {
            trackPerformance('first_paint', firstPaint, 'page');
          }
        }
      }
    };

    // Track performance after page load
    setTimeout(trackPagePerformance, 1000);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackCalculatorStart,
    trackCalculation,
    trackExport,
    trackError,
    trackPerformance,
    trackUserInteraction,
    trackFormSubmission
  };
};

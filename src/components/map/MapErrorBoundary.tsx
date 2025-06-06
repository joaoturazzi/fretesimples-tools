
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Map } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class MapErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;
  
  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MapErrorBoundary caught a map-related error:', error, errorInfo);
    
    // Log específico para erros do react-leaflet
    if (error.message.includes('r is not a function') || 
        error.stack?.includes('react-leaflet') ||
        error.stack?.includes('leaflet')) {
      console.error('LEAFLET ERROR DETECTED:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
    
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Auto-retry após 3 segundos para erros específicos do mapa
    if (this.state.retryCount < 2 && this.isRecoverableError(error)) {
      this.scheduleRetry();
    }
  }

  private isRecoverableError = (error: Error): boolean => {
    const recoverableMessages = [
      'r is not a function',
      'Cannot read properties of undefined',
      'map is not ready',
      'tile loading error'
    ];
    
    return recoverableMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  };

  private scheduleRetry = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    
    this.retryTimeout = setTimeout(() => {
      console.log('MapErrorBoundary: Attempting auto-retry...');
      this.handleReset(true);
    }, 3000);
  };

  private handleReset = (isAutoRetry = false) => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: isAutoRetry ? prevState.retryCount + 1 : 0
    }));
  };

  public componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isLeafletError = this.state.error?.message.includes('r is not a function') ||
                            this.state.error?.stack?.includes('leaflet');

      return (
        <div className="w-full h-full rounded-lg border border-red-200 bg-red-50 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              {isLeafletError ? (
                <Map className="h-12 w-12 text-red-500" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-red-500" />
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {isLeafletError ? 'Erro do Mapa' : 'Erro no Componente'}
            </h3>
            
            <p className="text-red-700 text-sm mb-4">
              {isLeafletError 
                ? 'Falha na inicialização do mapa. Tentaremos recarregar automaticamente.'
                : (this.state.error?.message || 'Ocorreu um erro inesperado no mapa')
              }
            </p>
            
            {this.state.retryCount > 0 && (
              <p className="text-red-600 text-xs mb-4">
                Tentativa {this.state.retryCount} de 3
              </p>
            )}
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => this.handleReset()}
                disabled={this.state.retryCount >= 2}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} />
                Tentar novamente
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-red-600 cursor-pointer">
                  Detalhes do erro (dev)
                </summary>
                <pre className="text-xs text-red-700 mt-2 p-2 bg-red-100 rounded overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;

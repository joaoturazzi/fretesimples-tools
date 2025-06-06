
import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import SimpleMapFallback from './SimpleMapFallback';

interface Props {
  children: ReactNode;
  origin?: string;
  destination?: string;
  distance?: number;
  duration?: number;
  className?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Map Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log('Map error boundary activated, showing fallback');
      
      // Se temos origem e destino, mostrar o fallback simples
      if (this.props.origin && this.props.destination) {
        return (
          <SimpleMapFallback
            origin={this.props.origin}
            destination={this.props.destination}
            distance={this.props.distance}
            duration={this.props.duration}
            className={this.props.className}
          />
        );
      }

      // Caso contrário, mostrar erro genérico
      return (
        <div className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-6 ${this.props.className || 'h-64'}`}>
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-700 mb-1">Erro no Mapa</h3>
            <p className="text-xs text-gray-500">Não foi possível carregar o mapa</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;

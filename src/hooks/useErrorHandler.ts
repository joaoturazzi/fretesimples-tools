
import { useCallback } from 'react';
import { useNotify } from '@/components/ui/notification';
import { ApiError } from '@/services/hereMapsService';
import { ZodError } from 'zod';

interface ErrorHandlerOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const notify = useNotify();

  const handleError = useCallback((
    error: unknown,
    context?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showNotification = true,
      logToConsole = true,
      fallbackMessage = 'Ocorreu um erro inesperado'
    } = options;

    let title = 'Erro';
    let message = fallbackMessage;

    // Handle different error types
    if (error instanceof ApiError) {
      title = 'Erro da API';
      message = error.message;
      
      if (error.status === 429) {
        title = 'Limite de requisições';
        message = 'Muitas requisições. Tente novamente em alguns minutos.';
      } else if (error.status === 403) {
        title = 'Acesso negado';
        message = 'Não há permissão para acessar este recurso.';
      } else if (error.status === 404) {
        title = 'Não encontrado';
        message = 'O recurso solicitado não foi encontrado.';
      }
    } else if (error instanceof ZodError) {
      title = 'Erro de validação';
      const firstError = error.issues[0];
      message = firstError ? firstError.message : 'Dados inválidos fornecidos';
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Add context to message if provided
    if (context) {
      message = `${context}: ${message}`;
    }

    // Log to console if enabled
    if (logToConsole) {
      console.error('Error handled:', {
        error,
        context,
        title,
        message,
        timestamp: new Date().toISOString()
      });
    }

    // Show notification if enabled
    if (showNotification) {
      notify.error(title, message);
    }

    return { title, message };
  }, [notify]);

  // Specific handlers for common scenarios
  const handleApiError = useCallback((error: unknown, operation?: string) => {
    const context = operation ? `Erro em ${operation}` : 'Erro da API';
    return handleError(error, context);
  }, [handleError]);

  const handleValidationError = useCallback((error: unknown, formName?: string) => {
    const context = formName ? `Validação do formulário ${formName}` : 'Erro de validação';
    return handleError(error, context);
  }, [handleError]);

  const handleNetworkError = useCallback((error: unknown) => {
    return handleError(error, 'Erro de conexão', {
      fallbackMessage: 'Verifique sua conexão com a internet e tente novamente'
    });
  }, [handleError]);

  return {
    handleError,
    handleApiError,
    handleValidationError,
    handleNetworkError
  };
};

export default useErrorHandler;

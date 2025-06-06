
import { useNotify } from '@/components/ui/notification';

export const useFreightValidation = () => {
  const notify = useNotify();

  const validateInputs = (
    distance: number | '',
    weight: number | '',
    setHasError: (value: boolean) => void,
    setErrorMessage: (value: string) => void
  ) => {
    if (distance === '' || distance <= 0) {
      const message = 'Por favor, informe uma distância válida.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Erro de validação', message);
      return false;
    }

    if (weight === '' || weight <= 0) {
      const message = 'Por favor, informe um peso válido.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Erro de validação', message);
      return false;
    }

    setHasError(false);
    setErrorMessage('');
    return true;
  };

  return { validateInputs };
};

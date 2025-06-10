
import { useNotify } from '@/components/ui/notification';

export const useFreightValidation = () => {
  const notify = useNotify();

  const validateInputs = (
    distance: number | '',
    weight: number | '',
    setHasError: (value: boolean) => void,
    setErrorMessage: (value: string) => void
  ): boolean => {
    // Reset error state
    setHasError(false);
    setErrorMessage('');

    // Validate distance
    if (distance === '' || distance === null || distance === undefined) {
      const message = 'Por favor, informe a distância da viagem.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Campo obrigatório', message);
      return false;
    }

    if (typeof distance === 'number' && distance <= 0) {
      const message = 'A distância deve ser maior que zero.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Valor inválido', message);
      return false;
    }

    // Validate realistic distance for Brazil (max 5000km)
    if (typeof distance === 'number' && distance > 5000) {
      const message = 'Distância muito alta. Verifique se está correta (máximo 5.000 km).';
      setErrorMessage(message);
      setHasError(true);
      notify.warning('Distância suspeita', message);
      return false;
    }

    // Validate weight
    if (weight === '' || weight === null || weight === undefined) {
      const message = 'Por favor, informe o peso da carga.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Campo obrigatório', message);
      return false;
    }

    if (typeof weight === 'number' && weight <= 0) {
      const message = 'O peso deve ser maior que zero.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Valor inválido', message);
      return false;
    }

    // Validate realistic weight (max 50 tons for truck)
    if (typeof weight === 'number' && weight > 50000) {
      const message = 'Peso muito alto. Verifique se está em quilogramas (máximo 50.000 kg).';
      setErrorMessage(message);
      setHasError(true);
      notify.warning('Peso suspeito', message);
      return false;
    }

    return true;
  };

  return { validateInputs };
};

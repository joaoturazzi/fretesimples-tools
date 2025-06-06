
import { useState, useCallback, useEffect } from 'react';

interface CalculationEntry {
  id: string;
  type: 'freight' | 'risk' | 'fuel' | 'vehicle';
  data: any;
  result: any;
  timestamp: number;
  title: string;
}

export const useCalculationHistory = () => {
  const [history, setHistory] = useState<CalculationEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('calculation_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading calculation history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem('calculation_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving calculation history:', error);
    }
  }, [history]);

  const addCalculation = useCallback((entry: Omit<CalculationEntry, 'id' | 'timestamp'>) => {
    const newEntry: CalculationEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    
    setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep only last 50 calculations
  }, []);

  const removeCalculation = useCallback((id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('calculation_history');
  }, []);

  const getByType = useCallback((type: CalculationEntry['type']) => {
    return history.filter(entry => entry.type === type);
  }, [history]);

  return {
    history,
    addCalculation,
    removeCalculation,
    clearHistory,
    getByType
  };
};

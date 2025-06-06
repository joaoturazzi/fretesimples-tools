
import { useState, useCallback } from 'react';

interface FreightData {
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  vehicleType: string;
  fuelPrice: number;
  consumption: number;
  tollsCost: number;
  costPerKm: number;
  totalCost: number;
  timestamp: number;
}

interface SharedDataState {
  freightData: FreightData | null;
  riskData: any | null;
  costData: any | null;
}

const useSharedData = () => {
  const [data, setData] = useState<SharedDataState>({
    freightData: null,
    riskData: null,
    costData: null
  });

  const saveFreightData = useCallback((freightData: FreightData) => {
    setData(prev => ({
      ...prev,
      freightData: { ...freightData, timestamp: Date.now() }
    }));
    // Also save to localStorage for persistence
    localStorage.setItem('freightData', JSON.stringify(freightData));
  }, []);

  const saveRiskData = useCallback((riskData: any) => {
    setData(prev => ({
      ...prev,
      riskData: { ...riskData, timestamp: Date.now() }
    }));
    localStorage.setItem('riskData', JSON.stringify(riskData));
  }, []);

  const saveCostData = useCallback((costData: any) => {
    setData(prev => ({
      ...prev,
      costData: { ...costData, timestamp: Date.now() }
    }));
    localStorage.setItem('costData', JSON.stringify(costData));
  }, []);

  const exportAllData = useCallback(() => {
    const allData = {
      freight: data.freightData,
      risk: data.riskData,
      cost: data.costData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logistica-dados-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  return {
    data,
    saveFreightData,
    saveRiskData,
    saveCostData,
    exportAllData
  };
};

export default useSharedData;
export type { FreightData };

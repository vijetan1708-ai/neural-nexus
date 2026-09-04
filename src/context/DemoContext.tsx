import React, { createContext, useContext, useState } from 'react';
import { DemoScenario, DemoScenarioId } from '../types/demo';
import { DemoService } from '../services/demoService';

interface DemoContextType {
  isDemoActive: boolean;
  activeScenario: DemoScenario;
  scenarios: DemoScenario[];
  setDemoScenario: (id: DemoScenarioId) => void;
  toggleDemoMode: (enabled?: boolean) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [activeScenarioId, setActiveScenarioId] = useState<DemoScenarioId>('cyclone');

  const scenarios = DemoService.getScenarios();
  const activeScenario = DemoService.getScenarioById(activeScenarioId);

  const setDemoScenario = (id: DemoScenarioId) => {
    setActiveScenarioId(id);
    setIsDemoActive(true);
  };

  const toggleDemoMode = (enabled?: boolean) => {
    setIsDemoActive(prev => (enabled !== undefined ? enabled : !prev));
  };

  return (
    <DemoContext.Provider value={{
      isDemoActive,
      activeScenario,
      scenarios,
      setDemoScenario,
      toggleDemoMode
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

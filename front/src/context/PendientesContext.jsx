import React, { createContext, useContext, useState } from 'react';

const PendientesContext = createContext();

export function usePendientes() {
  return useContext(PendientesContext);
}

export function PendientesProvider({ children }) {
  const [pendientes, setPendientes] = useState(0);
  return (
    <PendientesContext.Provider value={{ pendientes, setPendientes }}>
      {children}
    </PendientesContext.Provider>
  );
} 
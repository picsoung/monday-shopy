import { createContext, useContext } from 'react';

export const AppContext = createContext({products:[], categories:[], cart:[]});

let sharedState = {/* whatever you want */}
export function AppWrapper({ children }) {
  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
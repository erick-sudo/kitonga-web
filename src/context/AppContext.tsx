import React, { createContext, useState } from "react";

interface AppData {
  stopLoading: () => void;
  startLoading: () => void;
  loading: boolean;
}

export const AppContext = createContext<AppData>({
  stopLoading: () => {},
  startLoading: () => {},
  loading: false,
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);

  const stopLoading = () => setLoading(false);

  const contextData = {
    stopLoading,
    startLoading,
    loading,
  };
  return (
    <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

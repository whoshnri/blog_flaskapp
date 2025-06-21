import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { stackClientApp } from "./stack";

const StackAppContext = createContext();

export function StackAppProvider({ children }) {
  const navigate = useNavigate();

  // Enhance the app instance with React-specific functionality
  const appWithNavigation = {
    ...stackClientApp,
    redirect: (url) => navigate(url),
    getUser: async () => {
      // Implement your user fetching logic here
      return stackClientApp.getUser();
    }
  };

  return (
    <StackAppContext.Provider value={appWithNavigation}>
      {children}
    </StackAppContext.Provider>
  );
}

export function useStackApp() {
  const context = useContext(StackAppContext);
  if (!context) {
    throw new Error("useStackApp must be used within a StackAppProvider");
  }
  return context;
}

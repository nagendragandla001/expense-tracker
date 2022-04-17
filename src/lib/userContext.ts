import { createContext, useContext } from "react";

export const AppContext = createContext({} as any);

export const useAppContext = () => {
  return useContext(AppContext);
};

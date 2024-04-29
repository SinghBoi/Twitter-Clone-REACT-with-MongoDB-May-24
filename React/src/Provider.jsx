import { createContext } from "react";
import { getAll, login, signUp, getOne, change, remove } from "./Service";

const Context = createContext();

function Provider({ children }) {
  return (
    <Context.Provider value={{ getAll, login, signUp, getOne, change, remove }}>
      {children}
    </Context.Provider>
  );
}

export { Context, Provider };

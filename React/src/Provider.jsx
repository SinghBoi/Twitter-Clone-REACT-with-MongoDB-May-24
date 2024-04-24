import { createContext } from "react";
import { getAll, login, signUp, getOne, create, change, remove } from "./Service";

const Context = createContext();

function Provider({ children }) {
  return (
    <Context.Provider value={{ getAll, login, signUp, getOne, create, change, remove }}>
      {children}
    </Context.Provider>
  );
}

export { Context, Provider };

import { createContext } from "react";
import { getAll, getOne, create, change, remove } from "./Service";

const Context = createContext();

function Provider({ children }) {
  return (
    <Context.Provider value={{ getAll, getOne, create, change, remove }}>
      {children}
    </Context.Provider>
  );
}

export { Context, Provider };

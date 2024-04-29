import { createContext } from "react";
import { getUsers, getTweets, login, signUp, tweet, getOne, change, remove } from "./Service";

const Context = createContext();

function Provider({ children }) {
  return (
    <Context.Provider value={{ getUsers, getTweets, login, signUp, tweet, getOne, change, remove }}>
      {children}
    </Context.Provider>
  );
}

export { Context, Provider };

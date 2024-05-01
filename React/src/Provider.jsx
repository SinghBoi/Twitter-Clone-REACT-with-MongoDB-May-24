import { createContext } from "react";
import {
  signup,
  login,
  logout,
  getSessionUserProfile,
  getUserProfile,
  postTweet,
  getTweets,
  getUserTweets,
  getTrendingHashtags,
  followUser,
  unfollowUser,
  search,
} from "./Service";

const Context = createContext();

function Provider({ children }) {
  return (
    <Context.Provider
      value={{
        signup,
        login,
        logout,
        getSessionUserProfile,
        getUserProfile,
        postTweet,
        getTweets,
        getUserTweets,
        getTrendingHashtags,
        followUser,
        unfollowUser,
        search,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, Provider };

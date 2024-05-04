import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000/",
});

// Set Authorization header for all requests
api.interceptors.request.use(
  (config) => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      config.headers.Authorization = `Bearer ${userId}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Redirect to login page if we get 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const signup = async (newUser) => {
  try {
    if (newUser.password === newUser.verifyPassword) {
      delete newUser.verifyPassword;
      const resp = await api.post(`/signup`, newUser);
      if (resp.status !== 201) {
        throw new Error("Malfunctioning server GET request");
      }
      return resp.data;
    } else {
      throw new Error("Password Mismatch");
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

const login = async (loginData) => {
  try {
    const resp = await api.post(`/login`, loginData);
    if (resp.status === 200) { // Store authentication token in session storage upon successful login
      sessionStorage.setItem("userId", resp.data.userId);
      return resp.data;
    } else {
      throw new Error("Login failed");
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

const logout = () => {
  sessionStorage.delete("userId");
};

const getSessionUserProfile = () => {
  return api.get(`/profile`);
};

const getUserProfile = (id) => {
  return api.get(`/users/${id}`);
};

const postTweet = (tweetText) => {
  return api.post(`/tweets`, {
    text: tweetText,
  });
};

const getTweets = async () => {
  try {
    const resp = await api.get("/tweets");

    if (resp.status !== 200) {
      throw new Error("Malfunctioning server GET request");
    }
    return resp.data;
  } catch (err) {
    console.error(err.message);
    return [];
  }
};

const getUserTweets = (id) => {
  return api.get(`/tweets/users/${id}`);
};

const getTrendingHashtags = () => {
  return api.get(`/tweets/trending`);
};

const followUser = (id) => {
  return api.post(`/users/${id}/follow`, {});
};

const unfollowUser = (id) => {
  return api.post(`/users/${id}/unfollow`, {});
};

const search = (find) => {
  return api.get(`/search?find=${find}`);
};

export {
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
};

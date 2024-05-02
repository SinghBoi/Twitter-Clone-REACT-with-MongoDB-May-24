import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { User, Tweet } from "./Model.js";

const app = express();
app.use(cors()); // Middleware för att tillåta extern kommunikation
app.use(bodyParser.json()); // Middleware för att kunna ta emot JSON-format

// Authentication Middleware
const requireAuth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || token === "Bearer null") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = token.replace("Bearer ", "");
  next();
};

function validatePassword(password) {
  const char = /[!@#$%^&*()_+={}\[\];:'"<>,.?/]/;
  const num = /\d/;
  return password.length >= 8 && char.test(password) && num.test(password);
}

// API

// Register a new user
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    const existingUserWithSameEmail = await User.findOne({
      email: req.body.email,
    });
    if (existingUserWithSameEmail) {
      // Check if email already exists
      return res.status(409).json({ error: "Email already exists" });
    }
    const existingUserWithSameUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUserWithSameUsername) {
      // Check if username already exists
      return res.status(409).json({ error: "Username already exists" });
    }
    if (!validatePassword(req.body.password)) {
      // Validate password (if needed)
      console.log("Password issues ");
      return res.status(400).json({
        error:
          "Password must be at least 8 characters, containing one numeric and one special character",
      });
    }
    const newUser = await user.save(); // Save the new user to the database
    res.status(201).json({ userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user and return userid
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "No Such User Exists" });
    }
    if (password !== user.password) {
      // Validate password stored in the database
      return res.status(400).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile for the loggedin user
app.get("/profile", requireAuth, async (req, res) => {
  // Fetch user profile based on userId from session
  const user = await User.findById(req.userId).populate("followers following");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const followersCount = user.followers.length;
  const followingCount = user.following.length;
  res.status(200).json({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    about: user.about,
    employment: user.employment,
    hometown: user.hometown,
    website: user.website,
    followersCount,
    followingCount,
  });
});

// Get a user profile and count follows
app.get("/users/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("followers following");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const followersCount = user.followers.length;
    const followingCount = user.following.length;
    res.status(200).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      about: user.about,
      employment: user.employment,
      hometown: user.hometown,
      website: user.website,
      followersCount,
      followingCount,
    });
  } catch (err) {
    res.status(500).send();
  }
});

// Post a new tweet
app.post("/tweets", requireAuth, async (req, res) => {
  const { text } = req.body;
  try {
    // Extract hashtags from the tweet text
    const words = text.split(" ");
    const hashtags = words
      .filter((word) => word.startsWith("#"))
      .map((hashtag) => hashtag.toLowerCase());

    const newTweet = new Tweet({
      text,
      postedBy: req.userId,
      hashtags,
    });
    const savedTweet = await newTweet.save();
    res.status(201).json(savedTweet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent tweets from followed users plus my own
app.get("/tweets", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("following");
    const followingUserIds = user.following.map((user) => user._id);
    const followingPlusOwnUserId = [...followingUserIds, req.userId];
    const tweets = await Tweet.find({
      postedBy: { $in: followingPlusOwnUserId },
    })
      .populate("postedBy", "name username")
      .sort({ date: -1 });
    res.status(200).json(
      tweets.map((tweet) => ({
        id: tweet._id,
        text: tweet.text,
        userId: tweet.postedBy._id,
        name: tweet.postedBy.name,
        username: tweet.postedBy.username,
        hashtags: tweet.hashtags,
        date: tweet.date,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent tweets from a specific user
app.get("/tweets/users/:userid", requireAuth, async (req, res) => {
  try {
    const userId = req.params.userid;
    const tweets = await Tweet.find({ postedBy: userId }).populate(
      "postedBy",
      "name username"
    );
    res.status(200).json(
      tweets.map((tweet) => ({
        id: tweet._id,
        text: tweet.text,
        name: tweet.postedBy.name,
        userId: tweet.postedBy._id,
        username: tweet.postedBy.username,
        hashtags: tweet.hashtags,
        date: tweet.date,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending # from followed users
app.get("/tweets/trending", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("following", "_id");
    const followingIds = user.following.map((user) => user._id);
    const followingPlusOwnUserId = [...followingIds, req.userId];
    const tweets = await Tweet.find({
      postedBy: { $in: followingPlusOwnUserId },
    })
      .populate("postedBy", "name")
      .sort({ date: -1 });
    const hashtags = {};
    tweets.forEach((tweet) => {
      tweet.hashtags.forEach((hashtag) => {
        if (hashtags[hashtag]) {
          hashtags[hashtag]++;
        } else {
          hashtags[hashtag] = 1;
        }
      });
    });
    const trendingHashtags = Object.keys(hashtags)
      .sort((a, b) => hashtags[b] - hashtags[a])
      .slice(0, 10);
    res.status(200).json(trendingHashtags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow another user
app.post("/users/:userid/follow", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const followUserId = req.params.userid;
    const user = await User.findById(userId);
    const followUser = await User.findById(followUserId);
    if (!followUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.following.includes(followUserId)) {
      return res.status(400).json({ error: "Already following this user" });
    }
    user.following.push(followUserId);
    followUser.followers.push(userId);
    await user.save();
    await followUser.save();
    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow another user
app.post("/users/:userid/unfollow", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const unfollowUserId = req.params.userid;
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowUserId);
    if (!unfollowUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.following.includes(unfollowUserId)) {
      return res.status(400).json({ error: "Not following this user" });
    }
    user.following.pull(unfollowUserId);
    unfollowUser.followers.pull(userId);
    await user.save();
    await unfollowUser.save();
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for tweets and users
app.get("/search", requireAuth, async (req, res) => {
  try {
    const query = req.query.find;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });
    const tweets = await Tweet.find({
      text: { $regex: query, $options: "i" },
    })
      .populate("postedBy", "name username")
      .sort({ date: -1 });
    res.status(200).json({
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        username: user.username,
      })),
      tweets: tweets.map((tweet) => {
        console.log(tweet);
        return {
          id: tweet._id,
          text: tweet.text,
          name: tweet.postedBy.name,
          userId: tweet.postedBy._id,
          username: tweet.postedBy.username,
          hashtags: tweet.hashtags,
          date: tweet.date,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const start = async () => {
  try {
    const dbUrl = "mongodb://localhost:27017/TwitterClone";
    await mongoose.connect(dbUrl);
    app.listen(9000, () => console.log("Server started on port 9000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

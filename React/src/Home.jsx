import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Provider";
import Image from "./Images";
import Hashtags from "./components/Hashtags";
import Search from "./components/Search";
import "./Home.css";

const Home = () => {
  const { getTweets, postTweet, getTrendingHashtags, search } =
    useContext(Context);

  const [tweets, setTweets] = useState([]);

  const [hashtags, setHashtags] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState({ tweets: [], users: [] });

  const [newTweet, setNewTweet] = useState("");
  // const [username, setUsername] = useState("current_user");

  useEffect(() => {
    async function main() {
      const tweets = await getTweets();
      setTweets(tweets);
    }
    main();
  }, []);

  useEffect(() => {
    async function main() {
      const trendingHashtags = await getTrendingHashtags();
      setHashtags(trendingHashtags.data);
    }
    main();
  }, [tweets]);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    const searchResult = await search(searchQuery);
    setSearchResult(searchResult.data);
    // Implement search functionality here
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (newTweet.trim() === "") return;

    try {
      await postTweet(newTweet);
      // Fetch tweets again to update the list with the newly submitted tweet
      const updatedTweets = await getTweets();
      setTweets(updatedTweets);
      setNewTweet("");
    } catch (error) {
      console.error("Error submitting tweet:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="tweets-container">
        <h2>Latest Tweets</h2>
        <form onSubmit={handleTweetSubmit} className="tweet-form">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What's happening?"
            maxLength={140}
            className="tweet-input"
          />
          <button type="submit" className="tweet-button">
            Tweet
          </button>
        </form>
        {tweets.map((tweet) => (
          <div key={tweet.id} className="tweet">
            <Link to={`/profile/${tweet.userId}`}>
              <Image />
            </Link>
            <div className="tweet-details">
              <p className="tweet-user">@{tweet.username}</p>
              <p>{tweet.text}</p>
              <p className="tweet-date"><img
                src="/calendar-days-solid.svg"
                alt="Joined"
                className="icon"
              />{new Date(tweet.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar">
        <Search
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          searchResult={searchResult}
        />
        <Hashtags hashtags={hashtags} />
      </div>
    </div>
  );
};

export default Home;
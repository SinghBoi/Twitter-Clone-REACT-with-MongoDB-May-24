import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [hashtags, setHashtags] = useState([
    "#programming",
    "#technology",
    "#coding",
    "#reactjs",
    "#javascript",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTweet, setNewTweet] = useState("");
  const [username, setUsername] = useState("current_user");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
  };

  const handleTweetSubmit = (e) => {
    e.preventDefault();
    if (newTweet.trim() === "") return;
    const updatedTweets = [
      ...tweets,
      { id: tweets.length + 1, text: newTweet, user: username },
    ];
    setTweets(updatedTweets);
    setNewTweet("");
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
            <p className="tweet-user">@{tweet.user}</p>
            <p>{tweet.text}</p>
          </div>
        ))}
      </div>
      <div className="sidebar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="trending-hashtags">
          <h3>Trending Hashtags</h3>
          <ul>
            {hashtags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;

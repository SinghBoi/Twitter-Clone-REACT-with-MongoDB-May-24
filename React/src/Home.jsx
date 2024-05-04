import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Provider";
import Hashtags from "./components/Hashtags";
import Search from "./components/Search";

export default function Home ({ userAvatarUrl }) {
  const { getTweets, postTweet, getTrendingHashtags, search } = useContext(Context);
  const [tweets, setTweets] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState({ tweets: [], users: [] });
  const [newTweet, setNewTweet] = useState("");

  useEffect(() => {
  async function fetchData() {
    const [tweetsData, trendingHashtagsData] = await Promise.all([
      getTweets(),
      getTrendingHashtags(),
    ]);
    setTweets(tweetsData);
    setHashtags(trendingHashtagsData.data);
  }
  fetchData();
}, [tweets]);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    const searchResult = await search(searchQuery);
    setSearchResult(searchResult.data); // Implement search functionality here
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (newTweet.trim() === "") return;

    try {
      await postTweet(newTweet); // Fetch tweets again to update the list with the newly submitted tweet
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
          <textarea value={newTweet} onChange={(e) => setNewTweet(e.target.value)} placeholder="What's happening?"
            maxLength={140} className="tweet-input" />
          <button type="submit" className="tweet-button">Tweet</button>
        </form>
        {tweets.map((tweet) => (
  			<div key={tweet.id} className="tweet">
    		<Link to={`/profile/${tweet.userId}`} className="user-link">
      			<img src={`https://picsum.photos/seed/${tweet.username}/50`} alt={`Profile of ${tweet.username}`} />
      			<span className="username">{tweet.username}</span>
    		</Link>
    		<div className="tweet-details">
      		<p>{tweet.text}</p>
      		<p className="tweet-date">
        	<img src="/calendar-days-solid.svg" alt="Joined" className="icon" />
        	{new Date(tweet.date).toLocaleString()}
      		</p>
    		</div>
  		</div>
		))}
      </div>
      <div className="sidebar">
        <Search searchQuery={searchQuery} handleSearch={handleSearch} searchResult={searchResult} />
        <Hashtags hashtags={hashtags} />
      </div>
    </div>
  );
};

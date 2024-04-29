import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Provider";
import Image from "./Images";
import "./Home.css";

const Home = () => {
const { getUsers, getTweets, tweet } = useContext(Context);
//   const navigate = useNavigate();

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
	useEffect(() => {
        async function main() {
            const tweets = await getTweets();
            const users = await getUsers();
            setTweets(tweets);
			setUsername(users)
        }
        main();
    }, [getTweets]);

	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
		// Implement search functionality here
	};

	const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (newTweet.trim() === "") return;
    try {
      // Submit the new tweet using your context function
      await tweet({ userId: user.id, text: newTweet });
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
							<Image/>
						</Link>
						<div className="tweet-details">
							<p className="tweet-user">@{tweet.user}</p>
							<p>{tweet.text}</p>
						</div>
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

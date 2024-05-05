import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "./Provider";
import Hashtags from "./components/Hashtags";
import Search from "./components/Search";

export default function Profile() {
  const {
    getUserProfile,
    getUserTweets,
    followUser,
    unfollowUser,
    getTrendingHashtags,
    search,
  } = useContext(Context);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hashtags, setHashtags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState({ tweets: [], users: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const trendingHashtags = await getTrendingHashtags();
        setHashtags(trendingHashtags.data);

        const profileResponse = await getUserProfile(id);
        const profileData = profileResponse.data;
        if (profileData) {
          setUser({
            ...profileData,
            coverPhotoUrl: `https://picsum.photos/seed/${profileData.username}/1920/1080`,
            avatarUrl: `https://picsum.photos/seed/${profileData.username}/200`,
          });
        } else {
          console.error("User or follower data not found");
        }

        const tweetsResponse = await getUserTweets(id);
        setTweets(tweetsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, tweets, getUserProfile, getUserTweets]);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    const searchResult = await search(searchQuery);
    setSearchResult(searchResult.data); // Implement search functionality here
  };

  const followOrUnfollow = async () => {
    if (user.isFollowing === true) {
      await unfollowUser(id);
    } else {
      await followUser(id);
    }
    const profileResponse = await getUserProfile(id);
    const profileData = profileResponse.data;
    setUser({
      ...profileData,
      coverPhotoUrl: `https://picsum.photos/seed/${profileData.username}/1920/1080`,
      avatarUrl: `https://picsum.photos/seed/${profileData.username}/200`,
    });
  };

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <img src={user.coverPhotoUrl} alt="Cover" className="profile-cover" />
        <div className="profile-body">
          <div className="profile-avatar-container">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="profile-avatar"
            />
          </div>
          <div className="profile-info-container">
            <h1>@{user.username}</h1>
            <div className="profile-info-about">
              {" "}
              <p>{user.about}</p>{" "}
            </div>
            <div className="profile-extra-info">
              <img src="/briefcase-solid.svg" alt="Work" className="icon" />
              <span>
                {" "}
                <p>{user.employment}</p>{" "}
              </span>
              <img src="/globe-solid.svg" alt="Location" className="icon" />
              <span>
                {" "}
                <p>{user.hometown}</p>{" "}
              </span>
              <img src="/paperclip-solid.svg" alt="Website" className="icon" />
              <a href={user.website} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
              <div className="profile-joined">
                <img
                  src="/calendar-days-solid.svg"
                  alt="Joined"
                  className="icon"
                />
                <span>
                  Joined {new Date(user.registrationDate).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="profile-stats">
              <span>
                {" "}
                <strong>{user.followingCount}</strong> Following{" "}
              </span>
              <span>
                {" "}
                <strong>{user.followersCount}</strong> Followers{" "}
              </span>
            </div>
          </div>
          <button className="follow-btn" onClick={followOrUnfollow}>
            {" "}
            {user.isFollowing ? "Unfollow" : "Follow"}{" "}
          </button>
        </div>
        <div className="tweets-container">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="tweet">
              <div className="tweet-header">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="tweet-avatar"
                />
                <h3>{user.username}</h3>
              </div>
              <p className="tweet-text">{tweet.text}</p>
              <span className="tweet-date">
                <img
                  src="/calendar-days-solid.svg"
                  alt="Joined"
                  className="icon"
                />
                {new Date(tweet.date).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="profile-sidebar">
        <Search
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          searchResult={searchResult}
        />
        <Hashtags hashtags={hashtags} />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne } from "./Service";
import "./Profile.css";

export default function Profile() {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [tweets, setTweets] = useState([]);

	useEffect(() => {
		async function fetchUserData() {
			const userData = await getOne(id);
			if (userData) {
				setUser(userData);
				setTweets(userData.tweets || []);
			}
		}
		fetchUserData();
	}, [id]);

	const getTimeSince = (dateString) => {
		const tweetDate = new Date(dateString);
		const now = new Date();
		const secondsPast = (now.getTime() - tweetDate.getTime()) / 1000;

		if (secondsPast < 60) {
			return `${parseInt(secondsPast)}s`;
		}
		const minutesPast = parseInt(secondsPast / 60);
		if (minutesPast < 60) {
			return `${minutesPast}m`;
		}
		const hoursPast = parseInt(minutesPast / 60);
		if (hoursPast < 24) {
			return `${hoursPast}h`;
		}
		const daysPast = parseInt(hoursPast / 24);
		if (daysPast < 7) {
			return `${daysPast}d`;
		}
		return tweetDate.toLocaleDateString();
	};

	if (!user) {
		return <div>Loading user profile...</div>;
	}

	// Ikon-URL:er
	const locationIconUrl = "/globe-solid.svg";
	const websiteIconUrl = "/paperclip-solid.svg";
	const calendarIconUrl = "/calendar-days-solid.svg";

	return (
		<div className="profile-container">
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
					<h1>{user.username}</h1>
					<h2>@{user.handle}</h2>
					<p>{user.bio}</p>
					<div className="profile-extra-info">
						<img src={locationIconUrl} alt="Location" className="icon" />
						<span>{user.location}</span>
						<img src={websiteIconUrl} alt="Website" className="icon" />
						<a href={user.website} target="_blank" rel="noopener noreferrer">
							{user.website}{" "}
						</a>

						<div className="profile-joined">
							<img src={calendarIconUrl} alt="Joined" className="icon" />
							<span>Joined {user.joinedDate}</span>
						</div>
					</div>
					<div className="profile-stats">
						<span>
							<strong>{user.followingCount}</strong> Following
						</span>
						<span>
							<strong>{user.followerCount}</strong> Followers
						</span>
					</div>
				</div>
				<button className="follow-btn">
					{user.isFollowing ? "Unfollow" : "Follow"}
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
							<div className="tweet-user">
								<span className="tweet-username">{user.username}</span>
								<span className="tweet-handle">@{user.handle}</span>
								<span className="tweet-time">
									{getTimeSince(tweet.timestamp)}
								</span>
							</div>
						</div>
						<p className="tweet-content">{tweet.content}</p>
					</div>
				))}
			</div>
		</div>
	);
}

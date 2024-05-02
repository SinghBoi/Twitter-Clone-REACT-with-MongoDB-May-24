import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "./Provider";
import axios from "axios";
import "./Profile.css";

export default function Profile() {
	const { getUserProfile } = useContext(Context);
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [tweets, setTweets] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchUserData() {
			try {
				const response = await getUserProfile(id);
				if (response.data) {
					setUser({
						...response.data,
						coverPhotoUrl: `https://picsum.photos/seed/${response.data.username}/1920/1080`,
						avatarUrl: `https://picsum.photos/seed/${response.data.username}/200`,
					});
					setTweets(response.data.tweets || []);
				} else {
					console.error("User not found");
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchUserData();
	}, [id, getUserProfile]);

	if (loading) {
		return <div>Loading user profile...</div>;
	}

	if (!user) {
		return <div>User not found.</div>;
	}

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
		return daysPast < 7 ? `${daysPast}d` : tweetDate.toLocaleDateString();
	};

	if (loading) {
		return <div>Loading user profile...</div>;
	}

	if (!user) {
		return <div>User not found.</div>;
	}

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
					<h1>@{user.username}</h1>
					<div className="profile-info-about">
						<p>{user.about}</p> {/* Användarens om */}
					</div>
					<div className="profile-extra-info">
						<img src="/briefcase-solid.svg" alt="Work" className="icon" />
						<span>
							<p>{user.employment}</p> {/* Användarens sysselsättning */}
						</span>
						<img src="/globe-solid.svg" alt="Location" className="icon" />
						<span>
							<p>{user.hometown}</p> {/* Användarens hemstad */}
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

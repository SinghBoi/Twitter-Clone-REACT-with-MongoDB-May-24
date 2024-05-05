import { Link } from "react-router-dom";

export default function Search({ searchQuery, handleSearch, searchResult }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      {searchResult && searchResult.users && searchResult.users.length > 0 && (
        <ul>
          {searchResult.users.map((user) => (
            <li key={user.id}>
              <Link to={`/profile/${user.id}`}>
                {user.name} @ {user.username}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {searchResult &&
        searchResult.tweets &&
        searchResult.tweets.length > 0 && (
          <div>
            {searchResult.tweets.map((tweet) => (
              <div key={tweet.id} className="tweet">
                <Link to={`/profile/${tweet.userId}`} className="user-link">
                  <img
                    src={`https://picsum.photos/seed/${tweet.username}/50`}
                    alt={`Profile of ${tweet.username}`}
                  />
                  <span className="username">{tweet.username}</span>
                </Link>
                <div className="tweet-details">
                  <p>{tweet.text}</p>
                  <p className="tweet-date">
                    <img
                      src="/calendar-days-solid.svg"
                      alt="Joined"
                      className="icon"
                    />
                    {new Date(tweet.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

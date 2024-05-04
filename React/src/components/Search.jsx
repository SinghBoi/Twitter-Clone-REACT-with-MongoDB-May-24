import { Link } from "react-router-dom";

export default function Search ({ searchQuery, handleSearch, searchResult }) {
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
    </div>
  );
};

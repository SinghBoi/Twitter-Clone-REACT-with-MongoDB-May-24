import "./Hashtags.css";

const Hashtags = ({ hashtags }) => {
  return (
    <div className="trending-hashtags">
      <h3>Trending Hashtags</h3>
      <ul>
        {hashtags.map((tag, index) => (
          <li key={index}>{tag}</li>
        ))}
      </ul>
    </div>
  );
};

export default Hashtags;

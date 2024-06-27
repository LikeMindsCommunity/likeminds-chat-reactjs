import React, { useEffect, useState } from "react";
import { Gif } from "../../types/models/GifObject";

const GiphySearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = "9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR";

  const fetchGifs = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setGifs(result.data);
    } catch (err) {
      setError("Failed to fetch GIFs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=10`;
    fetchGifs(url);
  };

  useEffect(() => {
    // Fetch trending GIFs initially
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`;
    fetchGifs(url);
  }, []);

  return (
    <div className="lm-giphy-box">
      <div className="lm-giphy-search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for GIFs"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p>{error}</p>}
      <div className="lmGifContainer">
        {gifs.map((gif) => (
          <img
            key={gif.id}
            src={gif.images.fixed_height.url}
            alt={gif.title}
            className="lm-giphy-img"
            onClick={() => console.log(gif)}
          />
        ))}
      </div>
    </div>
  );
};

export default GiphySearch;

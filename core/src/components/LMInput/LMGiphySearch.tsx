import React, { useContext, useEffect } from "react";
import InputContext from "../../context/LMInputContext";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LMGiphySearch: React.FC = () => {
  const {
    gifs,
    gifMedia,
    loadingGifs,
    errorOnGifs,
    gifSearchQuery,
    fetchGifs,
    handleGifSearch,
    gifQuery,
    setGifMedia,
  } = useContext(InputContext);
  const apiKey = "9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR";

  useEffect(() => {
    // Fetch trending GIFs initially
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=100`;
    fetchGifs(url);
  }, []);
  if (gifMedia) {
    return (
      <div className="selected-gif-view-container">
        <div className="remove-selected-gif-icon">
          <IconButton onClick={() => setGifMedia(null)}>
            <CloseIcon />
          </IconButton>
        </div>
        <img src={gifMedia?.images?.fixed_height?.url} alt="gif" />
      </div>
    );
  }
  return (
    <div className="lm-giphy-box">
      <div className="lm-giphy-search">
        <input
          type="text"
          value={gifQuery}
          onChange={(e) => gifSearchQuery(e.target.value)}
          placeholder="Search for GIFs"
        />
        <button onClick={handleGifSearch} disabled={loadingGifs}>
          {loadingGifs ? "Searching..." : "Search"}
        </button>
      </div>
      {errorOnGifs && <p>{errorOnGifs}</p>}
      <div className="lmGifContainer">
        {gifs.map((gif) => (
          <img
            key={gif.id}
            src={gif.images.fixed_height.url}
            alt={gif.title}
            className="lm-giphy-img lm-cursor-pointer"
            onClick={() => {
              console.log(gif);
              setGifMedia(gif);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LMGiphySearch;

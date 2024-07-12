import { Carousel, Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

export const LMReactGiffySearchComponent = () => {
  const gf = new GiphyFetch("95y3zXD0UBxE5tNIHHfqhp09n00yiWOG");

  const searchTerm = "dogs";
  // fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
  // if this function changes, change the Grid key to recreate the grid and start over
  // see the codesandbox for a runnable example
  const fetchGifs = (offset: number) =>
    gf.search(searchTerm, { offset, limit: 10 });
  // React Component

  return (
    <div>
      <Carousel
        gifHeight={200}
        gutter={6}
        fetchGifs={fetchGifs}
        key={searchTerm}
      />
    </div>
  );
};

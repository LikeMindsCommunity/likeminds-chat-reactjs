// import ReactGiphySearchbox from "react-giphy-searchbox";

// export const ReactGiffySearchComponent = () => {
//   return (
//     <div className="gif-search">
//       <ReactGiphySearchbox
//         apiKey="your-api-key"
//         onSelect={(item) => console.log(item)}
//         masonryConfig={[
//           { columns: 2, imageWidth: 110, gutter: 5 },
//           { mq: "700px", columns: 3, imageWidth: 110, gutter: 5 },
//         ]}
//       />
//     </div>
//   );
// };
import { Carousel, Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
// use @giphy/js-fetch-api to fetch gifs
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)

export const ReactGiffySearchComponent = () => {
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
      {/* <Grid
        width={800}
        columns={3}
        gutter={6}
        fetchGifs={fetchGifs}
        key={searchTerm}
      /> */}
      <Carousel
        gifHeight={200}
        gutter={6}
        fetchGifs={fetchGifs}
        key={searchTerm}
      />
    </div>
  );
};

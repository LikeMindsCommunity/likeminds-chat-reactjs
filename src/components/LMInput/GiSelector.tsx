// /* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactGiphySearchbox from "react-giphy-searchbox";
import { Menu } from "@mui/material";

import giffyIcon from "./../../assets/img/giffy.png";
import { useMenu } from "../../hooks/useMenu";

import GiphySearchBox from "react-giphy-searchbox";

const GiSelector = () => {
  const { menuAnchor, openMenu, closeMenu } = useMenu();
  const apiKey = "9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR";
  return (
    <div className="lm-input-giffy">
      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={closeMenu}
      >
        <div className="lm-giphy-container">giphy will load here...</div>

        {/* <GiphySearchBox
          apiKey={apiKey}
          onSelect={(item: any) => console.log("Selected GIF:", item)}
        /> */}

        {/* <ReactGiphySearchbox
          apiKey="9hQZNoy1wtM2b1T4BIx8B0Cwjaje3UUR"
          poweredByGiphy={false}
          searchPlaceholder="Search GIPHY"
          searchFormClassName="gifSearchBox"
          masonryConfig={[
            { columns: 2, imageWidth: 140, gutter: 10 },
            { mq: "600px", columns: 4, imageWidth: 200, gutter: 3 },
            // { mq: "1000px", columns: 4, imageWidth: 220, gutter: 10 },
          ]}
        /> */}
      </Menu>
      <img src={giffyIcon} alt="giffy" onClick={openMenu} />
    </div>
  );
};

export default GiSelector;

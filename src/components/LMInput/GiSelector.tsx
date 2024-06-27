import React from "react";
import { Menu } from "@mui/material";
import giffyIcon from "../../assets/img/giffy.png";
import { useMenu } from "../../hooks/useMenu";
import GiphySearch from "./GiphySearch";

const GiSelector: React.FC = () => {
  const { menuAnchor, openMenu, closeMenu } = useMenu();

  return (
    <div className="lm-input-giffy">
      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={closeMenu}
        classes={{ paper: "fullscreen-menu" }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <div className="lm-giphy-container">
          <GiphySearch />
        </div>
      </Menu>
      <img src={giffyIcon} alt="giffy" onClick={openMenu} />
    </div>
  );
};

export default GiSelector;

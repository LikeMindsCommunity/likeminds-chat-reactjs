import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface LoaderProps {
  show: boolean;
}

const LmLoader: React.FC<LoaderProps> = ({ show }) => {
  return (
    <>
      {show && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress color="primary" />
        </div>
      )}
    </>
  );
};

export default LmLoader;

import React from "react";

interface LoaderContextProviderInterface {
  loader: boolean;
  setLoader: (() => void) | null;
}

export default React.createContext<LoaderContextProviderInterface>({
  loader: false,
  setLoader: null,
});

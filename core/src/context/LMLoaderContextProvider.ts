import React from "react";

interface LoaderContextProviderInterface {
  loader: boolean;
  setLoader: ((val: boolean) => void) | null;
  openSnackbar: ((message: string) => void) | null;
}

export default React.createContext<LoaderContextProviderInterface>({
  loader: false,
  setLoader: null,
  openSnackbar: null,
});

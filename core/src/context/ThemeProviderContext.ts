import React from "react";
import { Theme } from "../types/theme/Theme";
interface ThemeProviderContextInterface {
  themeObject: Theme | null;
}
export default React.createContext<ThemeProviderContextInterface>({
  themeObject: null,
});

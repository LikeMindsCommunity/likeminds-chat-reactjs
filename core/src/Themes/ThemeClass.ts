import { ThemePellete, ThemeTextSizes } from "../types/theme/Theme";
import { Theme as ThemeObject } from "../types/theme/Theme";
export class Theme {
  private defaultThemeTextSizes: ThemeTextSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 20,
  };
  private defaultThemePellete: ThemePellete = {
    primary: "#333333",
    secondary: "#666666",
    error: "#00FFFF",
    success: "#66bb6a",
    warning: "#ffa726",
    info: "#29b6f6",
  };
  private defaultFontFamily: string = "Roboto";
  public theme: ThemeObject;
  private defaultMode: string = "light";
  constructor(theme?: ThemeObject) {
    this.theme = {
      pellete: this.defaultThemePellete,
      typography: {
        fontFamily: this.defaultFontFamily,
        fontSizes: this.defaultThemeTextSizes,
      },
      mode: this.defaultMode,
    };
    if (theme) {
      this.theme = { ...this.theme, ...theme };
    }
    return;
  }
}

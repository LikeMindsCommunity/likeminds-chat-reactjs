export interface Theme {
  pellete?: ThemePellete;
  typography?: ThemeTypography;
  mode?: string;
}

export interface ThemeTypography {
  fontFamily?: string;
  fontSizes?: ThemeTextSizes;
}

export interface ThemePellete {
  primary?: string;
  secondary?: string;
  error?: string;
  warning?: string;
  info?: string;
  success?: string;
}

export interface ThemeTextSizes {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

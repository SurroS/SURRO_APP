import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";
import colors from "./hooks/colors";

const appTokens = {
  color: {
    // Core brand colors
    primary: colors.primary,
    secondary: colors.secondry,
    background: colors.background,
    text: colors.text,

    // Status colors
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,

    // Extended palette
    gray: colors.gray,
    white: colors.white,
    black: colors.black,

    // Specific UI colors
    actionNavyBlue: colors.ACTION_NAVY_BLUE,
    headerIconGray: colors.HEADER_ICON_GRAY,
    primaryDark: colors.primaryDark,
    balanceText: colors.balanceText,
    headerText: colors.headerText,
    secondaryGray: colors.secondaryGray,
    lightGrayBg: colors.lightGrayBg,
    border: colors.border,
    inputBorder: colors.inputBorder,
    placeholderText: colors.placeholderText,
    buttonBlue: colors.buttonBlue,
    successGreen: colors.SUCCESS_GREEN,
    debitRed: colors.DEBIT_RED,
    creditGreen: colors.CREDIT_GREEN,
  },
};

const appThemes = {
  light: {
    // Base theme colors
    background: colors.background,
    color: colors.text,

    // Brand colors
    primary: colors.primary,
    secondary: colors.secondry,

    // Status colors
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,

    // Extended colors
    gray: colors.gray,
    white: colors.white,
    black: colors.black,

    // UI specific
    border: colors.border,
    placeholder: colors.placeholderText,
    surface: colors.white,
  },
  dark: {
    // Base theme colors
    background: colors.primary,
    color: colors.white,

    // Brand colors
    primary: colors.secondry,
    secondary: "#B3B3FF",

    // Status colors (keep same for accessibility)
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,

    // Extended colors
    gray: "#CCCCCC",
    white: colors.white,
    black: colors.black,

    // UI specific
    border: "#444444",
    placeholder: "#888888",
    surface: "#1A1A1A",
  },
};

const config = createTamagui({
  tokens: {
    ...tokens,
    ...appTokens,
  },
  themes: {
    ...themes,
    ...appThemes,
  },
});

export type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;

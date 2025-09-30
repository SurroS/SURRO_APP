import { Dimensions } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Adjustable constants
export const CARD_WIDTH_DEFAULT = SCREEN_WIDTH * 0.85; // 85% of screen width
export const CARD_HEIGHT_DEFAULT = SCREEN_HEIGHT * 0.45; // 45% of screen height
export const CARD_SPACING = SCREEN_WIDTH * 0.06; // spacing between cards
export const TEXT_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
export const BUTTON_WIDTH = SCREEN_WIDTH * 0.9;
export const BUTTON_HEIGHT = SCREEN_HEIGHT * 0.07;
export const IMG_HEIGHT = SCREEN_HEIGHT * 0.3;

import type { Graha } from "../engine";

/** Text-style zodiac and planet symbols. U+FE0E asks for the plain symbol, not a colour emoji. */
const T = "︎";
export const SIGN_GLYPH = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((g) => g + T);
export const PLANET_GLYPH: Record<Graha, string> = {
  Sun: "☉",
  Moon: "☽",
  Mars: "♂" + T,
  Mercury: "☿",
  Jupiter: "♃",
  Venus: "♀" + T,
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
};

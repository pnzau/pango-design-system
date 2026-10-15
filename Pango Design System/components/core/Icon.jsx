import React from 'react';

/* Pango's icon set is inline 24x24 stroke SVG — no icon font, no library.
   Strokes are 1.7 (nav) to 2.4 (chevrons), always round-capped, currentColor.
   The paths below are lifted verbatim from the app. */
const PATHS = {
  properties: "<rect x=\"4\" y=\"3\" width=\"10\" height=\"18\" rx=\"1\"/><path d=\"M14 8h6v13h-6\"/><path d=\"M7 7h2M7 11h2M7 15h2\"/>",
  invoice: "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"1.5\"/><path d=\"M9 8h6M9 12h6M9 16h4\"/>",
  repairs: "<path d=\"M7 3h10a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Z\"/><path d=\"M9 8h6M9 12h4\"/>",
  vacancies: "<path d=\"M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7\"/><path d=\"M16 6l-4-3-4 3\"/><path d=\"M12 3v13\"/>",
  verify: "<rect x=\"3\" y=\"6\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M3 10h18\"/><path d=\"m8 15 2 2 4-4\"/>",
  sparkle: "<path d=\"M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4\"/><circle cx=\"12\" cy=\"12\" r=\"3.4\"/>",
  managers: "<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5\"/><path d=\"M16 4a3 3 0 0 1 0 6\"/><path d=\"M18 15c2.4.5 4 2 4 5\"/>",
  logout: "<path d=\"M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3\"/><path d=\"M10 12h9\"/><path d=\"m14 8-4 4 4 4\"/>",
  menu: "<path d=\"M4 6h16M4 12h16M4 18h16\"/>",
  search: "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.2-3.2\"/>",
  chevronDown: "<path d=\"m6 9 6 6 6-6\"/>",
  chevronLeft: "<path d=\"m14 6-6 6 6 6\"/>",
  chevronRight: "<path d=\"m10 6 6 6-6 6\"/>",
  pin: "<path d=\"M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z\"/><circle cx=\"12\" cy=\"10\" r=\"2.3\"/>",
  wrench: "<path d=\"M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.3-.6-.6-2.3z\"/>",
  clock: "<path d=\"M12 8v4l3 2\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>",
  check: "<path d=\"m5 12 5 5 9-11\"/>",
  download: "<path d=\"M12 3v12M8 11l4 4 4-4\"/><path d=\"M4 17v3h16v-3\"/>",
  phone: "<path d=\"M4 5c0 8 7 15 15 15l0-3.5-4-1.5-2 2c-3-1.5-6-4.5-7.5-7.5l2-2L6 4.5 4 5Z\"/>",
  edit: "<path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z\"/>",
  whatsapp: "<path d=\"M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.6-.1 1Z\"/>",
  instagram: "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"1\"/>"
};

const FILLED = ["whatsapp"];

export function Icon({ name, size = 18, strokeWidth = 1.7, color = 'currentColor', style }) {
  const d = PATHS[name];
  if (!d) return null;
  const isFilled = FILLED.indexOf(name) !== -1;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={isFilled ? color : 'none'}
      stroke={isFilled ? 'none' : color}
      strokeWidth={isFilled ? undefined : strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...style }}
      dangerouslySetInnerHTML={{ __html: d }} />
  );
}

export const iconNames = Object.keys(PATHS);

/* Capitalized holder so the list is reachable from plain HTML. */
export const IconNames = iconNames;

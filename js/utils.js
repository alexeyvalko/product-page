import { OPTIONS } from "./options.js";

export const changeColorText = (color) => {
  const colorElement = document.querySelector(OPTIONS.selectors.selectedColor);
  if (typeof color === 'string') colorElement.textContent = color;
};

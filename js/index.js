import { createAccordions } from './Accordion.js';
import Quantity from './Quantity.js';
import { OPTIONS } from './options.js';
import { changeColorHandler, submitFormHandler } from './utils.js';
import MobileMenu from './MobileMenu.js';

window.addEventListener('DOMContentLoaded', () => {
  createAccordions({
    ...OPTIONS.accordion,
  });
  new Quantity({
    ...OPTIONS.quantity,
  });
  new MobileMenu({ ...OPTIONS.mobileMenu });
  submitFormHandler(OPTIONS.selectors.form);
  changeColorHandler(OPTIONS.selectors.form);
});

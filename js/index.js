import { createAccordions } from './Accordion.js';
import Quantity from './Quantity.js';
import { OPTIONS } from './options.js';
import { changeColorHandler, modalClickFormHandler } from './utils.js';

window.addEventListener('DOMContentLoaded', () => {
  createAccordions({
    ...OPTIONS.accordion,
  });
  new Quantity({
    ...OPTIONS.quantity,
  });
  modalClickFormHandler(OPTIONS.selectors.form);
  changeColorHandler(OPTIONS.selectors.form)
});

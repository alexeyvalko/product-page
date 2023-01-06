import { createAccordions } from "./Accordion.js";
import Quantity from "./Quantity.js";

const DETAILS_SELECTOR = '.collapse';
const CONTENT_SELECTOR = '.collapse__content';

const INCREASE_SELECTOR = '#increase_button';
const DECREASE_SELECTOR = '#decrease_button';
const QUANTITY_INPUT_SELECTOR = '#quantity';


window.addEventListener('DOMContentLoaded', () => {
  createAccordions({
    detailsSelector: DETAILS_SELECTOR,
    contentSelector: CONTENT_SELECTOR,
  });
  new Quantity(
    INCREASE_SELECTOR,
    DECREASE_SELECTOR,
    QUANTITY_INPUT_SELECTOR,
  )
});




import { createAccordions } from './Accordion.js';
import Quantity from './Quantity.js';
import { OPTIONS } from './options.js';
import { changeColorText } from './utils.js';

window.addEventListener('DOMContentLoaded', () => {
  createAccordions({
    ...OPTIONS.accordion,
  });
  new Quantity({
    ...OPTIONS.quantity,
  });
  const form = document.querySelector(OPTIONS.selectors.form)
  form.addEventListener('change', (e)=>{
    if(e.target.name === OPTIONS.inputNames.color) changeColorText(e.target.value)
  })
});

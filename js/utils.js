import { OPTIONS } from "./options.js";
import Modal from './Modal.js'

const generateModal = (content, classes) => {
  const modal = new Modal(classes);
  modal.buildModal(content);
  modal.openModal();
};

const changeColorText = (color) => {
  const colorElement = document.querySelector(OPTIONS.selectors.selectedColor);
  if (typeof color === 'string') colorElement.textContent = color;
};

const changeCartItems = (value) => {
  const cartElement = document.querySelector('#cart_items');
  cartElement.textContent = Number(cartElement.textContent) + Number(value);
}


export const submitFormHandler = (form_selector) => {
  document.querySelector(form_selector).addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObject = Object.fromEntries(formData.entries());
    changeCartItems(formDataObject.quantity);
    generateModal(
      `<p style="text-align: center; font-size: 2rem">Items (+${formDataObject.quantity}) successfully added to the cart<p>`,
      'form_modal'
    );
  });
};


export const changeColorHandler = (form_selector) => {
  const form = document.querySelector(form_selector)
  form.addEventListener('change', (e)=>{
    if(e.target.name === OPTIONS.inputNames.color) changeColorText(e.target.value)
  })
}

/** Class representing Quantity. */

export default class Quantity {
  /**
   * Create Quantity.
   * @this Quantity class representing an Accordion
   * @param {string} increaseSelector - increase button selector.
   * @param {string} decreaseSelector - decrease button selector.
   * @param {string} inputSelector - input selector.
   * @param {number} min - min input value.
   * @param {number} max - max input value.
   */
  constructor({
    increaseSelector,
    decreaseSelector,
    inputSelector,
    min = 1,
    max = Infinity,
  }) {
    this.increaseElement = document.querySelector(increaseSelector);
    this.decreaseElement = document.querySelector(decreaseSelector);
    this.inputElement = document.querySelector(inputSelector);

    this.minValue = min;
    this.maxValue = max;
    this.value = Number(this.inputElement.value) || this.minValue;

    this._init()
  }

  /**
   * Increase value.
   */
  increase() {
    this.value = this._clamp(++this.value);
    this._updateInputValue();
  }

  /**
   * Decrease value.
   */
  decrease() {
    this.value = this._clamp(--this.value);
    this._updateInputValue();
  }

  /**
   * Change input value.
   */
  change() {
    this.value = this._clamp(Number(this.inputElement.value));
    this._updateInputValue();
  }

  /**
   * Destroy quantity.
   */
  destroy() {
    this.increaseElement.removeAttribute('min');
    this.increaseElement.removeAttribute('max');
    this.increaseElement.removeEventListener('click', this.handleIncrease);
    this.decreaseElement.removeEventListener('click', this.handleDecrease);
    this.inputElement.removeEventListener('change', this.handleChange);
  }

  /**
   * update input element value
   */
  _updateInputValue(value) {
    this.inputElement.value = value || this.value;
  }

  /**
   * Check and get number within range.
   */
  _clamp(number) {
    return Math.min(Math.max(number, this.minValue), this.maxValue);
  }

  /**
   * Add event listeners to elements.
   */
  _addEventListeners() {
    this.increaseElement.addEventListener('click', this.handleIncrease);
    this.decreaseElement.addEventListener('click', this.handleDecrease);
    this.inputElement.addEventListener('change', this.handleChange);
  }
  
  _init(){
    if (this.minValue !== -Infinity) this.inputElement.min = this.minValue;
    if (this.maxValue !== Infinity) this.inputElement.max = this.maxValue;
    this.handleIncrease = this.increase.bind(this);
    this.handleDecrease = this.decrease.bind(this);
    this.handleChange = this.change.bind(this);

    this._addEventListeners();
  }
}

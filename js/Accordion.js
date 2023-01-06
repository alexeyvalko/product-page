/** Class representing an Accordion. */
class Accordion {
  #animation = null;
  #clickHandler = (event) => this.#onClick(event);

  /**
   * Create an accordion.
   * @this Accordion class representing an Accordion
   * @param {HTMLDetailsElement} details - Details element.
   * @param {HTMLElement} content - Content element.
   * @param {string} id - Accordion id.
   * @param {KeyframeAnimationOptions} keyframeOptions - Web Animations API keyframe options object.
   */
  constructor(details, content, id, keyframeOptions) {
    this.id = id;
    this.keyframeOptions = keyframeOptions;
    this.details = details;
    this.content = content;
    this.isCloseAnimation = false;
    this.isOpenAnimation = false;

    this.summary = this.details.querySelector('summary');
    if (this.summary) this.init();
  }

  /**
   * Handle click
   * @param {MouseEvent} e - Click event.
   */
  #onClick(event) {
    event.preventDefault();
    if (this.isCloseAnimation || !this.details.open) {
      this.open();
    } else if (this.isOpenAnimation || this.details.open) {
      this.close();
    }
  }

  /**
   * Create collapse animation
   * @param {string} startHeight - Start height in px.
   * @param {string} endHeight - End height in px.
   * @param {boolean} isOpening - Indicates type of animation (open or close).
   */
  #collapseAnimation(startHeight, endHeight, isOpening = true) {
    if (this.#animation) {
      this.#animation.cancel();
    }

    if (isOpening) {
      this.isOpenAnimation = true;
    } else {
      this.isCloseAnimation = true;
    }

    const keyFrames = {
      height: [startHeight, endHeight],
      overflow: ['hidden', 'hidden'],
    };

    this.#animation = this.details.animate(keyFrames, this.keyframeOptions);
    this.#animation.onfinish = () => {
      this.details.style.height = '';
      this.details.open = isOpening;
      this.#updateARIA();
      this.#animation = null;
      this.isCloseAnimation = false;
      this.isOpenAnimation = false;
    };
    this.#animation.oncancel = () => {
      if (isOpening) {
        this.isOpenAnimation = false;
      } else {
        this.isCloseAnimation = false;
      }
    };
  }

  /**
   * Create element ids
   */
  #createIDs() {
    this.details.setAttribute('id', `${this.id}-details`);
    this.summary.setAttribute('id', `${this.id}-summary`);
    this.content.setAttribute('id', `${this.id}-content`);
  }

  /**
   * Remove element ids
   */
  #removeIDs() {
    this.details.removeAttribute('id');
    this.summary.removeAttribute('id');
    this.content.removeAttribute('id');
  }

  /**
   * Update ARIA attributes
   */
  #updateARIA() {
    this.summary.setAttribute('aria-expanded', this.details.open);
  }

  /**
   * Add ARIA attributes and roles
   */
  #addARIAandRoles() {
    this.summary.setAttribute('role', 'button');
    this.summary.setAttribute('aria-expanded', this.details.open);
    this.summary.setAttribute('aria-controls', this.content.id);
    this.content.setAttribute('role', `region`);
    this.content.setAttribute('aria-labelledby', this.summary.id);
  }

  /**
   * Remove ARIA attributes and roles
   */
  #removeARIAandRoles() {
    this.summary.removeAttribute('role');
    this.summary.removeAttribute('aria-expanded');
    this.summary.removeAttribute('aria-controls');
    this.content.removeAttribute('role');
    this.content.removeAttribute('aria-labelledby');
  }

  /**
   * Close accordion
   */
  close() {
    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;
    this.#collapseAnimation(startHeight, endHeight, false);
  }

  /**
   * Open accordion
   */
  open() {
    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight
      }px`;
    this.details.style.height = startHeight;
    this.details.open = true;
    this.#collapseAnimation(startHeight, endHeight, true);
  }

  /**
   * Initiate accordion
   */
  init() {
    this.summary.addEventListener('click', this.#clickHandler);
    this.#createIDs();
    this.#addARIAandRoles();
  }

  /**
   * Destroy accordion
   */
  destroy() {
    this.summary.removeEventListener('click', this.#clickHandler);
    this.#removeARIAandRoles();
    this.#removeIDs();
  }
}

/**
 * Create unique id.
 * @param {string} idPrefix - prefix for id
 * @param {number} [index] - unique number
 * @returns {string} unique id
 */
const generateUniqueId = (idPrefix, index = 1) => {
  return `${idPrefix}-${index}`;
};

/**
 * Create accordions.
 * @param {Object} options - config options
 * @param {string} options.detailsSelector - The name of the "details" selector.
 * @param {string} options.contentSelector - The name of the "content" selector.
 * @param {number|string} [options.idPrefix] - The id prefix for accordion.
 * @param {KeyframeAnimationOptions} [options.keyframeOptions] - Web Animations API keyframe options object
 * @returns {(Accordion | undefined)[]} array of created Accordions
 */
export const createAccordions = ({
  detailsSelector = 'details',
  contentSelector = '.content',
  idPrefix = 'accordion',
  keyframeOptions = { duration: 200, easing: 'linear' },
}) => {
  const detailsArray = Array.from(document.querySelectorAll(detailsSelector));
  if (!detailsArray.length) return [];
  return detailsArray
    .map((details, index) => {
      const content = details.querySelector(contentSelector);
      if (!content) return null;
      const id = generateUniqueId(idPrefix, index + 1);
      return new Accordion(details, content, id, keyframeOptions);
    })
    .filter((accordion) => Boolean(accordion));
};
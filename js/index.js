const DETAILS_SELECTOR = '.collapse';
const CONTENT_SELECTOR = '.collapse__content';

class Accordion {
  #animation = null;
  #clickHandler = (e) => this.#onClick(e);

  /**
   * Create an accordion.
   * @this Accordion
   * @param {HTMLDetailsElement} details - Details element.
   * @param {HTMLElement} content - Content element.
   * @param {number} duration - The duration of animation in ms.
   * @param {string} easing - The rate of the animation's change over time.
   */
  constructor(details, content, duration, easing) {
    this.easing = easing;
    this.duration = duration;
    this.details = details;
    this.content = content;
    this.isCloseAnimation = false;
    this.isOpenAnimation = false;
    this.summary = this.details.querySelector('summary');
    if (!this.summary) throw new Error(`Error: didn't find summary.`);

    this.attach();
  }

  /**
   * Handle click
   * @param {MouseEvent} e - Click event.
   */
  #onClick(e) {
    e.preventDefault();
    if (this.isCloseAnimation || !this.details.open) {
      this.open();
    } else if (this.isOpenAnimation || this.details.open) {
      this.close();
    }
  }

  /**
   * Create animation
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

    const options = {
      duration: this.duration,
      easing: this.easing,
    };
    this.#animation = this.details.animate(keyFrames, options);
    this.#animation.onfinish = () => {
      this.details.style.height = '';
      this.details.open = isOpening;
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
    this.details.style.height = `${this.details.offsetHeight}px`;
    this.details.open = true;
    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight
    }px`;
    this.#collapseAnimation(startHeight, endHeight, true);
  }

  /**
   * Attach accordion to the element
   */
  attach() {
    this.summary.addEventListener('click', this.#clickHandler);
  }

  /**
   * Detach accordion from element
   */
  detach() {
    this.summary.removeEventListener('click', this.#clickHandler);
  }
}

const generateMultipleAccordions = (
  detailsSelector,
  contentSelector,
  duration,
  easing
) => {
  const detailsArray = Array.from(document.querySelectorAll(detailsSelector));
  if (!detailsArray.length)
    throw new Error(`Error: didn't find any "details" tag.`);
  return detailsArray
    .map((details) => {
      const content = details.querySelector(contentSelector);
      if (content) return new Accordion(details, content, duration, easing);
    })
    .filter((accordion) => !!accordion);
};

const generateOneAccordion = (
  detailsSelector,
  contentSelector,
  duration,
  easing
) => {
  const detailsElement = document.querySelector(detailsSelector);
  if (!detailsElement) throw new Error(`Error: didn't find "details" tag.`);
  const content = detailsElement.querySelector(contentSelector);
  if (!content) throw new Error(`Error: didn't find content tag.`);
  return new Accordion(detailsElement, content, duration, easing);
};

/**
 * Create accordions.
 * @param {Object} options - available options
 * @param {string} options.detailsSelector - The name of the "details" selector. Default "details".
 * @param {string} options.contentSelector - The name of the "content" selector. Default ".content".
 * @param {string} options.easing - The rate of the animation's change over time. Defaults to "linear".
 * @param {number} options.duration - The duration of animation in ms. Default 200.
 * @param {boolean} options.createMultiple - create multiple accordions or only one.
 */
const createAccordion = ({
  duration = 200,
  easing = 'linear',
  detailsSelector = 'details',
  contentSelector = '.content',
  createMultiple = true,
}) => {
  if (createMultiple) {
    return generateMultipleAccordions(
      detailsSelector,
      contentSelector,
      duration,
      easing
    );
  } else {
    return generateOneAccordion(
      detailsSelector,
      contentSelector,
      duration,
      easing
    );
  }
};

createAccordion({
  detailsSelector: DETAILS_SELECTOR,
  contentSelector: CONTENT_SELECTOR,
  createMultiple: true,
});

const DETAILS_SELECTOR = '.collapse';
const CONTENT_SELECTOR = '.collapse__content';

class Accordion {
  #animation = null;
  #clickHandler = (e) => this.#onClick(e);

  /**
   * Create an accordion.
   * @this Accordion
   * @param {HTMLDetailsElement} details - details element.
   * @param {HTMLElement} content - content element.
   * @param {number} duration - the duration of animation in ms.
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
   * @param {MouseEvent} e - click event.
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
   * @param {string} startHeight - start height in px.
   * @param {string} endHeight - end height in px.
   * @param {boolean} isOpening - indicates type of animation (open or close).
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
    };
    const options = {
      duration: this.duration,
      easing: this.easing,
    };
    this.#animation = this.details.animate(keyFrames, options);
    this.#animation.onfinish = () => {
      this.details.style.height = 'auto';
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
  if (!detailsArray.length) throw new Error(`Error: didn't find any details.`);
  return detailsArray.map((details) => {
    const content = details.querySelector(contentSelector);
    if (content) return new Accordion(details, content, duration, easing);
  });
};

const generateOneAccordion = (
  detailsSelector,
  contentSelector,
  duration,
  easing
) => {
  const detailsElement = document.querySelector(detailsSelector);
  if (!detailsElement) throw new Error(`Error: didn't find details tag.`);
  const content = detailsElement.querySelector(contentSelector);
  if (!content) throw new Error(`Error: didn't find content tag.`);
  return new Accordion(detailsElement, content, duration, easing);
};

/**
 * Create accordions.
 * @param {Object} options - available options
 * @param {string} options.detailsSelector - The name of the "details" selector
 * @param {string} options.contentSelector - The name of the "content" selector.
 * @param {string} options.easing - The rate of the animation's change over time. Defaults to "linear"
 * @param {number} options.duration - The duration of animation in ms.
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
  duration: 300,
  easing: 'cubic-bezier(0.24, 0.22, 0.015, 1.56)',
  detailsSelector: DETAILS_SELECTOR,
  contentSelector: CONTENT_SELECTOR,
  createMultiple: true,
});

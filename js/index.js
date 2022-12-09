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
   */
  constructor(details, content) {
    this.details = details;
    this.content = content;
    this.isCloseAnimation = false;
    this.isOpenAnimation = false;
    this.summary = this.details.querySelector('summary');
    if (!this.summary) throw new Error(`Error: didn't find summary.`);
    this.summary.addEventListener('click', this.#clickHandler);
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
      duration: 200,
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
   * Destroy instance
   */
  destroy() {
    this.summary.removeEventListener('click', this.#clickHandler);
    this.content = null;
    this.details = null;
    this.summary = null;
  }
}

const generateMultipleAccordions = (detailsSelector, contentSelector) => {
  const detailsArray = Array.from(document.querySelectorAll(detailsSelector));
  if (!detailsArray.length) throw new Error(`Error: didn't find any details.`);
  return detailsArray.map((details) => {
    const content = details.querySelector(contentSelector);
    if (content) return new Accordion(details, content);
  });
};

const generateOneAccordion = (detailsSelector, contentSelector) => {
  const detailsElement = document.querySelector(detailsSelector);
  if (!detailsElement) throw new Error(`Error: didn't find details tag.`);
  const content = detailsElement.querySelector(contentSelector);
  if (!content) throw new Error(`Error: didn't find content tag.`);
  return new Accordion(detailsElement, content);
};

/**
 * Create accordions.
 * @param {Object} options - available options
 * @param {string} options.detailsSelector - The name of the "details" selector
 * @param {string} options.contentSelector - The name of the "content" selector.
 * @param {boolean} options.createMultiple - create multiple accordions or only one.
 */
const createAccordion = ({
  detailsSelector = 'details',
  contentSelector = '.content',
  createMultiple = true,
}) => {
  if (createMultiple) {
    return generateMultipleAccordions(detailsSelector, contentSelector);
  } else {
    return generateOneAccordion(detailsSelector, contentSelector);
  }
};

createAccordion({
  detailsSelector: DETAILS_SELECTOR,
  contentSelector: CONTENT_SELECTOR,
  createMultiple: true,
});



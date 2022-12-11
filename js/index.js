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
   * @param {string} id - Accordion id.
   */
  constructor(details, content, duration, easing, id) {
    this.id = id;
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

    const options = {
      duration: this.duration,
      easing: this.easing,
    };
    this.#animation = this.details.animate(keyFrames, options);
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

  #createIDs() {
    this.details.setAttribute('id', `${this.id}-details`);
    this.summary.setAttribute('id', `${this.id}-summary`);
    this.content.setAttribute('id', `${this.id}-content`);
  }

  #removeIDs() {
    this.details.removeAttribute('id');
    this.summary.removeAttribute('id');
    this.content.removeAttribute('id');
  }

  #updateARIA() {
    this.summary.setAttribute('aria-expanded', this.details.open);
  }

  #addARIAandRole() {
    this.summary.setAttribute('role', 'button');
    this.summary.setAttribute('aria-expanded', this.details.open);
    this.summary.setAttribute('aria-controls', this.content.id);
    this.content.setAttribute('role', `region`);
    this.content.setAttribute('aria-labelledby', this.summary.id);
  }

  #removeARIAandRole() {
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
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight
    }px`;
    this.details.style.height = startHeight;
    this.details.open = true;
    this.#collapseAnimation(startHeight, endHeight, true);
  }

  /**
   * Attach accordion to the element
   */
  attach() {
    this.summary.addEventListener('click', this.#clickHandler);
    this.#createIDs();
    this.#addARIAandRole();
  }

  /**
   * Detach accordion
   */
  detach() {
    this.summary.removeEventListener('click', this.#clickHandler);
    this.#removeARIAandRole();
    this.#removeIDs();
  }
}

const generateUniqueId = (idPrefix, index = 1) => {
  return `${idPrefix}-${index}`;
};

const generateMultipleAccordions = (
  detailsSelector,
  contentSelector,
  duration,
  easing,
  idPrefix
) => {
  const detailsArray = Array.from(document.querySelectorAll(detailsSelector));
  if (!detailsArray.length)
    throw new Error(`Error: didn't find any "details" tag.`);
  return detailsArray
    .map((details, index) => {
      const content = details.querySelector(contentSelector);
      if (content) {
        const id = generateUniqueId(idPrefix, index + 1);
        return new Accordion(
          details,
          content,
          duration,
          easing,
          id
        );
      }
    })
    .filter((accordion) => !!accordion);
};

const generateOneAccordion = (
  detailsSelector,
  contentSelector,
  duration,
  easing,
  idPrefix
) => {
  const details = document.querySelector(detailsSelector);
  if (!details) throw new Error(`Error: didn't find "details" tag.`);
  const content = detailsElement.querySelector(contentSelector);
  if (!content) throw new Error(`Error: didn't find content tag.`);
  const id = generateUniqueId(idPrefix);
  return new Accordion(
    details,
    content,
    duration,
    easing,
    id
  );
};

/**
 * Create accordions.
 * @param {Object} options - config options
 * @param {string} options.detailsSelector - The name of the "details" selector.
 * @param {string} options.contentSelector - The name of the "content" selector.
 * @param {string} [options.easing] - The rate of the animation's change over time.
 * @param {number} [options.duration] - The duration of animation in ms. Default 200.
 * @param {number|string} [options.idPrefix] - The id prefix for accordion.
 * @param {boolean} [options.createMultiple] - create multiple accordions or only one.
 */
const createAccordion = ({
  duration = 200,
  easing = 'linear',
  detailsSelector = 'details',
  contentSelector = '.content',
  createMultiple = true,
  idPrefix = 'accordion',
}) => {
  if (createMultiple) {
    return generateMultipleAccordions(
      detailsSelector,
      contentSelector,
      duration,
      easing,
      idPrefix
    );
  } else {
    return generateOneAccordion(
      detailsSelector,
      contentSelector,
      duration,
      easing,
      idPrefix
    );
  }
};

createAccordion({
  detailsSelector: DETAILS_SELECTOR,
  contentSelector: CONTENT_SELECTOR,
  createMultiple: true,
});

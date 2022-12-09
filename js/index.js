const DETAILS_SELECTOR = '.collapse';
const CONTENT_SELECTOR = '.collapse__content';

class Accordion {
  constructor(details, content) {
    this.details = details;
    this.content = content;
    this.animation = null;
    this.isCloseAnimation = false;
    this.isOpenAnimation = false;
    this.summary = this.details.querySelector('summary');
    if (!this.summary) throw new Error(`Error: didn't find summary.`);

    this.summary.addEventListener('click', (e) => this.#onClick(e));
  }

  #onClick(e) {
    e.preventDefault();
    if (this.isCloseAnimation || !this.details.open) {
      this.open();
    } else if (this.isOpenAnimation || this.details.open) {
      this.close();
    }
  }

  #collapseAnimation(startHeight, endHeight, isOpening = true) {
    if (this.animation) {
      this.animation.cancel();
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
    this.animation = this.details.animate(keyFrames, options);
    this.animation.onfinish = () => {
      this.details.style.height = 'auto';
      this.details.open = isOpening;
      this.animation = null;
      this.isCloseAnimation = false;
      this.isOpenAnimation = false;
    };
    this.animation.oncancel = () => {
      if (isOpening) {
        this.isOpenAnimation = false;
      } else {
        this.isCloseAnimation = false;
      }
    };
  }

  close() {
    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;
    this.#collapseAnimation(startHeight, endHeight, false);
  }

  open() {
    this.details.style.height = `${this.details.offsetHeight}px`;
    this.details.open = true;
    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight
    }px`;
    this.#collapseAnimation(startHeight, endHeight, true);
  }
}

const createAccordions = (
  detailsSelector = 'details',
  contentSelector = '.content'
) => {
  const detailsArray = [...document.querySelectorAll(detailsSelector)];
  if (!detailsArray.length) throw new Error(`Error: didn't find any details.`);
  return detailsArray.map((details) => {
    const content = details.querySelector(contentSelector);
    if (content) return new Accordion(details, content);
  });
};

createAccordions(DETAILS_SELECTOR, CONTENT_SELECTOR);
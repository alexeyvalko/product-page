export default class MobileMenu {
  constructor({
    overlaySelector, menuSelector, humbuggerSelector
  }) {
    this.overlay = document.querySelector(overlaySelector);
    this.menu = document.querySelector(menuSelector);
    this.hamburger = document.querySelector(humbuggerSelector);

    hamburger.onclick = () => {
      this.handleClickHamburger();
    };
  }

  handleClickHamburger() {
    this.hamburger.classList.toggle('crest');
    this.handleClickOverlay();
    this.overlay.onclick = this.handleClickOverlay.bind(this);
  }

  handleClickOverlay(event) {
    const classes = [...this.overlay.classList];
    if (classes.includes('is-open')) {
      setTimeout(() => {
        this.hamburger.classList.toggle('crest');
        this.overlay.classList.toggle('is-open');
      }, 200);
      this.handleClickMenu();
    } else {
      setTimeout(() => {
        this.handleClickMenu();
      }, 10);

      this.overlay.classList.toggle('is-open');
    }
  }

  handleClickMenu = () => {
    this.menu.classList.toggle('menu-hidden');
  };
}

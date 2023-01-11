export default class Modal {
  constructor(...classes) {
    this.classes = classes;
    this.modal = null;
    this.modalContent = null;
    this.modalCloseBtn = null;
    this.modalImage = null;
  }

  buildModal(strategyData) {
    this.modalImage = this.createHtmlNode('img', 'modal__image');
    this.overlay = this.createHtmlNode('div', 'overlay');
    this.modal = this.createHtmlNode('div', 'modal', ...this.classes);
    this.modalContent = this.createHtmlNode('div', 'modal_content');
    this.modalCloseBtn = this.createHtmlNode(
      'span',
      'icon',
      'icon_close',
      'close_modal',
    );
    this.setContent(strategyData);
    this.appendElements();
    this.closeModalHandler();
  }

  createHtmlNode(element, ...classes) {
    const node = document.createElement(element);
    node.classList.add(...classes);
    return node;
  }

  setContent(strategyData) {
    if (typeof strategyData === 'string') {
      this.modalContent.innerHTML = strategyData;
    } else {
      this.modalContent.innerHTML = strategyData.content;
      this.modalImage.src = strategyData.img_url;
      this.modalImage.alt = strategyData.title;
    }
  }

  appendElements() {;
    if(this.modalImage.src.length > 0) {
      this.modal.append(this.modalCloseBtn, this.modalImage, this.modalContent);
    } else {
      this.modal.append(this.modalCloseBtn, this.modalContent);
    }
    this.overlay.append(this.modal);
  }

  closeModal() {
    this.overlay.remove();
  }

  closeModalHandler() {
    this.modalCloseBtn.addEventListener('click', () => {
      this.closeModal();
    });
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.closeModal();
      }
    });
  }

  openModal() {
    const body = document.querySelector('body');
    body.append(this.overlay);
  }
}
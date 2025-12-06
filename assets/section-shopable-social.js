class ShopableDot extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.handleClick.bind(this));
    this.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }
  }

  handleClick() {
    const productId = this.getAttribute("data-product-id");
    const closestLi = this.closest(
      ".shopable-social__image-with-product-dot-item"
    );
    const targetElement = document.querySelector(`.get-${productId}`);

    const isCurrentlyActive =
      closestLi && closestLi.classList.contains("active");

    if (isCurrentlyActive) {
      document.querySelectorAll(".product-list__hidden").forEach((element) => {
        element.style.display = "block";
      });

      closestLi.classList.remove("active");

      if (targetElement) {
        targetElement.classList.remove("active");
        targetElement.style.display = "none";
      }
    } else {
      document.querySelectorAll(".product-list__hidden").forEach((element) => {
        element.style.display = "none";
      });

      document
        .querySelectorAll(".shopable-social__image-with-product-dot-item")
        .forEach((item) => {
          item.classList.remove("active");
        });

      document.querySelectorAll('[class*="get-"]').forEach((element) => {
        element.classList.remove("active");
        element.style.display = "none";
      });

      if (closestLi) {
        closestLi.classList.add("active");
      }

      if (targetElement) {
        targetElement.classList.add("active");
        targetElement.style.display = "block";
      }
    }
  }
}

customElements.define("shopable-dot", ShopableDot);

class BackProduct extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.handleClick.bind(this));
    this.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }
  }

  handleClick() {
    document.querySelectorAll('[class*="get-"]').forEach((element) => {
      element.classList.remove("active");
      element.style.display = "none";
    });

    document
      .querySelectorAll(".shopable-social__image-with-product-dot-item")
      .forEach((item) => {
        item.classList.remove("active");
      });

    document.querySelectorAll(".product-list__hidden").forEach((element) => {
      element.style.display = "block";
    });
  }
}

customElements.define("back-product", BackProduct);

class ShopableShowAddCart extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.handleClick.bind(this));
    this.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }
  }

  handleClick() {
    const productId = this.getAttribute("data-product-id");

    document.querySelectorAll(".product-list__hidden").forEach((element) => {
      element.style.display = "none";
    });

    document.querySelectorAll('[class*="get-"]').forEach((element) => {
      element.classList.remove("active");
      element.style.display = "none";
    });

    document
      .querySelectorAll(".shopable-social__image-with-product-dot-item")
      .forEach((item) => {
        item.classList.remove("active");
      });

    if (productId) {
      const targetElement = document.querySelector(`.get-${productId}`);
      if (targetElement) {
        targetElement.classList.add("active");
        targetElement.style.display = "block";
      }

      const dotElement = document.querySelector(`.dot-${productId}`);
      if (dotElement) {
        dotElement.classList.add("active");
      }
    }
  }
}

customElements.define("shopable-show-add-cart", ShopableShowAddCart);

class ItemPreview extends HTMLElement {
  constructor() {
    super();
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.dragThreshold = 5;

    this.addEventListener("click", this.handleClick.bind(this));
    this.addEventListener("keydown", this.handleKeydown.bind(this));
    this.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }

    if (event.key === "Escape") {
      const existingModal = document.querySelector("shopable-modal");
      if (existingModal) {
        this.closeModal(existingModal);
      }
    }
  }

  handleClick() {
    if (this.isDragging) {
      return;
    }
    
    const existingModal = document.querySelector("shopable-modal");
    if (existingModal) {
      return;
    }
    const closestItem = this.closest(".shopable-social__item");
    if (!closestItem) {
      return;
    }

    const template = closestItem.querySelector("template");
    if (!template) {
      return;
    }

    const shopableModal = document.createElement("shopable-modal");

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modalContent = document.createElement("div");
    modalContent.className = "shopable-modal-content";

    shopableModal.setAttribute("role", "dialog");
    shopableModal.setAttribute("aria-modal", "true");
    shopableModal.setAttribute("aria-labelledby", "modal-title");
    modalContent.setAttribute("tabindex", "-1");

    const templateContent = template.content.cloneNode(true);
    modalContent.appendChild(templateContent);

    shopableModal.appendChild(modalOverlay);
    shopableModal.appendChild(modalContent);

    document.body.appendChild(shopableModal);
    document.body.classList.add("modal-open");
    this.previouslyFocusedElement = document.activeElement;

    requestAnimationFrame(() => {
      shopableModal.classList.add("show");
      if (!Shopify.designMode) {
        this.initModalFocus(shopableModal);
      }
    });
    root.style.setProperty("padding-right", getScrollBarWidth.init() + "px");

    modalOverlay.addEventListener("click", () => {
      this.closeModal(shopableModal);
    });

    this.escapeHandler = (event) => {
      if (event.key === "Escape") {
        this.closeModal(shopableModal);
      }
    };
    document.addEventListener("keydown", this.escapeHandler);
  }

  initModalFocus(modal) {
    const getFocusableElements = () => {
      return Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), summary'
        )
      );
    };

    let focusableElements = getFocusableElements();

    if (focusableElements.length === 0) {
      const modalContent = modal.querySelector(".shopable-modal-content");
      modalContent.setAttribute("tabindex", "0");
      modalContent.focus();
      return;
    }

    setTimeout(() => {
      focusableElements[0].focus();
    }, 100);

    this.modalKeydownHandler = (event) => {
      const isInsideModal = modal.contains(document.activeElement);

      if (event.key === "Tab") {
        focusableElements = getFocusableElements();

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement || !isInsideModal) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !isInsideModal) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }

      if (!isInsideModal && focusableElements.length > 0) {
        event.preventDefault();
        focusableElements[0].focus();
      }
    };

    this.focusInHandler = (event) => {
      if (!modal.contains(event.target)) {
        event.preventDefault();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    this.focusOutHandler = (event) => {
      if (!modal.contains(event.relatedTarget)) {
        setTimeout(() => {
          if (!modal.contains(document.activeElement)) {
            const elements = getFocusableElements();
            if (elements.length > 0) {
              elements[0].focus();
            }
          }
        }, 0);
      }
    };

    document.addEventListener("keydown", this.modalKeydownHandler);
    document.addEventListener("focusin", this.focusInHandler);
    modal.addEventListener("focusout", this.focusOutHandler);
  }

  closeModal(modalElement) {
    modalElement.classList.remove("show");
    root.style.removeProperty("padding-right");

    if (this.modalKeydownHandler) {
      document.removeEventListener("keydown", this.modalKeydownHandler);
      this.modalKeydownHandler = null;
    }

    if (this.focusInHandler) {
      document.removeEventListener("focusin", this.focusInHandler);
      this.focusInHandler = null;
    }

    if (this.focusOutHandler) {
      modalElement.removeEventListener("focusout", this.focusOutHandler);
      this.focusOutHandler = null;
    }

    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
      this.escapeHandler = null;
    }

    setTimeout(() => {
      modalElement.remove();
      document.body.classList.remove("modal-open");

      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
      }
    }, 300);
  }

  handleMouseDown(event) {
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isDragging = false;
  }

  handleMouseMove(event) {
    if (this.startX !== undefined && this.startY !== undefined) {
      const deltaX = Math.abs(event.clientX - this.startX);
      const deltaY = Math.abs(event.clientY - this.startY);

      if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
        this.isDragging = true;
      }
    }
  }

  handleMouseUp() {
    setTimeout(() => {
      this.isDragging = false;
      this.startX = undefined;
      this.startY = undefined;
    }, 0);
  }

  handleTouchStart(event) {
    if (event.touches.length > 0) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.isDragging = false;
    }
  }

  handleTouchMove(event) {
    if (
      event.touches.length > 0 &&
      this.startX !== undefined &&
      this.startY !== undefined
    ) {
      const deltaX = Math.abs(event.touches[0].clientX - this.startX);
      const deltaY = Math.abs(event.touches[0].clientY - this.startY);

      if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
        this.isDragging = true;
      }
    }
  }

  handleTouchEnd() {
    setTimeout(() => {
      this.isDragging = false;
      this.startX = undefined;
      this.startY = undefined;
    }, 0);
  }
}

customElements.define("item-preview", ItemPreview);

class CloseModalShopable extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.handleClick.bind(this));
    this.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }

    if (event.key === "Escape") {
      const shopableModal = document.querySelector("shopable-modal");
      if (shopableModal) {
        this.closeModal(shopableModal);
      }
    }
  }

  handleClick() {
    const shopableModal = document.querySelector("shopable-modal");
    if (shopableModal) {
      this.closeModal(shopableModal);
    }
  }

  closeModal(modalElement) {
    root.style.removeProperty("padding-right");
    modalElement.classList.remove("show");
    const itemPreview = document.querySelector("item-preview");

    setTimeout(() => {
      modalElement.remove();
      document.body.classList.remove("modal-open");

      if (itemPreview && itemPreview.previouslyFocusedElement) {
        itemPreview.previouslyFocusedElement.focus();
      } else if (itemPreview) {
        itemPreview.focus();
      }
    }, 300);
  }
}

customElements.define("close-modal-shopable", CloseModalShopable);

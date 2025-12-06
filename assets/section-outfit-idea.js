class IdeaProducts extends Popup {
  constructor() {
    super();
    this.view_idea_product = this.querySelector(".view_idea_product");
    this.content = this.querySelector(".idea-product-list");
    this.close = this.querySelector(".close");
    this.init();
  }

  init() {
    const _this = this;

    if (this.content && !this.content.id) {
      this.content.id = "idea-product-content";
    }

    if (this.content) {
      this.content.setAttribute("aria-hidden", "true");
    }

    this.view_idea_product.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Check screen width to determine behavior
      if (window.innerWidth > 575) {
        _this.toggleViewIdeaProducts("show");
      } else {
        _this.initPopupMobile();
      }
    });

    this.view_idea_product.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        
        // Check screen width to determine behavior
        if (window.innerWidth > 575) {
          _this.toggleViewIdeaProducts("show");
        } else {
          _this.initPopupMobile();
        }
      }
    });

    this.close.addEventListener("click", (e) => {
      e.stopPropagation();
      // Only work on desktop
      if (window.innerWidth > 575) {
        _this.toggleViewIdeaProducts("hidden");
      }
    });

    this.close.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        // Only work on desktop
        if (window.innerWidth > 575) {
          _this.toggleViewIdeaProducts("hidden");
        }
      }
    });

    document.addEventListener("click", (e) => {
      // Only work on desktop
      if (window.innerWidth > 575 && !_this.contains(e.target)) {
        _this.toggleViewIdeaProducts("hidden");
      }
    });

    document.addEventListener("keydown", (e) => {
      // Only work on desktop
      if (window.innerWidth > 575 && e.key === "Escape" && _this.classList.contains("active")) {
        _this.toggleViewIdeaProducts("hidden");
        _this.view_idea_product.focus();
      }
    });

    this.addEventListener("idea-product-opening", () => {
      _this.closeOtherIdeaProducts();
    });

    // Add resize event listener to close popup if screen becomes small
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 575 && _this.classList.contains('active')) {
        _this.toggleViewIdeaProducts("hidden");
      }
    });
  }

  toggleViewIdeaProducts(type = "hidden") {
    // Only work on desktop (> 575px)
    if (window.innerWidth <= 575) {
      return;
    }

    if (type === "hidden") {
      this.classList.remove("active");
      if (this.content) {
        this.content.setAttribute("aria-hidden", "true");
      }
    } else {
      this.dispatchEvent(
        new CustomEvent("idea-product-opening", { bubbles: true })
      );
      this.classList.add("active");
      if (this.content) {
        this.content.setAttribute("aria-hidden", "false");
        // Focus on content when opening
        setTimeout(() => {
          this.content.focus();
        }, 100);
      }
    }
  }

  closeOtherIdeaProducts() {
    const allIdeaProducts = document.querySelectorAll("idea-product");
    allIdeaProducts.forEach((product) => {
      if (product !== this && product.classList.contains("active")) {
        product.toggleViewIdeaProducts("hidden");
      }
    });
  }

  initPopupMobile() {
    const title = this.dataset?.title;
    const id = this.dataset?.id;
    const content = this.querySelector(".mobile-popup");
    this.initPopupJs(content.innerHTML, title, id, true, false);
  }
}

customElements.define("idea-product", IdeaProducts);

class ShopableImageLookbook extends HTMLElement {
  constructor() {
    super();
    this.connectedCallback();
    this.dot = this.querySelector(".shopable-image-hotspot");
    if (!this.dot) return;
    const _this = this;

    this.shopableItem = this.dot.closest(".shopable-image-item");
    this.hoverTimeout = null;

    if (this.shopableItem) {
      this.shopableItem.addEventListener(
        "mouseover",
        _this.onHoverPopup.bind(_this),
        false
      );
      this.shopableItem.addEventListener(
        "mouseout",
        _this.onMouseOut.bind(_this),
        false
      );
    }

    this.dot.addEventListener(
      "keypress",
      function (event) {
        if (event.key === "Enter") {
          _this.onClickPopup.bind(_this)(event);
        }
      },
      false
    );
    this.onEscapeKey();
    this.onResize();
  }

  initFunction() {
    this.onBodyClick();
    this.onEscapeKey();
  }

  connectedCallback() {
    const __this = this;
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);
      __this.initFunction();
    };

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px -400px 0px",
    }).observe(this);
  }

  onClickPopup(e) {
    const target = e.currentTarget;
    if (target && target.closest(".shopable-image-item")) {
      const shopableItem = target.closest(".shopable-image-item");
      this.removeAllActive();
      shopableItem.classList.toggle("active");
    }
  }

  onHoverPopup(e) {
    if (window.innerWidth >= 768) {
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }

      const shopableItem = e.currentTarget;
      this.removeAllActive();
      shopableItem.classList.add("active");
    }
  }

  onEscapeKey() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.removeAllActive();
      }
    });
  }

  onMouseOut(e) {
    if (window.innerWidth >= 768) {
      const shopableItem = e.currentTarget;
      const relatedTarget = e.relatedTarget;

      if (relatedTarget && shopableItem.contains(relatedTarget)) {
        return;
      }

      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }

      this.hoverTimeout = setTimeout(() => {
        shopableItem.classList.remove("active");
        this.hoverTimeout = null;
      }, 100);
    }
  }

  onBodyClick() {
    const _this = this;
    document.body.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.closest(".shopable-image-item")) {
        _this.removeAllActive();
      }
    });
  }

  removeActive() {
    if (!this.dot) return;
    const shopableItem = this.dot.closest(".shopable-image-item");
    if (shopableItem) {
      shopableItem.classList.remove("active");
    }
  }

  removeAllActive() {
    const allShopableItems = document.querySelectorAll(".shopable-image-item");
    allShopableItems.forEach((item) => {
      item.classList.remove("active");
    });
  }

  onResize() {
    const _this = this;
    window.addEventListener("resize", function () {
      if (window.innerWidth < 768) {
        _this.removeActive();
      }
    });
  }
}
customElements.define("shopable-image-lookbook", ShopableImageLookbook);

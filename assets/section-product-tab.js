class ProductTabs extends HTMLElement {
  constructor() {
    super();
    this.tabs = this.querySelectorAll(".collection-tab__tab-item");
    this.content = this.querySelectorAll(".collection-tab__tab-content");
    this.type = this.dataset.type;
    this.init();
  }

  init() {
    const self = this;
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        self.onClick(this);
      });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          self.onClick(this);
        }
      });
    });
  }

  onClick(tab) {
    const blockId = tab.dataset.blockId;
    this.showContent(blockId);
    this.tabs.forEach((t) => {
      t.classList.remove("active");
    });
    tab.classList.add("active");
    this.rebuildSlideSection(blockId);
  }

  showContent(blockId) {
    this.content.forEach((content) => {
      if (content.dataset.blockId === blockId) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
  }

  rebuildSlideSection(blockId) {
    const activeContent = Array.from(this.content).find(
      (content) => content.dataset.blockId === blockId
    );

    if (activeContent) {
      const slideSection = activeContent.querySelector("slide-section");

      if (slideSection && slideSection.rebuild) {
        slideSection.slider.destroy();
        slideSection.slider = null;
        slideSection.initSlide();
      }
    }
  }
}
customElements.define("product-tabs", ProductTabs);

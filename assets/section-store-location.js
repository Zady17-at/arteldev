if (!customElements.get("store-location-hover")) {
  customElements.define(
    "store-location-hover",
    class StoreLocationHover extends HTMLElement {
      constructor() {
        super();
        this.content = this.querySelector(".store-name");
        this.imageHover = this.querySelector(".store-image");
        this.mousePosition = { x: 0, y: 0 };
        this.isHovering = false;
        this.bounds = null;
        this.imageVisible = false;
        this.animationId = null;
        this.cursorOffset = { x: -200, y: 10 };
        this.isLargeScreen = window.innerWidth > 767;
      }

      connectedCallback() {
        if (!this.content || !this.imageHover) return;

        this.setupImageStyles();
        this.handleResize();

        if (this.isLargeScreen) {
          this.setupEventListeners();
        }

        window.addEventListener("resize", this.handleResize.bind(this));

        const image = this.imageHover.querySelector("img");
        if (image && !image.complete) {
          image.addEventListener("load", () => {
            this.updateImageSize();
          });
        } else {
          this.updateImageSize();
        }
      }

      setupEventListeners() {
        this.content.addEventListener(
          "mouseenter",
          this.onMouseEnter.bind(this)
        );
        this.content.addEventListener(
          "mouseleave",
          this.onMouseLeave.bind(this)
        );
        this.content.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.content.addEventListener("focus", this.onFocus.bind(this));
        this.content.addEventListener("blur", this.onBlur.bind(this));
        this.content.addEventListener("keydown", this.onKeyDown.bind(this));
        this.hasEventListeners = true;
      }

      onFocus() {
        if (!this.isLargeScreen) return;

        this.isFocused = true;
        this.bounds = this.content.getBoundingClientRect();

        this.mousePosition = {
          x: this.bounds.left + this.bounds.width / 2,
          y: this.bounds.top + this.bounds.height / 2,
        };

        this.setActiveStore();

        if (!this.imageVisible && this.imageHover) {
          this.positionImageAtCenter();
          setTimeout(() => {
            this.imageHover.style.transition =
              "opacity 0.3s ease, transform 0.3s ease";
          }, 10);

          this.imageVisible = true;
          this.imageHover.style.opacity = "1";
          this.imageHover.style.transform = "translate(-50%, -50%) scale(1)";
        }
      }

      positionImageAtCenter() {
        if (!this.bounds) return;

        const centerX = this.bounds.left + this.bounds.width / 2;
        const centerY = this.bounds.top + this.bounds.height / 2;

        const x = centerX + this.cursorOffset.x;
        const y = centerY + this.cursorOffset.y;

        this.imageHover.style.left = `${x}px`;
        this.imageHover.style.top = `${y}px`;
      }

      onBlur() {
        this.isFocused = false;
        this.setActiveStore();

        if (this.imageVisible && this.imageHover) {
          this.imageVisible = false;
          this.imageHover.style.opacity = "0";
          this.imageHover.style.transform = "translate(-50%, -50%) scale(0.7)";

          setTimeout(() => {
            if (!this.isFocused && !this.isHovering) {
              this.imageHover.style.left = "-9999px";
              this.imageHover.style.top = "-9999px";
            }
          }, 300);
        }
      }

      onKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.setActiveStore();
        }
      }

      removeEventListeners() {
        if (this.content) {
          this.content.removeEventListener(
            "mouseenter",
            this.onMouseEnter.bind(this)
          );
          this.content.removeEventListener(
            "mouseleave",
            this.onMouseLeave.bind(this)
          );
          this.content.removeEventListener(
            "mousemove",
            this.onMouseMove.bind(this)
          );
          this.content.removeEventListener("focus", this.onFocus.bind(this));
          this.content.removeEventListener("blur", this.onBlur.bind(this));
          this.content.removeEventListener(
            "keydown",
            this.onKeyDown.bind(this)
          );
        }
        this.hasEventListeners = false;
      }

      setActiveStore() {
        const storeId = this.getAttribute("data-store-id");
        document.querySelectorAll("store-location-hover").forEach((store) => {
          store.classList.remove("active");
        });
        document.querySelectorAll(".store-content__item").forEach((item) => {
          item.classList.remove("active");
        });

        this.classList.add("active");
        if (storeId) {
          const correspondingContentItem = document.querySelector(
            `.store-content__item[data-store-id="${storeId}"]`
          );
          if (correspondingContentItem) {
            correspondingContentItem.classList.add("active");
          }
        }
        const event = new CustomEvent("storeActivated", {
          detail: {
            store: this,
            storeId: storeId,
          },
          bubbles: true,
        });
        this.dispatchEvent(event);
      }

      handleResize() {
        const wasLargeScreen = this.isLargeScreen;
        this.isLargeScreen = window.innerWidth > 767;
        this.content.addEventListener("click", this.setActiveStore.bind(this));
        if (this.isLargeScreen && !wasLargeScreen && !this.hasEventListeners) {
          this.setupEventListeners();
        } else if (
          !this.isLargeScreen &&
          wasLargeScreen &&
          this.hasEventListeners
        ) {
          this.removeEventListeners();
          this.onMouseLeave();
        }
      }

      setupImageStyles() {
        if (!this.imageHover) return;

        this.imageHover.style.position = "fixed";
        this.imageHover.style.pointerEvents = "none";
        this.imageHover.style.zIndex = "100";
        this.imageHover.style.opacity = "0";
        this.imageHover.style.transform = "translate(-50%, -50%) scale(0.95)";
        this.imageHover.style.overflow = "hidden";
        this.imageHover.style.left = "-9999px";
        this.imageHover.style.top = "-9999px";
        this.imageHover.style.transition = "none";
      }

      updateImageSize() {
        const maxHeight = Math.min(400, window.innerHeight * 0.5);
        this.imageHover.style.width = `300px`;
        this.imageHover.style.height = "auto";
        this.imageHover.style.maxHeight = `${maxHeight}px`;
      }

      onMouseEnter(event) {
        if (!this.isLargeScreen) return;

        this.isHovering = true;
        this.bounds = this.content.getBoundingClientRect();
        this.updateMousePosition(event);
        this.setActiveStore();

        if (!this.imageVisible && this.imageHover) {
          this.positionImageAtCursor();
          setTimeout(() => {
            this.imageHover.style.transition =
              "opacity 0.3s ease, transform 0.3s ease";
          }, 10);

          this.imageVisible = true;

          this.imageHover.style.opacity = "1";
          this.imageHover.style.transform = "translate(-50%, -50%) scale(1)";

          this.animateImagePosition();
        }
      }

      positionImageAtCursor() {
        if (!this.mousePosition || !this.bounds) return;

        const x = this.mousePosition.x + this.cursorOffset.x;
        const y = this.mousePosition.y + this.cursorOffset.y;

        const centerX = this.bounds.left + this.bounds.width / 2;
        const centerY = this.bounds.top + this.bounds.height / 2;

        const pullFactor = 0.1;
        const finalX = x + (centerX - x) * pullFactor;
        const finalY = y + (centerY - y) * pullFactor;

        this.imageHover.style.left = `${finalX}px`;
        this.imageHover.style.top = `${finalY}px`;
      }

      onMouseLeave() {
        this.isHovering = false;
        this.setActiveStore();
        if (this.imageVisible && this.imageHover) {
          this.imageVisible = false;

          this.imageHover.style.opacity = "0";
          this.imageHover.style.transform = "translate(-50%, -50%) scale(0.7)";

          if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
          }

          setTimeout(() => {
            if (!this.isHovering) {
              this.imageHover.style.left = "-9999px";
              this.imageHover.style.top = "-9999px";
            }
          }, 300);
        }
      }

      onMouseMove(event) {
        if (this.isHovering && this.isLargeScreen) {
          this.updateMousePosition(event);
        }
      }

      updateMousePosition(event) {
        this.mousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }

      animateImagePosition() {
        if (!this.isHovering || !this.imageVisible || !this.isLargeScreen) {
          return;
        }

        const x = this.mousePosition.x + this.cursorOffset.x;
        const y = this.mousePosition.y + this.cursorOffset.y;

        const centerX = this.bounds.left + this.bounds.width / 2;
        const centerY = this.bounds.top + this.bounds.height / 2;

        const pullFactor = 0.1;
        const finalX = x + (centerX - x) * pullFactor;
        const finalY = y + (centerY - y) * pullFactor;

        this.imageHover.style.left = `${finalX}px`;
        this.imageHover.style.top = `${finalY}px`;

        const image = this.imageHover.querySelector("img");
        if (image) {
          const relX =
            (this.mousePosition.x - this.bounds.left) / this.bounds.width;
          const relY =
            (this.mousePosition.y - this.bounds.top) / this.bounds.height;

          const moveX = (relX - 0.5) * -6;
          const moveY = (relY - 0.5) * -6;

          image.style.transform = `translate(${moveX}%, ${moveY}%)`;
          image.style.transition = "transform 0.2s ease-out";
        }

        this.animationId = requestAnimationFrame(
          this.animateImagePosition.bind(this)
        );
      }

      disconnectedCallback() {
        this.removeEventListeners();
        window.removeEventListener("resize", this.handleResize.bind(this));

        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
      }
    }
  );
}

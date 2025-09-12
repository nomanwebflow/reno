// ✅ Set ScrollFlip origin (active + 2 prev + 2 next)
let lastActiveSlide = null;

function setScrollFlipOrigin() {
  const allSlides = document.querySelectorAll(".home_des_v-slider_slide");
  const activeSlide = document.querySelector(
    ".home_des_v-slider_slide.swiper-slide-active"
  );
  if (!activeSlide) return;

  // Reset all
  allSlides.forEach((slide) => {
    const element = slide.querySelector("[tr-scrollflip-element]");
    if (element) {
      element.setAttribute("tr-scrollflip-element", "");
    }
  });

  // Mark last active group as "origin"
  if (lastActiveSlide) {
    const originSlides = [lastActiveSlide];

    let prev = lastActiveSlide.previousElementSibling;
    for (let i = 0; i < 2 && prev; i++) {
      originSlides.unshift(prev);
      prev = prev.previousElementSibling;
    }

    let next = lastActiveSlide.nextElementSibling;
    for (let i = 0; i < 2 && next; i++) {
      originSlides.push(next);
      next = next.nextElementSibling;
    }

    originSlides.forEach((slide) => {
      const element = slide.querySelector("[tr-scrollflip-element]");
      if (element) {
        element.setAttribute("tr-scrollflip-element", "origin");
      }
    });
  }

  // Mark current active group as "target"
  const targetSlides = [activeSlide];

  let prev = activeSlide.previousElementSibling;
  for (let i = 0; i < 2 && prev; i++) {
    targetSlides.unshift(prev);
    prev = prev.previousElementSibling;
  }

  let next = activeSlide.nextElementSibling;
  for (let i = 0; i < 2 && next; i++) {
    targetSlides.push(next);
    next = next.nextElementSibling;
  }

  targetSlides.forEach((slide) => {
    const element = slide.querySelector("[tr-scrollflip-element]");
    if (element) {
      element.setAttribute("tr-scrollflip-element", "target");
    }
  });

  // Save current as last
  lastActiveSlide = activeSlide;
}

// ✅ Swiper setup
const sliderEl = document.querySelector(".home_des_v-slider_wrap.swiper");
const slideCount = sliderEl.querySelectorAll(".swiper-slide").length;
const middleIndex = Math.floor(slideCount / 2);

const designerSwiper = new Swiper(sliderEl, {
  allowTouchMove: false,
  slideToClickedSlide: true,
  direction: "vertical",
  speed: 1000,
  slidesPerView: "auto",
  centeredSlides: true,
  initialSlide: middleIndex,
  spaceBetween: 30,
  loop: true,
  grabCursor: true,
  on: {
    init: function () {
      setScrollFlipOrigin();

      // GSAP animation (set all small, grow active)
      this.slides.forEach((slide) => {
        gsap.set(slide, { width: "5rem", height: "5rem" });
      });
      gsap.to(this.slides[this.activeIndex], {
        width: "7.5rem",
        height: "7.5rem",
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          const event = new CustomEvent("designerSliderChange", {
            detail: { activeIndex: this.activeIndex },
          });
          document.dispatchEvent(event);
        },
      });
    },
    slideChangeTransitionStart: function () {
      setScrollFlipOrigin();

      // GSAP animation (shrink all, grow active)
      this.slides.forEach((slide) => {
        gsap.to(slide, {
          width: "5rem",
          height: "5rem",
          duration: 0.5,
          ease: "power2.out",
        });
      });
      gsap.to(this.slides[this.activeIndex], {
        width: "7.5rem",
        height: "7.5rem",
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          const event = new CustomEvent("designerSliderChange", {
            detail: { activeIndex: this.activeIndex },
          });
          document.dispatchEvent(event);
        },
      });
    },
  },
});

// ✅ Listen for slider changes → reinit ScrollFlip
document.addEventListener("designerSliderChange", (e) => {
  console.log(
    "🔥 Designer slider changed, reinit scrollflip:",
    e.detail.activeIndex
  );
  if (typeof window.refreshScrollFlip === "function") {
    window.refreshScrollFlip();
  }
});

// ✅ SCROLL FLIP POWER-UP - Enhanced with Dynamic Content Support
window.addEventListener("DOMContentLoaded", (event) => {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  gsap.registerPlugin(ScrollTrigger, Flip);
  ScrollTrigger.normalizeScroll(true);

  let initializedComponents = new WeakSet();
  let globalComponentIndex = 0;

  function initializeScrollFlipComponent(componentEl, componentIndex) {
    if (initializedComponents.has(componentEl[0])) return;
    initializedComponents.add(componentEl[0]);

    const originEl = componentEl.find("[tr-scrollflip-element='origin']"),
      targetEl = componentEl.find("[tr-scrollflip-element='target']"),
      scrubStartEl = componentEl.find("[tr-scrollflip-scrubstart]"),
      scrubEndEl = componentEl.find("[tr-scrollflip-scrubend]");

    const startSetting = attr(
        "top top",
        scrubStartEl.attr("tr-scrollflip-scrubstart")
      ),
      endSetting = attr(
        "bottom bottom",
        scrubEndEl.attr("tr-scrollflip-scrubend")
      ),
      staggerSpeedSetting = attr(
        0,
        componentEl.attr("tr-scrollflip-staggerspeed")
      ),
      staggerDirectionSetting = attr(
        "start",
        componentEl.attr("tr-scrollflip-staggerdirection")
      ),
      scaleSetting = attr(false, componentEl.attr("tr-scrollflip-scale")),
      breakpointSetting = attr(0, componentEl.attr("tr-scrollflip-breakpoint"));

    let timeline = null;
    let resizeTimer = null;
    let mm = null;

    originEl.each(function (index) {
      let flipId = `${componentIndex}-${index}`;
      $(this).attr("data-flip-id", flipId);
      if (targetEl.eq(index).length) {
        targetEl.eq(index).attr("data-flip-id", flipId);
      }
    });

    function createTimeline() {
      if (timeline) {
        timeline.kill();
        timeline = null;
      }
      if (mm) {
        try {
          mm.revert();
        } catch (err) {}
        mm = null;
      }

      gsap.set(targetEl.get(), { clearProps: "all" });

      mm = gsap.matchMedia();
      mm.add(`(min-width: ${breakpointSetting}px)`, () => {
        const state = Flip.getState(originEl.get());
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scrubStartEl[0] || scrubStartEl,
            endTrigger: scrubEndEl[0] || scrubEndEl,
            start: startSetting,
            end: endSetting,
            scrub: true,
          },
        });
        timeline.add(
          Flip.from(state, {
            targets: targetEl.get(),
            scale: scaleSetting,
            stagger: {
              amount: staggerSpeedSetting,
              from: staggerDirectionSetting,
            },
          })
        );
      });
    }

    createTimeline();

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        createTimeline();
      }, 250);
    });

    componentEl[0]._scrollFlipCleanup = function () {
      if (timeline) {
        timeline.kill();
        timeline = null;
      }
      if (mm) {
        try {
          mm.revert();
        } catch (err) {}
        mm = null;
      }
      clearTimeout(resizeTimer);
      gsap.set(targetEl.get(), { clearProps: "all" });
      initializedComponents.delete(componentEl[0]);
    };
  }

  function initializeAllComponents() {
    $("[tr-scrollflip-element='component']").each(function () {
      initializeScrollFlipComponent($(this), globalComponentIndex++);
    });
  }

  initializeAllComponents();

  const observer = new MutationObserver(function (mutations) {
    let needsUpdate = false;
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const $node = $(node);
            if ($node.is("[tr-scrollflip-element='component']")) {
              initializeScrollFlipComponent($node, globalComponentIndex++);
              needsUpdate = true;
            }
            const childComponents = $node.find(
              "[tr-scrollflip-element='component']"
            );
            if (childComponents.length > 0) {
              childComponents.each(function () {
                initializeScrollFlipComponent($(this), globalComponentIndex++);
                needsUpdate = true;
              });
            }
          }
        });

        mutation.removedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const $node = $(node);
            if (
              $node.is("[tr-scrollflip-element='component']") &&
              node._scrollFlipCleanup
            ) {
              node._scrollFlipCleanup();
              initializedComponents.delete(node);
            }
            $node.find("[tr-scrollflip-element='component']").each(function () {
              if (this._scrollFlipCleanup) {
                this._scrollFlipCleanup();
                initializedComponents.delete(this);
              }
            });
          }
        });
      }
    });
    if (needsUpdate) {
      ScrollTrigger.refresh();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 🔥 DESTROY + RE-CREATE on demand
  window.refreshScrollFlip = function () {
    $("[tr-scrollflip-element='component']").each(function () {
      if (this._scrollFlipCleanup) {
        this._scrollFlipCleanup();
      }
    });

    initializedComponents = new WeakSet();
    globalComponentIndex = 0;

    initializeAllComponents();
    ScrollTrigger.refresh();
  };

  window.addEventListener("beforeunload", function () {
    observer.disconnect();
    $("[tr-scrollflip-element='component']").each(function () {
      if (this._scrollFlipCleanup) {
        this._scrollFlipCleanup();
      }
    });
  });

  const designerContentSwiper = new Swiper(".home_des_c-slider_component.swiper", {
    speed: 500,
    slidesPerView: 1,
    initialSlide: middleIndex,
    loop: true,
    spaceBetween: 0,
    centeredSlides: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });


  const designerIMGSwiper = new Swiper(".home_des_img_component.swiper", {
    speed: 500,
    slidesPerView: 1,
    initialSlide: middleIndex,
    loop: true,
    spaceBetween: 0,
    centeredSlides: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });

// ✅ Sync all three sliders
designerSwiper.controller.control = designerContentSwiper;
designerContentSwiper.controller.control = designerIMGSwiper;

});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const target = document.querySelector(".home_des_track");
  if (!target) return;

  ScrollTrigger.create({
    trigger: target,
    start: "top top",   // when .home_des_track top hits viewport top
    end: "bottom top",  // until it scrolls out at the top
    toggleClass: {targets: target, className: "swiper-visible"},
    markers: false // set to true for debugging
  });
});
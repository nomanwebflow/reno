// Fixed ScrollFlip Animation - Maintains Original Functionality
document.addEventListener("DOMContentLoaded", () => {
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

  // ✅ Enhanced Swiper setup with better error handling
  function initializeSliders() {
    const sliderEl = document.querySelector(".home_des_v-slider_wrap.swiper");
    if (!sliderEl) {
      console.warn("Main slider element not found");
      return;
    }

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
          
          if (this.slides[this.activeIndex]) {
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
          }
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
          
          if (this.slides[this.activeIndex]) {
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
          }
        },
      },
    });

    // Initialize content and image swipers
    const contentSliderEl = document.querySelector(".home_des_c-slider_component.swiper");
    const imageSliderEl = document.querySelector(".home_des_img_component.swiper");

    let designerContentSwiper, designerIMGSwiper;

    if (contentSliderEl) {
      designerContentSwiper = new Swiper(contentSliderEl, {
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
    }

    if (imageSliderEl) {
      designerIMGSwiper = new Swiper(imageSliderEl, {
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
    }

    // ✅ Sync all three sliders
    if (designerContentSwiper) {
      designerSwiper.controller.control = designerContentSwiper;
    }
    if (designerContentSwiper && designerIMGSwiper) {
      designerContentSwiper.controller.control = designerIMGSwiper;
    }

    return { designerSwiper, designerContentSwiper, designerIMGSwiper };
  }

  // ✅ ENHANCED SCROLL FLIP POWER-UP
  function initializeScrollFlip() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Flip === 'undefined') {
      console.error('GSAP, ScrollTrigger, or Flip plugin not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger, Flip);
    ScrollTrigger.normalizeScroll(true);

    let initializedComponents = new WeakSet();
    let globalComponentIndex = 0;

    function attr(defaultVal, attrVal) {
      const defaultValType = typeof defaultVal;
      if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
      if (attrVal === "true" && defaultValType === "boolean") return true;
      if (attrVal === "false" && defaultValType === "boolean") return false;
      if (isNaN(attrVal) && defaultValType === "string") return attrVal;
      if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
      return defaultVal;
    }

    function initializeScrollFlipComponent(componentEl, componentIndex) {
      if (!componentEl || initializedComponents.has(componentEl)) return;
      
      try {
        initializedComponents.add(componentEl);

        const originEl = componentEl.querySelectorAll("[tr-scrollflip-element='origin']");
        const targetEl = componentEl.querySelectorAll("[tr-scrollflip-element='target']");
        const scrubStartEl = componentEl.querySelector("[tr-scrollflip-scrubstart]");
        const scrubEndEl = componentEl.querySelector("[tr-scrollflip-scrubend]");

        if (originEl.length === 0 || targetEl.length === 0) {
          console.warn('ScrollFlip component missing origin or target elements:', componentEl);
          return;
        }

        const startSetting = attr(
          "top top",
          scrubStartEl?.getAttribute("tr-scrollflip-scrubstart") || ""
        );
        const endSetting = attr(
          "bottom bottom",
          scrubEndEl?.getAttribute("tr-scrollflip-scrubend") || ""
        );
        const staggerSpeedSetting = attr(
          0,
          componentEl.getAttribute("tr-scrollflip-staggerspeed") || ""
        );
        const staggerDirectionSetting = attr(
          "start",
          componentEl.getAttribute("tr-scrollflip-staggerdirection") || ""
        );
        const scaleSetting = attr(
          false,
          componentEl.getAttribute("tr-scrollflip-scale") || ""
        );
        const breakpointSetting = attr(
          0,
          componentEl.getAttribute("tr-scrollflip-breakpoint") || ""
        );

        let timeline = null;
        let resizeTimer = null;
        let mm = null;

        // Assign flip IDs
        originEl.forEach(function (element, index) {
          let flipId = `${componentIndex}-${index}`;
          element.setAttribute("data-flip-id", flipId);
          if (targetEl[index]) {
            targetEl[index].setAttribute("data-flip-id", flipId);
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
            } catch (err) {
              console.warn('Error reverting matchMedia:', err);
            }
            mm = null;
          }

          gsap.set(Array.from(targetEl), { clearProps: "all" });

          mm = gsap.matchMedia();
          mm.add(`(min-width: ${breakpointSetting}px)`, () => {
            try {
              const state = Flip.getState(Array.from(originEl));
              timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: scrubStartEl || componentEl,
                  endTrigger: scrubEndEl || componentEl,
                  start: startSetting,
                  end: endSetting,
                  scrub: true,
                  refreshPriority: -1,
                },
              });
              
              timeline.add(
                Flip.from(state, {
                  targets: Array.from(targetEl),
                  scale: scaleSetting,
                  stagger: staggerSpeedSetting > 0 ? {
                    amount: staggerSpeedSetting,
                    from: staggerDirectionSetting,
                  } : 0,
                })
              );
            } catch (err) {
              console.error('Error creating flip animation:', err);
            }
          });
        }

        createTimeline();

        window.addEventListener("resize", function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            createTimeline();
          }, 250);
        });

        componentEl._scrollFlipCleanup = function () {
          if (timeline) {
            timeline.kill();
            timeline = null;
          }
          if (mm) {
            try {
              mm.revert();
            } catch (err) {
              console.warn('Error in cleanup:', err);
            }
            mm = null;
          }
          clearTimeout(resizeTimer);
          gsap.set(Array.from(targetEl), { clearProps: "all" });
          initializedComponents.delete(componentEl);
        };
        
      } catch (error) {
        console.error('Error initializing ScrollFlip component:', error);
      }
    }

    function initializeAllComponents() {
      try {
        const components = document.querySelectorAll("[tr-scrollflip-element='component']");
        components.forEach(function (component) {
          initializeScrollFlipComponent(component, globalComponentIndex++);
        });
      } catch (error) {
        console.error('Error initializing all components:', error);
      }
    }

    initializeAllComponents();

    const observer = new MutationObserver(function (mutations) {
      let needsUpdate = false;
      try {
        mutations.forEach(function (mutation) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach(function (node) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.hasAttribute && node.hasAttribute("tr-scrollflip-element") && 
                    node.getAttribute("tr-scrollflip-element") === "component") {
                  initializeScrollFlipComponent(node, globalComponentIndex++);
                  needsUpdate = true;
                }
                
                const childComponents = node.querySelectorAll && 
                  node.querySelectorAll("[tr-scrollflip-element='component']");
                if (childComponents && childComponents.length > 0) {
                  childComponents.forEach(function (child) {
                    initializeScrollFlipComponent(child, globalComponentIndex++);
                    needsUpdate = true;
                  });
                }
              }
            });

            mutation.removedNodes.forEach(function (node) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node._scrollFlipCleanup) {
                  node._scrollFlipCleanup();
                  initializedComponents.delete(node);
                }
                
                const childComponents = node.querySelectorAll && 
                  node.querySelectorAll("[tr-scrollflip-element='component']");
                if (childComponents) {
                  childComponents.forEach(function (child) {
                    if (child._scrollFlipCleanup) {
                      child._scrollFlipCleanup();
                      initializedComponents.delete(child);
                    }
                  });
                }
              }
            });
          }
        });
        
        if (needsUpdate) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.error('Error in mutation observer:', error);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 🔥 DESTROY + RE-CREATE on demand
    window.refreshScrollFlip = function () {
      console.log('🔄 Refreshing ScrollFlip...');
      try {
        const components = document.querySelectorAll("[tr-scrollflip-element='component']");
        components.forEach(function (component) {
          if (component._scrollFlipCleanup) {
            component._scrollFlipCleanup();
          }
        });

        initializedComponents = new WeakSet();
        globalComponentIndex = 0;

        setTimeout(() => {
          initializeAllComponents();
          ScrollTrigger.refresh();
          console.log('✅ ScrollFlip refresh complete');
        }, 100);
      } catch (error) {
        console.error('Error refreshing ScrollFlip:', error);
      }
    };

    window.addEventListener("beforeunload", function () {
      try {
        observer.disconnect();
        const components = document.querySelectorAll("[tr-scrollflip-element='component']");
        components.forEach(function (component) {
          if (component._scrollFlipCleanup) {
            component._scrollFlipCleanup();
          }
        });
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    });

    return { initializeAllComponents, observer };
  }

  // ✅ Initialize everything in order
  try {
    const sliders = initializeSliders();
    const scrollFlip = initializeScrollFlip();
    
    // ✅ Listen for slider changes → reinit ScrollFlip
    document.addEventListener("designerSliderChange", (e) => {
      console.log("🔥 Designer slider changed, reinit scrollflip:", e.detail.activeIndex);
      if (typeof window.refreshScrollFlip === "function") {
        setTimeout(() => {
          window.refreshScrollFlip();
        }, 50);
      }
    });

    // ✅ ScrollTrigger for visibility class
    const target = document.querySelector(".home_des_track");
    if (target) {
      ScrollTrigger.create({
        trigger: target,
        start: "top top",
        end: "bottom top",
        toggleClass: { targets: target, className: "swiper-visible" },
        markers: false,
      });
    }

    console.log('✅ All systems initialized successfully');
    
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});
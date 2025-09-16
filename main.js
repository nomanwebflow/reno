window.addEventListener("DOMContentLoaded", function () {
  const packagesSwiper = new Swiper(".packages_slider_component.swiper", {
    speed: 1000,
    slidesPerView: "auto",
    spaceBetween: 30,
    touchRatio: 0.5, // lower = stiffer drag
    resistanceRatio: 0.85, // closer to 1 = more resistance
    grabCursor: true,
  });

  const featureSwiper = new Swiper(".home_features_slider.swiper", {
    speed: 1000,
    slidesPerView: "auto",
    spaceBetween: 30,
    touchRatio: 0.5, // lower = stiffer drag
    resistanceRatio: 0.85, // closer to 1 = more resistance
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  // Stop autoplay initially
  featureSwiper.autoplay.stop();

  // Observe when slider enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          featureSwiper.autoplay.start();
        } else {
          featureSwiper.autoplay.stop();
        }
      });
    },
    { threshold: 0.2 } // % of slider visible before autoplay starts
  );

  const sliderEl = document.querySelector(".home_features_slider.swiper");
  if (sliderEl) observer.observe(sliderEl);
});

/**
 * ======================================
 * CTA SLIDER COMPONENT
 * ======================================
 * Enhanced Swiper implementation for CTA slider with custom navigation buttons
 * Features: fade effect, keyboard support, custom button navigation
 */

const initCTASlider = () => {
  // Cache DOM elements
  const swiperElement = document.querySelector(".cta_slider.swiper");
  const buttons = document.querySelectorAll(".cta_slider_menu_button");

  // Exit early if required elements don't exist
  if (!swiperElement || buttons.length === 0) {
    console.warn("CTA Slider: Required elements not found");
    return;
  }

  /**
   * Updates active state for navigation buttons
   * @param {number} activeIndex - Index of the currently active slide
   */
  const updateActiveButton = (activeIndex) => {
    buttons.forEach((button, index) => {
      button.classList.toggle("is-active", index === activeIndex);
    });
  };

  // Initialize Swiper with fade effect and navigation
  const ctaSwiper = new Swiper(swiperElement, {
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 1000,
    navigation: {
      nextEl: "[cta-swiper='next']",
      prevEl: "[cta-swiper='prev']",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    on: {
      slideChange: function () {
        updateActiveButton(this.activeIndex);
      },
      init: function () {
        updateActiveButton(this.activeIndex);
      },
    },
  });

  // Bind click events to custom navigation buttons
  buttons.forEach((button, index) => {
    // Handle button clicks
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Skip if already active to prevent unnecessary operations
      if (button.classList.contains("is-active")) return;

      // Navigate to corresponding slide and update button states
      ctaSwiper.slideTo(index);
      updateActiveButton(index);
    });

    // Add keyboard accessibility support
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        button.click();
      }
    });
  });

  // Set initial active state for first button
  updateActiveButton(0);
};

// Initialize CTA slider when DOM is ready
document.addEventListener("DOMContentLoaded", initCTASlider);

window.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll("[data-hero-slider-component]")
    .forEach((wrapper) => {
      const mainEl = wrapper.querySelector(".swiper.home_hero_slider");
      const thumbEl = wrapper.querySelector(".swiper.home_hero_thumb-slider");

      if (!mainEl || !thumbEl) return;

      // Initialize main hero slider
      const swiper = new Swiper(mainEl, {
        loop: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
          reverseDirection: true,
        },
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        speed: 1000,
        loopAdditionalSlides: 10,
      });

      // Initialize thumbnail slider
      const thumbSwiper = new Swiper(thumbEl, {
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          reverseDirection: true,
        },
        speed: 1000,
        slidesPerView: 1,
        spaceBetween: 20,
        loopAdditionalSlides: 10,
        touchRatio: 0.7,
        resistanceRatio: 0.65,
        grabCursor: true,
      });

      // Sync sliders
      swiper.controller.control = thumbSwiper;
      thumbSwiper.controller.control = swiper;
    });
});

// Wait for GSAP to load, then initialize
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure GSAP is fully loaded
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof Flip === "undefined") {
      console.error("GSAP or Flip plugin not loaded properly");
      return;
    }

    // Register plugin
    gsap.registerPlugin(Flip);

    const clusterCard = document.querySelector("[data-cluster-card]");
    const images = [
      document.querySelector("[data-cluster-image-1]"),
      document.querySelector("[data-cluster-image-2]"),
      document.querySelector("[data-cluster-image-3]"),
      document.querySelector("[data-cluster-image-4]"),
    ];
    const containers = [
      document.querySelector("[data-cluster-image-container-1]"),
      document.querySelector("[data-cluster-image-container-2]"),
      document.querySelector("[data-cluster-image-container-3]"),
      document.querySelector("[data-cluster-image-container-4]"),
    ];

    // Exit early if elements are missing
    if (!clusterCard || images.includes(null) || containers.includes(null)) {
      console.error("Missing cluster elements — check your HTML selectors.");
      return;
    }

    let isHovered = false;
    let isAnimating = false;

    function animateImages(hovering) {
      if (isAnimating) return;
      isAnimating = true;

      // Capture current layout
      const state = Flip.getState(images);

      if (hovering) {
        // Move images in a rotating pattern
        containers[1].appendChild(images[0]);
        containers[2].appendChild(images[1]);
        containers[3].appendChild(images[2]);
        containers[0].appendChild(images[3]);
      } else {
        // Return to original positions
        containers[0].appendChild(images[0]);
        containers[1].appendChild(images[1]);
        containers[2].appendChild(images[2]);
        containers[3].appendChild(images[3]);
      }

      // Animate with Flip
      Flip.from(state, {
        duration: 0.45,
        ease: "back.out(1.2)",
        absolute: true,
        scale: true,
        onComplete: () => {
          isAnimating = false;
          isHovered = hovering;
        },
      });
    }

    clusterCard.addEventListener("mouseenter", () => {
      if (!isHovered && !isAnimating) {
        animateImages(true);
      }
    });

    clusterCard.addEventListener("mouseleave", () => {
      if (isHovered && !isAnimating) {
        animateImages(false);
      }
    });

    console.log("GSAP Flip animation initialized successfully!");
  }, 100);
});

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);
  // Animate characters with SplitText
  document.querySelectorAll("[data-animate-chars]").forEach((element) => {
    // SplitText splits the element into lines and characters
    const split = new SplitText(element, { type: "lines,chars" });

    // Create a timeline for scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1, // Smooth scrubbing with 1 second lag
      },
    });

    // Add the character animation to the timeline
    tl.fromTo(
      split.chars,
      {
        y: 25,
        opacity: 0,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.02, // Increased stagger for better scrub visibility
        duration: 1,
        ease: "power2.out",
      }
    );
    // Add class to split characters
    split.chars.forEach((char) => char.classList.add("split-char"));
  });
});

if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
  var script = document.createElement("script");
  script.setAttribute("data-id-scroll", !0),
    script.setAttribute("data-autoinit", !0),
    script.setAttribute("data-duration", "1"),
    script.setAttribute("data-orientation", "vertical"),
    script.setAttribute("data-smoothWheel", !0),
    script.setAttribute("data-smoothTouch", !1),
    script.setAttribute("data-touchMultiplier", "1.5"),
    script.setAttribute(
      "data-easing",
      "(t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))"
    ),
    script.setAttribute("data-useOverscroll", !0),
    script.setAttribute("data-useControls", !0),
    script.setAttribute("data-useAnchor", !0),
    script.setAttribute("data-useRaf", !0),
    script.setAttribute("data-infinite", !1),
    script.setAttribute("defer", !0),
    script.setAttribute(
      "src",
      "https://assets-global.website-files.com/645e0e1ff7fdb6dc8c85f3a2/64a5544a813c7253b90f2f50_lenis-offbrand.txt"
    ),
    document.body.appendChild(script);
}

const yearSpans = document.querySelectorAll(".year_span");
const currentYear = new Date().getFullYear();
yearSpans.forEach(function (span) {
  span.textContent = currentYear;
});

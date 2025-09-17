document.addEventListener('DOMContentLoaded', function () {

  const buttonSwiper = new Swiper('.ctr_imagine_v-slider_wrap.swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    direction: 'vertical',
    speed: 450,
    slideToClickedSlide: true,
    touchRatio: 0.5, // lower = stiffer drag
    resistanceRatio: 0.85, // closer to 1 = more resistance
    freeMode: true,
  });

  const imageSwiper = new Swiper('.swiper.ctr_imagine_img_slider_wrap', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 0,
    allowTouchMove: false,
  });

  // Sync vertical slider with text slider
  buttonSwiper.controller.control = imageSwiper;
  imageSwiper.controller.control = buttonSwiper;

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: ".ctr_imagine_track",
    start: "top top",   // when .track enters viewport
    end: "bottom bottom",     // when .track leaves viewport
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress; // 0 to 1

      if (progress < 0.25) {
        buttonSwiper.slideTo(0); // 1st slide
      } else if (progress < 0.5) {
        buttonSwiper.slideTo(1); // 2nd slide
      } else if (progress < 0.75) {
        buttonSwiper.slideTo(2); // 3rd slide
      } else {
        buttonSwiper.slideTo(3); // 4th slide
      }
    },
  });
});


gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(
    ".ctr_all-in-one_img_one, .ctr_all-in-one_img_two, .ctr_all-in-one_img_three, .ctr_all-in-one_img_four, .ctr_all-in-one_img_five"
  );

  const zStart = -200; // starting z in dvh
  const zEndBase = 300; // base zEnd in dvh
  const zOffset = 10; // z offset step in dvh
  const fadeRange = 10; // how many % of viewport to fade in

  images.forEach((img, i) => {
    const startTop = parseFloat(img.dataset.gsapStartTop) || 0; // read [data-gsap-start-top]
    const zEnd = zEndBase + i * zOffset;

    // Z animation
    gsap.fromTo(
      img,
      { z: `${zStart}dvh` },
      {
        z: `${zEnd}dvh`,
        scrollTrigger: {
          trigger: ".ctr_all-in-one_track",
          start: `${startTop}% top`,
          end: "bottom top",
          scrub: true,
          stragger: true,
        },
      }
    );

    // Opacity animation (gradual)
    gsap.fromTo(
      img,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: ".ctr_all-in-one_track",
          start: `${startTop}% top`,
          end: `${startTop + fadeRange}% top`,
          scrub: true,
        },
      }
    );
  });
});

gsap.fromTo(".ctr_all-in-one_bg", { opacity: 0 }, {
  opacity: 1,
  scrollTrigger: {
    trigger: ".ctr_all-in-one_track",
    start: "top top",
    end: "10% top",
    scrub: true,
  },
});

const swiper = new Swiper('.ctr_industory_slider_wrap.swiper', {

  grabCursor: true,
  watchSlidesProgress: true,
  loop: true,
  speed: 400,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  slidesPerView: 'auto',
  centeredSlides: true,
  slideToClickedSlide: true,
  navigation: {
    nextEl: '[data-swiper-button="next"]',
    prevEl: '[data-swiper-button="prev"]',
  },
  autoplay: {
    delay: 4500,
  },
  on: {

    progress(swiper) {
      const scaleStep = 0.175;
      const zIndexMax = swiper.slides.length;
      for (let i = 0; i < swiper.slides.length; i += 1) {
        const slideEl = swiper.slides[i];
        const slideProgress = swiper.slides[i].progress;
        const absProgress = Math.abs(slideProgress);
        let modify = 1;
        if (absProgress > 1) {
          modify = (absProgress - 1) * 0.2 + 1;

        }
        const translate = `${slideProgress * modify * 40}%`;
        const scale = 1 - absProgress * scaleStep;
        const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
        slideEl.style.transform = `translateX(${translate}) scale(${scale})`;
        slideEl.style.zIndex = zIndex;


        if (absProgress > 2.9) {
          slideEl.style.opacity = 0;
        } else {
          slideEl.style.opacity = 1;
        }
      }
    },

    setTransition(swiper, duration) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        const slideEl = swiper.slides[i];
        slideEl.style.transitionDuration = `${duration}ms`;
      }
    },
  },
});



const portfolioSwiper = new Swiper('.ctr_porfolio_slider_wrap.swiper', {

  grabCursor: true,
  watchSlidesProgress: true,
  loop: true,
  speed: 400,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  slidesPerView: 'auto',
  centeredSlides: true,
  slideToClickedSlide: true,
  on: {
    slideChangeTransitionEnd: function () {
      // Loop through all slides
      this.slides.forEach(slide => {
        const item = slide.querySelector(".portfolio_list_item");
        const imgList = slide.querySelector(".portfolio_list_img_list");

        if (slide.classList.contains("swiper-slide-active")) {
          // Remove classes on active slide
          item?.classList.remove("is-vertical");
          imgList?.classList.remove("is-horizontal");
        } else {
          // Add them back on inactive slides
          item?.classList.add("is-vertical");
          imgList?.classList.add("is-horizontal");
        }
      });
    },
  
    progress(portfolioSwiper) {
      const scaleStep = 0.25;
      const zIndexMax = portfolioSwiper.slides.length;
      for (let i = 0; i < portfolioSwiper.slides.length; i += 1) {
        const slideEl = portfolioSwiper.slides[i];
        const slideProgress = portfolioSwiper.slides[i].progress;
        const absProgress = Math.abs(slideProgress);
        let modify = 1;
        if (absProgress > 1) {
          modify = (absProgress - 1) * 0.2 + 1;

        }
        const translate = `${slideProgress * modify * 0}%`;
        const scale = 1 - absProgress * scaleStep;
        const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
        slideEl.style.transform = `translateX(${translate}) scale(${scale})`;
        slideEl.style.zIndex = zIndex;


        if (absProgress > 2.9) {
          slideEl.style.opacity = 0;
        } else {
          slideEl.style.opacity = 1;
        }
      }
    },

    setTransition(portfolioSwiper, duration) {
      for (let i = 0; i < portfolioSwiper.slides.length; i += 1) {
        const slideEl = portfolioSwiper.slides[i];
        slideEl.style.transitionDuration = `${duration}ms`;
      }
    },
  },
});



const init = () => {
  const marquees = document.querySelectorAll('.portfolio_list_img_list');

  if (!marquees.length) {
    return;
  }

  const marqueeInstances = [];

  marquees.forEach((marquee, index) => {
    const duration = 10;
    const marqueeContent = marquee.firstChild;

    if (!marqueeContent) {
      return;
    }

    const numberOfClones = 3; // how many times you want to clone

    for (let i = 0; i < numberOfClones; i++) {
      const clone = marqueeContent.cloneNode(true);
      marquee.append(clone);
    }

    let tween;

    const playMarquee = () => {
      let progress = tween ? tween.progress() : 0;
      tween && tween.progress(0).kill();

      const width = parseInt(
        getComputedStyle(marqueeContent).getPropertyValue("width"),
        10
      );
      const gap = parseInt(
        getComputedStyle(marqueeContent).getPropertyValue("row-gap"),
        10
      );
      const distanceToTranslate = -1 * (gap + width);

      tween = gsap.fromTo(
        marquee.children,
        { y: 0 },
        { y: distanceToTranslate, duration, ease: "none", repeat: -1 }
      );
      tween.progress(progress);
      console.log(`Marquee ${index + 1} width:`, width);
    };

    playMarquee();

    // Store the instance for resize handling
    marqueeInstances.push({
      marquee,
      playMarquee
    });
  });

  function debounce(func) {
    var timer;
    return function (event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(
        () => {
          func();
        },
        500,
        event
      );
    };
  }

  // Handle resize for all marquee instances
  const handleResize = () => {
    marqueeInstances.forEach(instance => {
      instance.playMarquee();
    });
  };

  window.addEventListener("resize", debounce(handleResize));
};

document.addEventListener("DOMContentLoaded", init);

  const createScroll01 = () => {
    const panels = Array.from(document.querySelectorAll(".ctr_trust_blcok"));

    panels.forEach((panel, index) => {
      const isLast = index === panels.length - 1;

      // Skip animation for the last panel
      if (isLast) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
        .to(panel, {
          filter: "blur(10px)",
        scale: 0.8,
        opacity: 0,
        ease: "none",
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    createScroll01();
  });
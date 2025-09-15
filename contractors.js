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

  const zStart = -300; // starting z in dvh
  const zEndBase = 200; // base zEnd in dvh
  const zOffset = 20; // z offset step in dvh
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
          start: `${startTop}% bottom`,
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

const swiperEl = document.querySelector('.ctr_industory_slider_wrap');
const swiper = new Swiper(swiperEl, {
  grabCursor: true,
  watchSlidesProgress: true,
  loop: true,
  speed: 800,
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
      const scaleStep = 0.2;
      const zIndexMax = swiper.slides.length;

      for (let i = 0; i < swiper.slides.length; i++) {
        const slideEl = swiper.slides[i];
        const slideProgress = slideEl.progress;
        const absProgress = Math.abs(slideProgress);

        let modify = 1;
        if (absProgress > 1) {
          modify = (absProgress - 1) * 0.2 + 1;
        }

        const opacityEls = slideEl.querySelectorAll('.cs-card-content');

        // default values
        let translate = slideProgress * modify * 50;
        let scale = 1 - absProgress * scaleStep;
        let zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
        let opacity = absProgress > 1.9 ? 0 : 1;

        // overrides
        if (Math.round(slideProgress) === -2) {
          translate = -120;
          zIndex = 1;
          opacity = 1;
        }
        if (Math.round(slideProgress) === 2) {
          translate = 120;
          zIndex = 1;
          opacity = 1;
        }

        // instead of gsap.to(), use gsap.set() for live smooth updates
        gsap.set(slideEl, {
          xPercent: translate,
          scale: scale,
          opacity: opacity,
          zIndex: zIndex,
        });

        gsap.set(opacityEls, {
          opacity: 1 - absProgress,
        });
      }
    },

    setTransition(swiper, duration) {
      // optional: add easing only when swiper animates between slides
      swiper.slides.forEach((slideEl) => {
        gsap.to(slideEl, {
          duration: duration / 1000, // swiper gives ms, gsap wants sec
          ease: "power2.out",
        });
      });
    },
  },
});
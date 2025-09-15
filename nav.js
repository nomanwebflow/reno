window.addEventListener("DOMContentLoaded", function () {
  // Nav Menu
  // Grab elements
  let menuLink = $(".nav_menu_item");
  let content = $(".nav_dropdown_content");
  let menuBG = $(".nav_menu_bg");
  let dropdownWrap = $(".nav_menu_content");
  let menuArrow = $(".nav_menu_arrow");

  // GSAP default settings
  gsap.defaults({
    duration: 0.3,
    ease: "cubic-bezier(0.47, 0, 0.23, 1.38)",
  });

  // Reveal dropdown (first open)
  function revealDropdown(currentLink, currentContent) {
    dropdownWrap.css("display", "flex");

    // Position arrow under link
    gsap.set(menuArrow, {
      width: currentLink.outerWidth(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Position and size background
    gsap.set(menuBG, {
      width: currentContent.outerWidth(),
      height: currentContent.outerHeight(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Reset all content
    gsap.set(content, { opacity: 0 });

    // Show active content
    gsap.set(currentContent, {
      opacity: 1,
      x: "0rem",
    });
  }

  // Switch dropdown (between links)
  function switchDropdown(currentLink, previousContent, currentContent) {
    // Animate arrow
    gsap.to(menuArrow, {
      width: currentLink.outerWidth(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Animate background
    gsap.to(menuBG, {
      width: currentContent.outerWidth(),
      height: currentContent.outerHeight(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Slide direction logic
    let moveDistance = 2; // slide amount in rem
    if (currentContent.index() < previousContent.index()) {
      moveDistance = -moveDistance;
    }

    // Animate previous content out
    gsap.fromTo(
      previousContent,
      { opacity: 1, x: "0rem" },
      { opacity: 0, x: moveDistance * -1 + "rem", duration: 0.2 }
    );

    // Animate new content in
    gsap.fromTo(
      currentContent,
      { opacity: 0, x: moveDistance + "rem" },
      { opacity: 1, x: "0rem", duration: 0.2 }
    );
  }

  // Dropdown open/close timeline
  let showDropdown = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
      dropdownWrap.css("display", "none");
      menuLink.removeClass("active");
    },
  });

  // Animation when showing dropdown
  showDropdown
    .from(dropdownWrap, { opacity: 0, rotateX: -10, duration: 0.2 })
    .to(menuArrow, { opacity: 1, duration: 0.2 }, "<");

  // Link hover in
  menuLink.on("mouseenter", function () {
    let previousLink = menuLink.filter(".active").removeClass("active");
    let currentLink = $(this).addClass("active");

    let previousContent = content.filter(".active").removeClass("active");
    let currentContent = content.eq($(this).index()).addClass("active");

    showDropdown.play();

    if (previousLink.length === 0) {
      revealDropdown(currentLink, currentContent);
    } else if (previousLink.index() !== currentLink.index()) {
      switchDropdown(currentLink, previousContent, currentContent);
    }
  });

  // Menu hover out (close dropdown)
  $(".nav_menu_wrapper").on("mouseleave", function () {
    showDropdown.reverse();
  });

  // Sub-link hover effect (dim siblings)
  $(".menu_dropdown_link").on("mouseenter mouseleave", function () {
    $(this).siblings(".menu_dropdown_link").toggleClass("low-opacity");
  });
});
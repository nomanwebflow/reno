

document.addEventListener("DOMContentLoaded", () => {
  // Handle basic range sliders with visual styling
  const ranges = document.querySelectorAll('input[type="range"]');

  ranges.forEach((range) => {
    const updateSplit = () => {
      const { min, max, value } = range;
      const percent = ((value - min) / (max - min)) * 100;
      range.style.setProperty("--split", `${percent}%`);
    };

    // Initialize on load
    updateSplit();

    // Update on input
    range.addEventListener("input", updateSplit);
  });

  // Handle general calculator ranges
  const generalWrappers = document.querySelectorAll(
    '[data-calculator-range="wrapper"]'
  );

  generalWrappers.forEach((wrapper) => {
    const range = wrapper.querySelector('[data-calculator="range-input"]');
    const output = wrapper.querySelector('[data-calculator="range-output"]');

    if (!range || !output) return;

    const updateOutput = () => {
      output.textContent = range.value;
    };

    // Initialize display
    updateOutput();

    range.addEventListener("input", updateOutput);
  });

  // Handle kitchen calculator ranges with custom steps
  const kitchenWrappers = document.querySelectorAll(
    '[data-calculator-range="kitchen"]'
  );

  const kitchenAllowedValues = [9, 12, 15, 20, 25];

  kitchenWrappers.forEach((wrapper) => {
    const range = wrapper.querySelector('[data-calculator="range-input"]');
    const output = wrapper.querySelector('[data-calculator="range-output"]');

    if (!range || !output) return;

    const snapToNearestValue = () => {
      const closest = kitchenAllowedValues.reduce((prev, curr) =>
        Math.abs(curr - range.value) < Math.abs(prev - range.value)
          ? curr
          : prev
      );

      range.value = closest;
      output.textContent = closest;
    };

    // Initialize
    snapToNearestValue();

    range.addEventListener("input", snapToNearestValue);
  });

  // Handle bathroom calculator ranges with custom steps
  const bathroomWrappers = document.querySelectorAll(
    '[data-calculator-range="bathroom"]'
  );

  const bathroomAllowedValues = [5, 10, 15, 20, 25];

  bathroomWrappers.forEach((wrapper) => {
    const range = wrapper.querySelector('[data-calculator="range-input"]');
    const output = wrapper.querySelector('[data-calculator="range-output"]');

    if (!range || !output) return;

    const snapToNearestValue = () => {
      const closest = bathroomAllowedValues.reduce((prev, curr) =>
        Math.abs(curr - range.value) < Math.abs(prev - range.value)
          ? curr
          : prev
      );

      range.value = closest;
      output.textContent = closest;
    };

    // Initialize
    snapToNearestValue();

    range.addEventListener("input", snapToNearestValue);
  });

  // Handle menu tab synchronization
  const menuElements = document.querySelectorAll(".calc_tabs_menu");
  const menuHidden = document.querySelector(".calc_tabs_hidden");

  if (menuElements.length && menuHidden) {
    const menuHiddenItems = Array.from(menuHidden.children);

    menuElements.forEach((menu) => {
      const menuItems = Array.from(menu.children);

      menuItems.forEach((item, index) => {
        item.addEventListener("click", (e) => {
          // Prevent default behavior if needed
          e.preventDefault();

          // Mirror the click to hidden menu
          if (menuHiddenItems[index]) {
            menuHiddenItems[index].click();
          }
        });
      });
    });
  }
});
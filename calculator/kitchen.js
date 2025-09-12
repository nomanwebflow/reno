
document.addEventListener("DOMContentLoaded", () => {
  const instance = document.querySelector('[data-calc-instance="kitchen"]');

  if (!instance) return;

  const rangeInput = instance.querySelector('[data-calculator="range-input"]');
  const rangeOutput = instance.querySelector(
    '[data-calculator="range-output"]'
  );
  const form = instance.querySelector("form");
  const calcButton = form.querySelector(".clickable_btn");

  // update range UI
  if (rangeInput && rangeOutput) {
    rangeInput.addEventListener("input", () => {
      rangeOutput.textContent = rangeInput.value;
    });
  }

  function getFormData() {
    const data = { type: "KITCHEN" };

    // dimensions (from range)
    data.dimensions = parseFloat(rangeInput.value);

    // layout (radio)
    const layout = form.querySelector('input[name="layout"]:checked');
    if (layout) data.layout = layout.value;

    // budget (radio)
    const budget = form.querySelector('input[name="budget"]:checked');
    if (budget) data.budget = budget.value;

    // inclusions (checkboxes)
    data.cabinets = {
      included: form.querySelector('input[name="cabinets"]').checked,
    };
    data.island = form.querySelector('input[name="island"]').checked;
    data.newfloor = form.querySelector('input[name="newfloor"]').checked;
    data.mep = form.querySelector('input[name="mep"]').checked;
    data.newAppliance = form.querySelector(
      'input[name="newAppliance"]'
    ).checked;
    data.newDoor = form.querySelector('input[name="newDoor"]').checked;

    // countertop checkbox
    data.countertop = {
      included: form.querySelector('input[name="countertop"]').checked,
      wrapping: false,
    };

    return data;
  }

  async function calculate() {
    const payload = getFormData();
    console.log("Payload:", payload);

    // Get the results wrapper and set loading state
    const resultsWrapper = instance.querySelector(
      '[data-calc-results="wrapper"]'
    );
    if (resultsWrapper) {
      resultsWrapper.classList.add("loading");
      resultsWrapper.classList.remove("empty");
    }

    try {
      const res = await fetch(
        "https://reno-core-api-test.azurewebsites.net/api/v2/price",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("API Response:", data);

      if (Array.isArray(data.plans)) {
        data.plans.forEach((plan) => {
          const block = instance.querySelector(
            `[data-calc-results-months="${plan.months}"]`
          );
          if (block) {
            block.querySelector(
              '[data-calc-results="totalAmount"]'
            ).textContent = plan.totalAmount.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            });
            block.querySelector(
              '[data-calc-results="downPayment"]'
            ).textContent = plan.downPayment.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            });
            block.querySelector(
              '[data-calc-results="installments"]'
            ).textContent = plan.installments.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            });
            block.querySelector(
              '[data-calc-results="moveInPayment"]'
            ).textContent = plan.moveInPayment.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            });
          }
        });
      }
    } catch (err) {
      console.error("Error fetching price:", err);
      alert("Something went wrong while fetching the estimate.");
      // Add empty class back if response is not received
      if (resultsWrapper) {
        resultsWrapper.classList.add("empty");
      }
    } finally {
      // Remove loading state when API call completes (success or error)
      if (resultsWrapper) {
        resultsWrapper.classList.remove("loading");
      }
    }
  }

  // calculate on button click
  calcButton.addEventListener("click", calculate);
});
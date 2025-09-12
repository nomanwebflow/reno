
// bathroom

document.addEventListener("DOMContentLoaded", () => {
  const instance = document.querySelector('[data-calc-instance="bathroom"]');
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
    const data = { type: "BATHROOM" };

    // dimensions (from range)
    data.dimensions = parseFloat(rangeInput.value);

    // layout (radio, optional fallback)
    const layout = form.querySelector('input[name="layout"]:checked');
    if (layout) data.layout = layout.value;
    else data.layout = "PIECE_3";

    // budget (radio, fallback ECONOMIC)
    const budget = form.querySelector('input[name="budget"]:checked');
    data.budget = budget ? budget.value : "ECONOMIC";

    // booleans
    data.mep = form.querySelector('input[name="mep"]').checked;
    data.newDoor = form.querySelector('input[name="newDoor"]').checked;
    data.newLayout = form.querySelector('input[name="newLayout"]').checked;
    data.newfloor = form.querySelector('input[name="newfloor"]').checked;

    // cabinets object (required)
    data.cabinets = {
      included: form.querySelector('input[name="cabinets"]').checked,
      wrapping: false,
      mep: data.mep,
    };

    // countertop object (required)
    data.countertop = {
      included: form.querySelector('input[name="countertop"]').checked,
      wrapping: false,
      mep: data.mep,
    };

    return data;
  }

  async function calculate() {
    const payload = getFormData();
    console.log("Bathroom Payload:", payload);

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

      if (!res.ok) {
        const errText = await res.text();
        console.error("API error details:", errText);
        throw new Error(`HTTP ${res.status}`);
      }

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
      alert("Something went wrong while fetching the bathroom estimate.");
      if (resultsWrapper) {
        resultsWrapper.classList.add("empty");
      }
    } finally {
      if (resultsWrapper) {
        resultsWrapper.classList.remove("loading");
      }
    }
  }

  calcButton.addEventListener("click", calculate);
});
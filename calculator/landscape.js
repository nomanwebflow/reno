
// Landscape
document.addEventListener("DOMContentLoaded", () => {
  const instance = document.querySelector('[data-calc-instance="landscape"]');
  if (!instance) return;

  const form = instance.querySelector("form");
  const numberInput = instance.querySelector('input[type="number"]');
  const calcButton = instance.querySelector(".clickable_btn");
  const resultsWrapper = instance.querySelector(
    '[data-calc-results="wrapper"]'
  );

  function formatNumber(num) {
    return Math.round(num).toLocaleString();
  }

  async function calculate() {
    if (!form || !resultsWrapper) return;

    resultsWrapper.classList.remove("empty");
    resultsWrapper.classList.add("loading");

    const formData = new FormData(form);
    const payload = {
      area: parseInt(numberInput.value) || 0,
      budget: formData.get("budget") || "ECONOMIC",
      tiles: formData.has("tiles"),
      pool: formData.has("pool"),
      seating: formData.has("seating"),
      bar: formData.has("bar"),
      oven: formData.has("oven"),
      grill: formData.has("grill"),
      fridge: formData.has("fridge"),
      pergola: formData.has("pergola"),
      trees: formData.has("trees"),
      lighting: formData.has("lighting"),
      artificialGrass: formData.has("artificialGrass"),
    };

    console.log("Landscape Payload:", payload);

    try {
      const res = await fetch(
        "https://reno-core-api-test.azurewebsites.net/api/v2/price/landscape",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("API Response:", data);

      resultsWrapper.classList.remove("loading");

      if (Array.isArray(data.plans)) {
        const plansEls = resultsWrapper.querySelectorAll(
          "[data-calc-results-months]"
        );
        plansEls.forEach((planEl) => {
          const months = parseInt(
            planEl.getAttribute("data-calc-results-months")
          );
          const planData = data.plans.find((p) => p.months === months);

          if (planData) {
            planEl.querySelector(
              '[data-calc-results="totalAmount"]'
            ).textContent = formatNumber(planData.totalAmount);
            planEl.querySelector(
              '[data-calc-results="downPayment"]'
            ).textContent = formatNumber(planData.downPayment);
            planEl.querySelector(
              '[data-calc-results="installments"]'
            ).textContent = formatNumber(planData.installments);
            planEl.querySelector(
              '[data-calc-results="moveInPayment"]'
            ).textContent = formatNumber(planData.moveInPayment);
          }
        });
      }
    } catch (err) {
      console.error("Error fetching landscape price:", err);
      resultsWrapper.classList.remove("loading");
      resultsWrapper.classList.add("empty");
    }
  }

  if (calcButton) {
    calcButton.addEventListener("click", calculate);
  }
});

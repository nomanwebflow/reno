
// Vila
document.addEventListener("DOMContentLoaded", () => {
  const instance = document.querySelector('[data-calc-instance="vila"]');
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
      type: "HOME_RENOVATION",
      dimensions: parseInt(numberInput.value) || 0,
      newLayout: formData.has("newLayout"),
      plumbing: formData.has("plumbing"),
      electrical: formData.has("electrical"),
      lighting: formData.has("lighting"),
      budget: formData.get("budget"),
      kitchen: { included: formData.has("kitchen") },
      bathroom: { included: formData.has("bathroom") },
    };

    console.log("Vila Payload:", payload);

    try {
      const res = await fetch(
        "https://reno-core-api-test.azurewebsites.net/api/v2/price/home",
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
      console.error("Error fetching vila price:", err);
      resultsWrapper.classList.remove("loading");
      resultsWrapper.classList.add("empty");
    }
  }

  if (calcButton) {
    calcButton.addEventListener("click", calculate);
  }
});
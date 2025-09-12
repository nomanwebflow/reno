// Commercial
document.addEventListener("DOMContentLoaded", () => {
  const scope = document.querySelector('[data-calc-instance="comercial"]');
  if (!scope) return;

  const form = scope.querySelector("form");
  const numberInput = scope.querySelector('input[type="number"]');
  const resultsWrapper = scope.querySelector('[data-calc-results="wrapper"]');
  const calcBtn = scope.querySelector(".button_main_wrap .clickable_btn");

  const formatNumber = (num) => Math.round(num).toLocaleString("en-US");

  async function handleCalculate(e) {
    e.preventDefault();
    if (!resultsWrapper) return;

    resultsWrapper.classList.remove("empty");
    resultsWrapper.classList.add("loading");

    const size = parseFloat(numberInput.value) || 0;
    const budget =
      form.querySelector("input[name='budget']:checked")?.value || "ECONOMIC";
    const type =
      form.querySelector("input[name='type']:checked")?.value || "core";

    const payload = {
      size,
      budget,
      core: type === "core",
      fitted: type === "fitted",
      kitchen: form.querySelector("input[name='kitchen']").checked,
      bathroom: form.querySelector("input[name='bathroom']").checked,
      office: form.querySelector("input[name='office']").checked,
      layoutChange: form.querySelector("input[name='layoutChange']").checked,
      reception: form.querySelector("input[name='reception']").checked,
      conferenceRoom: form.querySelector("input[name='conferenceRoom']")
        .checked,
      meetingRoom: form.querySelector("input[name='meetingRoom']").checked,
    };

    try {
      const res = await fetch(
        "https://reno-core-api-test.azurewebsites.net/api/v2/price/commercial",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      console.log("API Response:", data);

      if (data?.plans) {
        data.plans.forEach((plan) => {
          const planWrapper = resultsWrapper.querySelector(
            `[data-calc-results-months="${plan.months}"]`
          );
          if (!planWrapper) return;

          const totalAmount = planWrapper.querySelector(
            '[data-calc-results="totalAmount"]'
          );
          const downPayment = planWrapper.querySelector(
            '[data-calc-results="downPayment"]'
          );
          const installments = planWrapper.querySelector(
            '[data-calc-results="installments"]'
          );
          const moveInPayment = planWrapper.querySelector(
            '[data-calc-results="moveInPayment"]'
          );

          if (totalAmount)
            totalAmount.textContent = formatNumber(plan.totalAmount);
          if (downPayment)
            downPayment.textContent = formatNumber(plan.downPayment);
          if (installments)
            installments.textContent = formatNumber(plan.installments);
          if (moveInPayment)
            moveInPayment.textContent = formatNumber(plan.moveInPayment);
        });
      }

      resultsWrapper.classList.remove("loading");
    } catch (err) {
      console.error("API error details:", err);
      resultsWrapper.classList.remove("loading");
      resultsWrapper.classList.add("empty");
    }
  }

  if (calcBtn) {
    calcBtn.addEventListener("click", handleCalculate);
  }
});
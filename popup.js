document.addEventListener("DOMContentLoaded", () => {
  const countEl = document.getElementById("count");
  const resetBtn = document.getElementById("reset");

  chrome.storage.local.get("filteredCount", (data) => {
    countEl.textContent = data.filteredCount || 0;
  });

  resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({ filteredCount: 0 }, () => {
      countEl.textContent = "0";
    });
  });
});

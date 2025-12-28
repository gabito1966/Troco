const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("currency");

const rateInputs = {
  ARS: document.getElementById("usdToArs"),
  BRL: document.getElementById("usdToBrl"),
  PYG: document.getElementById("usdToPyg"),
};

const resultIds = {
  USD: "resUsd",
  ARS: "resArs",
  BRL: "resBrl",
  PYG: "resPyg",
};

const STORAGE_KEY = "exchangeRates";

// ===============================
// LOCAL STORAGE
// ===============================
function saveRates() {
  const rates = {
    ARS: parseFloat(rateInputs.ARS.value),
    BRL: parseFloat(rateInputs.BRL.value),
    PYG: parseFloat(rateInputs.PYG.value),
    updated: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
}

function loadRates() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  const rates = JSON.parse(saved);

  rateInputs.ARS.value = rates.ARS ?? "";
  rateInputs.BRL.value = rates.BRL ?? "";
  rateInputs.PYG.value = rates.PYG ?? "";
}

// ===============================
// CONVERSIÓN
// ===============================
function convert() {
  const amount = parseFloat(amountInput.value);
  const currency = currencySelect.value;

  const ars = parseFloat(rateInputs.ARS.value);
  const brl = parseFloat(rateInputs.BRL.value);
  const pyg = parseFloat(rateInputs.PYG.value);

  if ([amount, ars, brl, pyg].some(isNaN)) {
    clearResults();
    return;
  }

  let usd;
  switch (currency) {
    case "USD": usd = amount; break;
    case "ARS": usd = amount / ars; break;
    case "BRL": usd = amount / brl; break;
    case "PYG": usd = amount / pyg; break;
  }

  document.getElementById("resUsd").textContent = usd.toFixed(2);
  document.getElementById("resArs").textContent = (usd * ars).toFixed(0);
  document.getElementById("resBrl").textContent = (usd * brl).toFixed(2);
  document.getElementById("resPyg").textContent = (usd * pyg).toFixed(0);
}

// ===============================
// UTIL
// ===============================
function clearResults() {
  Object.values(resultIds).forEach(
    id => document.getElementById(id).textContent = "-"
  );
}

// ===============================
// EVENTOS
// ===============================
amountInput.addEventListener("input", convert);
currencySelect.addEventListener("change", convert);

Object.values(rateInputs).forEach(input => {
  input.addEventListener("input", () => {
    saveRates();
    convert();
  });
});

// ===============================
// INIT
// ===============================
loadRates();
convert();

// ===============================
// SERVICE WORKER
// ===============================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.log('Error registrando SW', err));
}
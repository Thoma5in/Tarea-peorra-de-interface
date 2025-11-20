const input = document.getElementById("userInput");
const btn = document.getElementById("generateBtn");
const errorMsg = document.getElementById("errorMsg");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const examples = document.querySelectorAll(".example");

function showError() {
  errorMsg.classList.remove("hidden");
  resultBox.classList.add("hidden");
}

function showResult(text) {
  resultText.textContent = text;
  resultBox.classList.remove("hidden");
  errorMsg.classList.add("hidden");
}

// Generar idea (simulado) con pequeña animación de carga
function generateIdea() {
  const value = input.value.trim();

  if (value === "") {
    showError();
    return;
  }

  // Indicar carga
  btn.disabled = true;
  btn.classList.add("loading");
  btn.textContent = "Generando...";

  setTimeout(() => {
    // Mock de respuesta
    const idea = `¡Idea lista! Esta propuesta nace de tu solicitud: "${value}". Puedes desarrollarla en 3 pasos: 1) Validar; 2) Prototipar; 3) Presentar.`;
    showResult(idea);

    // Restaurar estado del botón
    btn.disabled = false;
    btn.classList.remove("loading");
    btn.textContent = "Generar Idea";
  }, 700);
}

// Click en CTA
btn.addEventListener("click", generateIdea);

// Enter para enviar
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generateIdea();
});

// Rellenar input desde ejemplos
examples.forEach((el) => {
  el.addEventListener("click", () => {
    input.value = el.dataset.example || el.textContent;
    generateIdea();
  });
});

// Copiar resultado al portapapeles
copyBtn.addEventListener("click", async () => {
  const text = resultText.textContent;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const original = copyBtn.textContent;
    copyBtn.textContent = "Copiado ✓";
    setTimeout(() => (copyBtn.textContent = original), 1200);
  } catch (err) {
    // silencioso: no hay soporte
    copyBtn.textContent = "No disponible";
    setTimeout(() => (copyBtn.textContent = "Copiar"), 1200);
  }
});
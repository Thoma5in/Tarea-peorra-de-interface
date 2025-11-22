import { generateIdea as generateIdeaAPI } from './iaConnection.js';

const input = document.getElementById("userInput");
const btn = document.getElementById("generateBtn");
const errorMsg = document.getElementById("errorMsg");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const examples = document.querySelectorAll(".example");

// Cargar configuración de instrucciones
let instructionsConfig = null;

async function loadInstructions() {
  try {
    const response = await fetch('./instruccions.json');
    instructionsConfig = await response.json();
  } catch (error) {
    console.error("Error al cargar instrucciones:", error);
    // Fallback a instrucciones por defecto
    instructionsConfig = {
      systemInstructions: "Eres una mini-aplicación de IA llamada 'IdeaBoost', que ayuda a los usuarios a generar ideas creativas.",
      model: "gpt-4o-mini",
      reasoningEffort: "low"
    };
  }
}

// Cargar instrucciones al inicio
loadInstructions();

function showError(message = "No pude generar una idea. Escribe algo e inténtalo de nuevo.") {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
  resultBox.classList.add("hidden");
}

function showResult(text) {
  resultText.textContent = text;
  resultBox.classList.remove("hidden");
  errorMsg.classList.add("hidden");
}

// Generar idea usando la API real de OpenAI
async function generateIdea() {
  const value = input.value.trim();

  if (value === "") {
    showError();
    return;
  }

  // Indicar carga
  btn.disabled = true;
  btn.classList.add("loading");
  btn.textContent = "Generando...";

  try {
    // Llamar a la API real de OpenAI
    const idea = await generateIdeaAPI(value, instructionsConfig);
    showResult(idea);
  } catch (error) {
    console.error("Error:", error);
    showError("Hubo un error al generar la idea. Por favor, intenta de nuevo.");
  } finally {
    // Restaurar estado del botón
    btn.disabled = false;
    btn.classList.remove("loading");
    btn.textContent = "Generar Idea";
  }
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
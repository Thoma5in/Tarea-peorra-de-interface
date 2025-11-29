import { generateIdea as generateIdeaAPI } from './iaConnection.js';

// Elementos del DOM
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");
const exampleChips = document.querySelectorAll(".example-chip");
const themeToggle = document.getElementById("themeToggle");

// ===== TEMA OSCURO/CLARO =====
// Cargar tema guardado o usar preferencia del sistema
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark-mode');
}

// Toggle de tema
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

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

// Función para agregar un mensaje al chat
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  const textP = document.createElement("p");
  textP.textContent = text;

  contentDiv.appendChild(textP);
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);

  // Scroll automático al último mensaje
  scrollToBottom();
}

// Función para mostrar indicador de escritura
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message typing-indicator";
  typingDiv.id = "typingIndicator";

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    contentDiv.appendChild(dot);
  }

  typingDiv.appendChild(contentDiv);
  chatMessages.appendChild(typingDiv);
  scrollToBottom();
}

// Función para ocultar indicador de escritura
function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Función para scroll automático
function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

// Función principal para enviar mensaje
async function sendMessage() {
  const value = input.value.trim();

  if (value === "") {
    // Mostrar feedback visual de error
    input.classList.add('input-error');
    input.placeholder = "Por favor, escribe un mensaje antes de enviar";

    // Remover el error después de 2 segundos
    setTimeout(() => {
      input.classList.remove('input-error');
      input.placeholder = "Escribe tu mensaje aquí...";
    }, 2000);

    return;
  }

  // Agregar mensaje del usuario
  addMessage(value, true);

  // Limpiar input
  input.value = "";

  // Deshabilitar botón e input mientras se procesa
  sendBtn.disabled = true;
  input.disabled = true;

  // Mostrar indicador de escritura
  showTypingIndicator();

  try {
    // Llamar a la API real de OpenAI
    const idea = await generateIdeaAPI(value, instructionsConfig);

    // Ocultar indicador de escritura
    hideTypingIndicator();

    // Agregar respuesta del asistente
    addMessage(idea, false);
  } catch (error) {
    console.error("Error:", error);

    // Ocultar indicador de escritura
    hideTypingIndicator();

    // Mostrar mensaje de error
    addMessage("Lo siento, hubo un error al generar la idea. Por favor, intenta de nuevo.", false);
  } finally {
    // Rehabilitar botón e input
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);

// Enter para enviar
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Rellenar input desde ejemplos
exampleChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const example = chip.dataset.example;
    input.value = example;
    sendMessage();
  });
});

// Focus en el input al cargar
window.addEventListener("load", () => {
  input.focus();
});
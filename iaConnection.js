import OpenAI from "openai";

// Crear instancia de OpenAI
// Nota: En un entorno de producción real, las llamadas a la API deberían hacerse desde un backend
// para no exponer la API Key. Para este prototipo, habilitamos el uso en navegador.
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function generateIdea(userInput, config) {
    try {
        const response = await openai.chat.completions.create({
            model: config.model || "gpt-4o-mini",
            messages: [
                { role: "system", content: config.systemInstructions },
                { role: "user", content: userInput }
            ],
            store: false,
        });

        // Nuevo: mostrar en consola qué modelo respondió (si la respuesta lo indica) o el modelo solicitado
        console.log("Modelo de IA que respondió:", response.model ?? config.model ?? "modelo desconocido");

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error al generar idea:", error);
        throw new Error("No se pudo generar la idea. Por favor, intenta de nuevo.");
    }
}

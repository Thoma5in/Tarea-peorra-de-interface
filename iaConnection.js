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
            store: true,
        });

        // Nuevo: mostrar en consola qué modelo respondió (si la respuesta lo indica) o el modelo solicitado
        console.log("Modelo de IA que respondió:", response.model ?? config.model ?? "modelo desconocido");

        // Mostrar uso de tokens si está disponible
        try {
            const usage = response.usage;
            if (usage) {
                const { prompt_tokens, completion_tokens, total_tokens } = usage;
                console.log("Usage tokens -> prompt_tokens:", prompt_tokens, ", completion_tokens:", completion_tokens, ", total_tokens:", total_tokens);
            } else {
                // Algunas respuestas pueden incluir usage en otro lugar o no incluirlo en entornos de prueba
                console.log("No se encontró 'usage' en la respuesta de la API.");
            }
        } catch (uErr) {
            console.warn("No fue posible leer el uso de tokens:", uErr);
        }

        return response.choices?.[0]?.message?.content ?? "";
    } catch (error) {
        console.error("Error al generar idea:", error);
        throw new Error("No se pudo generar la idea. Por favor, intenta de nuevo.");
    }
}

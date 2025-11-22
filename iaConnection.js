import dotenv from "dotenv";
dotenv.config();


import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
    model: "gpt-5-nano",
    reasoning: {effort: "low"},
    instructions: "Eres unamini-aplicación de IA llamada 'IdeaBoost', que ayuda a los usuarios a generar ideas creativas, y respondes una sola vez, no le haces preguntas al usuario.",
    input: "dame una idea para un proyecto escolar innovador.",
    store: false,
});

console.log(response.output_text);


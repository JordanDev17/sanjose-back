// src/controllers/chatbot.controller.js
// Cambia 'questionsChatbot' por 'questionChatbot' (en singular)
import questionChatbot from '../questionsChatbot.js';


/**
 * Maneja las solicitudes del chatbot basado en opciones preestablecidas.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const getChatbotResponse = (req, res) => {
    const selectedOption = req.body.option;
    let responseData = null;

    if (!selectedOption || selectedOption === "main_menu") {
        responseData = questionChatbot["main_menu"]; // Usa questionChatbot
    } else {
        const currentContext = questionChatbot[selectedOption]; // Usa questionChatbot

        if (currentContext) {
            if (currentContext.message && currentContext.options) {
                responseData = currentContext;
            } else if (questionChatbot["main_menu"].options.find(opt => opt.value === selectedOption)) { // Usa questionChatbot
                responseData = currentContext;
            }
        } else {
            let foundAnswer = false;
            for (const key in questionChatbot) { // Usa questionChatbot
                if (questionChatbot[key].answers && questionChatbot[key].answers[selectedOption]) { // Usa questionChatbot
                    responseData = {
                        message: questionChatbot[key].answers[selectedOption], // Usa questionChatbot
                        options: [{ text: "Volver al Menú Principal", value: "main_menu" }]
                    };
                    foundAnswer = true;
                    break;
                }
            }
            if (!foundAnswer) {
                console.warn(`Opción desconocida recibida: ${selectedOption}`);
                responseData = {
                    message: "Lo siento, la opción seleccionada no es válida. Por favor, elige una de las opciones disponibles.",
                    options: questionChatbot["main_menu"].options // Usa questionChatbot
                };
            }
        }
    }

    if (!responseData) {
        console.error(`Error: No se pudo generar respuesta para la opción ${selectedOption}. Devolviendo menú principal.`);
        responseData = questionChatbot["main_menu"]; // Usa questionChatbot
    }

    res.status(200).json({
        message: responseData.message,
        options: responseData.options
    });
};
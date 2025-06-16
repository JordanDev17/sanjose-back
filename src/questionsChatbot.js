// src/knowledgeBase.js

const questionChatbot = {
    // Menú principal
    "main_menu": {
        message: "¡Hola! Soy tu asistente virtual del Parque Industrial [Nombre del Parque]. Por favor, selecciona una opción para comenzar:",
        options: [
            { text: "Historia y Visión del Parque", value: "historia" },
            { text: "Ubicación del Parque", value: "ubicacion" },
            { text: "Servicios e Infraestructura", value: "servicios" },
            { text: "Información de Contacto", value: "contacto" },
            { text: "Preguntas Frecuentes", value: "faq" }, // Nueva sección
            { text: "Salir / Finalizar Chat", value: "exit" }
        ]
    },

    // Sub-menú o respuesta para "Historia"
    "historia": {
        message: "Has seleccionado 'Historia y Visión'. ¿Qué te gustaría saber específicamente?",
        options: [
            { text: "Historia y Fundación", value: "historia_fundacion" },
            { text: "Misión y Visión", value: "historia_vision" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        // Respuestas directas asociadas a esta sección si no hay más submenús
        answers: {
            "historia_fundacion": "El Parque Industrial [Nombre del Parque] fue fundado en el año 1995, con el objetivo de impulsar el desarrollo económico de la región y ofrecer un espacio estratégico para empresas. Su visión ha sido siempre la de ser un polo de desarrollo y un ejemplo de infraestructura industrial moderna en Colombia.",
            "historia_vision": "Nuestra misión es proveer un entorno industrial de vanguardia que impulse la competitividad de nuestras empresas. Nuestra visión es ser el parque industrial líder en Latinoamérica, reconocido por su innovación, sostenibilidad y contribución al desarrollo económico regional."
        }
    },

    // Sub-menú o respuesta para "Ubicación"
    "ubicacion": {
        message: "Has seleccionado 'Ubicación'.",
        options: [
            { text: "Ver Dirección Exacta", value: "ubicacion_direccion" },
            { text: "Ver en Google Maps", value: "ubicacion_mapa" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "ubicacion_direccion": "El Parque Industrial [Nombre del Parque] se encuentra estratégicamente ubicado en la Calle 123 #45-67, Ciudad, Departamento, Colombia. Estamos a pocos kilómetros de las principales vías de acceso (Autopista Sur/Norte) y del Aeropuerto Internacional El Dorado.",
            "ubicacion_mapa": "Puedes ver nuestra ubicación exacta en Google Maps aquí: [Link a Google Maps. Ej: https://maps.app.goo.gl/XYZABC]. Simplemente haz clic en el enlace."
        }
    },

    // Sub-menú o respuesta para "Servicios"
    "servicios": {
        message: "Has seleccionado 'Servicios e Infraestructura'. ¿Qué tipo de servicio te interesa?",
        options: [
            { text: "Infraestructura General", value: "servicios_infraestructura" },
            { text: "Seguridad y Vigilancia", value: "servicios_seguridad" },
            { text: "Suministro de Energía", value: "servicios_energia" },
            { text: "Telecomunicaciones", value: "servicios_telecomunicaciones" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "servicios_infraestructura": "Ofrecemos una infraestructura moderna que incluye vías internas pavimentadas, alumbrado público, zonas de carga y descarga, y espacios verdes bien mantenidos.",
            "servicios_seguridad": "Contamos con vigilancia privada 24/7, control de acceso vehicular y peatonal, sistema de cámaras de seguridad (CCTV) con monitoreo constante y patrullajes internos.",
            "servicios_energia": "Garantizamos un suministro de energía eléctrica estable y de alta capacidad, con subestaciones internas y opciones de respaldo para asegurar la continuidad operativa de las empresas.",
            "servicios_telecomunicaciones": "Acceso a servicios de telecomunicaciones de última generación, incluyendo fibra óptica de alta velocidad, para asegurar la conectividad de su empresa."
        }
    },

    // Sub-menú o respuesta para "Contacto"
    "contacto": {
        message: "Has seleccionado 'Información de Contacto'. ¿Cómo te gustaría contactarnos?",
        options: [
            { text: "Teléfono de Contacto", value: "contacto_telefono" },
            { text: "Correo Electrónico", value: "contacto_email" },
            { text: "Programar una Visita", value: "contacto_visita" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "contacto_telefono": "Puedes contactarnos directamente a través de nuestro teléfono principal: +57 1 8000 123456. Nuestro horario de atención telefónica es de Lunes a Viernes de 8:00 AM a 5:00 PM.",
            "contacto_email": "Para consultas por correo electrónico, por favor escríbenos a info@[nombreparque].com. Intentaremos responderte en menos de 24 horas hábiles.",
            "contacto_visita": "Si deseas programar una visita a nuestras instalaciones, te recomendamos contactarnos telefónicamente o por correo electrónico para coordinar una cita previa y asegurarte la mejor atención."
        }
    },

    // Nueva sección: Preguntas Frecuentes
    "faq": {
        message: "Has seleccionado 'Preguntas Frecuentes'. Aquí tienes algunas de las consultas más comunes:",
        options: [
            { text: "¿Cuáles son los requisitos para instalar una empresa?", value: "faq_requisitos" },
            { text: "¿Hay espacios disponibles para alquiler o venta?", value: "faq_disponibilidad" },
            { text: "¿El parque cuenta con facilidades de transporte público?", value: "faq_transporte" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "faq_requisitos": "Los requisitos para instalar una empresa incluyen: registro legal, licencias ambientales, cumplimiento de normativas de construcción y operación, y aprobación de nuestro comité. Te invitamos a contactar a nuestro equipo comercial para más detalles.",
            "faq_disponibilidad": "Sí, contamos con espacios disponibles para alquiler y venta, tanto lotes para construcción a la medida como bodegas o naves industriales ya construidas. La disponibilidad varía, por favor, consulta con nuestro equipo comercial.",
            "faq_transporte": "El parque industrial cuenta con rutas de transporte público cercanas y accesos facilitados para buses y vans. Además, estamos evaluando opciones de transporte interno para comodidad de los empleados."
        }
    },

    // Respuesta para salir del chat
    "exit": {
        message: "Gracias por usar nuestro asistente virtual. Si tienes más preguntas, no dudes en volver. ¡Hasta pronto!",
        options: [] // No hay opciones después de salir
    }


};

export default questionChatbot;
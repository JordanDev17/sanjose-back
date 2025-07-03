// src/knowledgeBase.js

const questionChatbot = {
    // Menú principal
    "main_menu": {
        message: "¡Hola! Soy tu asistente virtual del Parque Industrial San José. Por favor, selecciona una opción para comenzar:",
        options: [
            { text: "Historia y Visión del Parque", value: "historia" },
            { text: "Ubicación y Accesos", value: "ubicacion" },
            { text: "Servicios e Infraestructura", value: "servicios" },
            { text: "Información de Contacto", value: "contacto" },
            { text: "Preguntas Frecuentes", value: "faq" },
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
        answers: {
            "historia_fundacion": "El Parque Industrial San José fue fundado en el año 2005, visionado como un epicentro logístico e industrial clave para la Sabana de Occidente. Desde su concepción, ha crecido hasta convertirse en un referente de eficiencia y modernidad, facilitando la operación de empresas nacionales e internacionales gracias a su ubicación estratégica.",
            "historia_vision": "Nuestra misión es proveer un ecosistema industrial de vanguardia en la Sabana de Occidente, impulsando la productividad y el crecimiento sostenible de las empresas que nos eligen. Nuestra visión es consolidarnos como el parque industrial líder en Colombia, reconocido por su excelencia operativa, compromiso ambiental y contribución al desarrollo socioeconómico de la región Cundinamarca."
        }
    },

    // Sub-menú o respuesta para "Ubicación"
    "ubicacion": {
        message: "Has seleccionado 'Ubicación y Accesos'.",
        options: [
            { text: "Ver Dirección Exacta", value: "ubicacion_direccion" },
            { text: "Conexión Estratégica", value: "ubicacion_conexion" },
            { text: "Ver en Google Maps", value: "ubicacion_mapa" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "ubicacion_direccion": "El Parque Industrial San José se localiza estratégicamente en la Vía Funza-Siberia, Km 2.5, en el municipio de Funza, Cundinamarca, Colombia. Este punto ofrece una conexión directa con las principales arterias de transporte de la región.",
            "ubicacion_conexion": "Nuestra ubicación en la Vía Funza-Siberia es ideal: estamos a solo 15 minutos del Aeropuerto Internacional El Dorado, con acceso directo a la Calle 80 (Bogotá-Medellín) y a pocos kilómetros de la Autopista Sur (Corredor Bogotá-Girardot), facilitando la logística y distribución a nivel nacional e internacional.",
            "ubicacion_mapa": "Puedes ver nuestra ubicación exacta en Google Maps y trazar tu ruta aquí: [https://maps.app.goo.gl/EJZzK4Z4Q7XpY7Xp7]. Simplemente haz clic en el enlace para abrir el mapa."
        }
    },

    // Sub-menú o respuesta para "Servicios"
    "servicios": {
        message: "Has seleccionado 'Servicios e Infraestructura'. ¿Qué tipo de servicio te interesa?",
        options: [
            { text: "Infraestructura General", value: "servicios_infraestructura" },
            { text: "Seguridad y Vigilancia", value: "servicios_seguridad" },
            { text: "Suministro de Energía y Agua", value: "servicios_suministros" },
            { text: "Telecomunicaciones de Última Generación", value: "servicios_telecomunicaciones" },
            { text: "Gestión Ambiental y Sostenibilidad", value: "servicios_ambiental" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "servicios_infraestructura": "Ofrecemos una infraestructura moderna de alta calidad: vías internas de doble carril totalmente pavimentadas, amplias zonas de maniobra y parqueo, alumbrado LED en todo el complejo, y una red de acueducto y alcantarillado optimizada para uso industrial.",
            "servicios_seguridad": "La seguridad es nuestra prioridad. Contamos con un equipo de vigilancia privada 24/7, monitoreo centralizado con más de 150 cámaras CCTV de alta definición, control de acceso biométrico para vehículos y personal, y rondas perimetrales constantes. Tu inversión y operaciones están protegidas.",
            "servicios_suministros": "Garantizamos un suministro robusto de energía eléctrica con subestaciones propias de alta capacidad (hasta 34.5 kV) y respaldo, minimizando interrupciones. Además, el abastecimiento de agua potable y la gestión de aguas residuales cumplen con los más altos estándares normativos.",
            "servicios_telecomunicaciones": "Acceso a una red de fibra óptica dedicada con múltiples proveedores y redundancia, asegurando conectividad de internet de alta velocidad y telefonía IP confiable para todas tus operaciones, fundamental para la industria 4.0.",
            "servicios_ambiental": "Comprometidos con la sostenibilidad, implementamos programas de gestión de residuos sólidos, optimización del uso del agua y eficiencia energética. Contamos con certificaciones ambientales y promovemos prácticas responsables entre nuestras empresas."
        }
    },

    // Sub-menú o respuesta para "Contacto"
    "contacto": {
        message: "Has seleccionado 'Información de Contacto'. ¿Cómo te gustaría contactarnos?",
        options: [
            { text: "Teléfono Principal", value: "contacto_telefono" },
            { text: "Correo Electrónico Comercial", value: "contacto_email" },
            { text: "Programar una Visita", value: "contacto_visita" },
            { text: "Formulario Web", value: "contacto_formulario" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "contacto_telefono": "Puedes comunicarte con nuestro equipo comercial al +57 601 745 XXXX (número ficticio). Nuestro horario de atención es de Lunes a Viernes, de 8:00 AM a 5:30 PM.",
            "contacto_email": "Para consultas comerciales y de disponibilidad, por favor escríbenos a comercial@pisanjose.com (dominio ficticio). Nos comprometemos a responderte en un plazo máximo de 1 día hábil.",
            "contacto_visita": "Si deseas coordinar una visita guiada por el parque y conocer nuestros espacios, te invitamos a completar nuestro formulario de contacto en la web o llamarnos directamente para agendar una cita personalizada.",
            "contacto_formulario": "Puedes enviarnos tu consulta directamente a través de nuestro formulario de contacto en la web: [Link a tu página de contacto si aplica, ej: /contact]. Es la forma más rápida para una respuesta detallada."
        }
    },

    // Nueva sección: Preguntas Frecuentes
    "faq": {
        message: "Has seleccionado 'Preguntas Frecuentes'. Aquí tienes algunas de las consultas más comunes:",
        options: [
            { text: "¿Cuáles son los requisitos para instalar una empresa?", value: "faq_requisitos" },
            { text: "¿Hay espacios disponibles para alquiler o venta?", value: "faq_disponibilidad" },
            { text: "Opciones de Transporte Público y Acceso", value: "faq_transporte" },
            { text: "¿Qué empresas ya están ubicadas en el parque?", value: "faq_empresas" },
            { text: "Volver al Menú Principal", value: "main_menu" }
        ],
        answers: {
            "faq_requisitos": "Los requisitos para instalar una empresa en Parque Industrial San José incluyen: constitución legal de la empresa, cumplimiento de la normativa ambiental y de uso de suelo de Funza, presentación de un plan de negocio y la aprobación por parte de la administración del parque. Nuestro equipo comercial puede guiarte en cada paso.",
            "faq_disponibilidad": "Actualmente, contamos con disponibilidad de lotes urbanizados para construcción a la medida (desde 1,500 m²) y bodegas modulares ya construidas (desde 500 m²), tanto para alquiler como para venta. La disponibilidad específica varía, por lo que te recomendamos contactar a nuestro equipo comercial para un inventario actualizado.",
            "faq_transporte": "El Parque Industrial San José es fácilmente accesible. Contamos con paradas de buses intermunicipales en la Vía Funza-Siberia y estamos en cercanía a rutas de transporte público que conectan con Bogotá y municipios aledaños como Mosquera y Madrid. Esto facilita el desplazamiento de personal y carga.",
            "faq_empresas": "El Parque Industrial San José alberga a diversas empresas líderes en sectores como logística, manufactura ligera, distribución y tecnología. No podemos revelar nombres específicos por acuerdos de confidencialidad, pero la diversidad de nuestro portafolio es un testimonio de la versatilidad de nuestras instalaciones."
        }
    },

    // Respuesta para salir del chat
    "exit": {
        message: "Gracias por usar el asistente virtual de Parque Industrial San José. Si tienes más preguntas, no dudes en volver. ¡Hasta pronto!",
        options: []
    },

    // Respuesta genérica para cuando no se entiende la consulta
    "default": {
        message: "Disculpa, no entendí tu consulta. Por favor, selecciona una de las opciones del menú o reformula tu pregunta. Si necesitas ayuda adicional, puedes contactarnos directamente.",
        options: [
            { text: "Volver al Menú Principal", value: "main_menu" }
        ]
    }
};

export default questionChatbot;
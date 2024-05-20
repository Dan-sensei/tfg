// seed.ts
import { PrismaClient } from "@prisma/client";
import prisma from "../../lib/db";
interface BaseDocument {
    collegeId: number;
    thumbnail: string;
    banner: string;
    content: string;
    pages: number;
    documentLink: string;
    views: number;
    score: number;
    categoryId: number;
    titulationId: number;
}

function getRandomImage(): string {
    const characters = "0123456789abcdef";
    let random = "";
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        random += characters[randomIndex];
    }

    return `https://picsum.photos/seed/${random}/`;
}

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomScore(max: number) {
    return parseFloat((Math.random() * max).toFixed(2));
}

function getRandomBaseDocument(
    categoryLength: number,
    titulationLength: number
): BaseDocument {
    return {
        collegeId: 1,
        thumbnail: getRandomImage(),
        banner: "",
        content: "",
        pages: getRandomNumber(50, 150),
        documentLink: "URL to Document",
        views: getRandomNumber(1, 1000000),
        score: getRandomScore(5),
        categoryId: getRandomNumber(0, categoryLength - 1),
        titulationId: getRandomNumber(0, titulationLength - 1),
    };
}

async function initializeMainData(Category: any[], GradeMaster: any[]) {
    await prisma.college.create({
        data: {
            id: 1,
            name: "Universidad de Alicante",
        },
    });
    await prisma.category.createMany({ data: Category });
    await prisma.titulation.createMany({ data: GradeMaster });
}

async function postSeed() {
    "use server";
    const Category = [
        { id: 0, name: "Investigación" },
        { id: 1, name: "Entretenimiento digital" },
        { id: 2, name: "Desarrollo de Software" },
        { id: 3, name: "Ciencia de Datos" },
        { id: 4, name: "Diseño Gráfico" },
        { id: 5, name: "Ciberseguridad" },
        { id: 6, name: "Inteligencia Artificial" },
        { id: 7, name: "Medio Ambiente" },
        { id: 8, name: "Salud y Bienestar" },
        { id: 9, name: "Negocios y Finanzas" },
        { id: 10, name: "Robótica" },
        { id: 11, name: "Diseño industrial" },
        { id: 12, name: "Biomedicina" },
        { id: 13, name: "Energías renovables" },
        { id: 14, name: "Arquitectura" },
        { id: 15, name: "Dispositivos" },
    ];

    const GradeMaster = [
        { id: 0, name: "Ingeniería Civil", collegeId: 1 },
        { id: 1, name: "Ingeniería Mecánica", collegeId: 1 },
        { id: 2, name: "Ingeniería Eléctrica", collegeId: 1 },
        { id: 3, name: "Ingeniería Informática", collegeId: 1 },
        { id: 4, name: "Ingeniería Química", collegeId: 1 },
        { id: 5, name: "Ingeniería Aeroespacial", collegeId: 1 },
        { id: 6, name: "Ingeniería Biomédica", collegeId: 1 },
        { id: 7, name: "Ingeniería Ambiental", collegeId: 1 },
        { id: 8, name: "Ingeniería de Materiales", collegeId: 1 },
        { id: 9, name: "Ingeniería Industrial", collegeId: 1 },
        { id: 10, name: "Ingeniería Multimedia", collegeId: 1 },
        { id: 11, name: "Arquitectura", collegeId: 1 },
    ];

    //await initializeMainData(Category, GradeMaster);

    const tfgsData = [
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Descubrimientos en Oceanografía",
            description:
                "Sumérgete en los últimos descubrimientos y tecnologías en investigación oceanográfica.",
            author: "Amelia Earhart",
            tutor: "Dr. Jacques Cousteau",
            tags: ["Oceanografía", "Biología Marina", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Avances en la Exploración Espacial",
            description:
                "Un viaje a través de las últimas innovaciones y misiones en la exploración espacial.",
            author: "Neil Armstrong",
            tutor: "Prof. Carl Sagan",
            tags: ["Espacio", "Astronomía", "Exploración"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Psicología del Aprendizaje",
            description:
                "Explora los procesos cognitivos y teorías detrás del aprendizaje y la educación.",
            author: "Sigmund Freud",
            tutor: "Dr. Maria Montessori",
            tags: ["Psicología", "Educación", "Teorías de Aprendizaje"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Innovaciones en Arquitectura Sostenible",
            description:
                "Descubre las últimas tendencias y tecnologías en diseño de edificios ecológicos y sostenibles.",
            author: "Frank Lloyd Wright",
            tutor: "Prof. Zaha Hadid",
            tags: ["Arquitectura", "Sostenibilidad", "Diseño"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Entendiendo la Computación Cuántica",
            description:
                "Una visión general de la computación cuántica, sus principios y aplicaciones potenciales.",
            author: "Richard Feynman",
            tutor: "Dr. Stephen Hawking",
            tags: ["Computación Cuántica", "Física", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Proyecto del Genoma Humano",
            description:
                "Una visión del Proyecto del Genoma Humano y su impacto en la ciencia médica.",
            author: "Rosalind Franklin",
            tutor: "Prof. James Watson",
            tags: ["Genética", "Biología", "Medicina"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Explorando la Realidad Virtual",
            description:
                "Una guía completa para el desarrollo y aplicaciones de la tecnología de realidad virtual.",
            author: "Mark Zuckerberg",
            tutor: "Dr. Ivan Sutherland",
            tags: ["Realidad Virtual", "Tecnología", "Innovación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Blockchain y Criptomoneda",
            description:
                "Comprender la tecnología detrás del blockchain y el auge de las criptomonedas.",
            author: "Satoshi Nakamoto",
            tutor: "Prof. Nick Szabo",
            tags: ["Blockchain", "Criptomoneda", "Finanzas"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Inteligencia Artificial en la Salud",
            description:
                "Examinando el papel de la IA en la transformación del cuidado de la salud y diagnósticos médicos.",
            author: "Ada Lovelace",
            tutor: "Dr. Geoffrey Hinton",
            tags: ["Inteligencia Artificial", "Salud", "Innovación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ciencia del Cambio Climático",
            description:
                "Un análisis de la evidencia científica e impactos del cambio climático.",
            author: "Greta Thunberg",
            tutor: "Prof. James Hansen",
            tags: ["Cambio Climático", "Medio Ambiente", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Impacto de la Energía Renovable",
            description:
                "Investiga la influencia de las fuentes de energía renovable en la reducción de las emisiones globales de carbono.",
            author: "Carlos Martínez",
            tutor: "Dr. Emily Brown",
            tags: [
                "Energía Renovable",
                "Cambio Climático",
                "Ciencia Ambiental",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Tecnologías Emergentes en la Agricultura",
            description:
                "Un estudio sobre las nuevas tecnologías y su papel en la transformación de la agricultura moderna.",
            author: "Lucia Hernández",
            tutor: "Prof. Juan Pérez",
            tags: ["Agricultura", "Tecnología", "Innovación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Historia del Arte Moderno",
            description:
                "Un viaje a través de las corrientes y figuras clave del arte moderno.",
            author: "Pablo Picasso",
            tutor: "Dr. Frida Kahlo",
            tags: ["Arte", "Historia", "Cultura"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Robótica y Automatización",
            description:
                "Explorando el mundo de la robótica y su creciente impacto en la industria y la sociedad.",
            author: "Elon Musk",
            tutor: "Prof. Ada Lovelace",
            tags: ["Robótica", "Tecnología", "Automatización"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Conservación Ambiental",
            description:
                "Un análisis de las estrategias y desafíos en la conservación de nuestros ecosistemas.",
            author: "Jane Goodall",
            tutor: "Dr. David Attenborough",
            tags: ["Medio Ambiente", "Conservación", "Ecología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Innovación en Medicina",
            description:
                "Descubre las últimas innovaciones en medicina y cómo están cambiando la atención sanitaria.",
            author: "Elizabeth Blackwell",
            tutor: "Prof. Edward Jenner",
            tags: ["Medicina", "Salud", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Física Cuántica y sus Misterios",
            description:
                "Adéntrate en los enigmas y principios fundamentales de la física cuántica.",
            author: "Albert Einstein",
            tutor: "Dr. Niels Bohr",
            tags: ["Física", "Ciencia", "Cuántica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Mundo de la Nanotecnología",
            description:
                "Una exploración de la nanotecnología y su revolucionario potencial en diversas industrias.",
            author: "Richard Feynman",
            tutor: "Prof. Eric Drexler",
            tags: ["Nanotecnología", "Ciencia", "Innovación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Desarrollo Sostenible y Economía Circular",
            description:
                "Analiza los principios de la economía circular y su rol en el desarrollo sostenible.",
            author: "Mohamed Yunus",
            tutor: "Dr. Ellen MacArthur",
            tags: ["Sostenibilidad", "Economía", "Ecología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Exploración de Marte y sus Desafíos",
            description:
                "Una mirada a las misiones a Marte, sus descubrimientos y los desafíos futuros.",
            author: "Carl Sagan",
            tutor: "Prof. Valentina Tereshkova",
            tags: ["Espacio", "Marte", "Astronomía"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Impresión 3D",
            description:
                "Un análisis profundo sobre cómo la impresión 3D está cambiando la fabricación y el diseño.",
            author: "Andrés López",
            tutor: "Dra. Laura García",
            tags: ["Impresión 3D", "Tecnología", "Innovación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Inteligencia Artificial en Finanzas",
            description:
                "Explora el impacto creciente de la IA en el sector financiero y la banca.",
            author: "Sofía Rodríguez",
            tutor: "Dr. Juan Martín",
            tags: ["Inteligencia Artificial", "Finanzas", "Bancos"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de la Realidad Aumentada",
            description:
                "Descubre cómo la realidad aumentada está transformando el entretenimiento, la educación y más.",
            author: "Diego Ramírez",
            tutor: "Prof. Ana Torres",
            tags: ["Realidad Aumentada", "Tecnología", "Futuro"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Avances en Biología Sintética",
            description:
                "Un vistazo a los avances recientes en biología sintética y sus aplicaciones potenciales.",
            author: "Carmen Fernández",
            tutor: "Dr. Luis Álvarez",
            tags: ["Biología Sintética", "Genética", "Investigación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Nuevos Horizontes en Neurociencia",
            description:
                "Explorando los descubrimientos más recientes en el campo de la neurociencia.",
            author: "Pedro Gómez",
            tutor: "Dra. María Díaz",
            tags: ["Neurociencia", "Cerebro", "Investigación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Tendencias en Energía Eólica",
            description:
                "Analiza el desarrollo y futuro de la energía eólica como fuente renovable.",
            author: "Elena Sánchez",
            tutor: "Dr. Roberto Núñez",
            tags: ["Energía Eólica", "Renovable", "Medio Ambiente"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Era de los Vehículos Autónomos",
            description:
                "Una mirada al desarrollo de vehículos autónomos y su impacto en la sociedad.",
            author: "Carlos Ruiz",
            tutor: "Prof. Sandra López",
            tags: ["Vehículos Autónomos", "Transporte", "Futuro"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Innovaciones en Agricultura Urbana",
            description:
                "Descubre cómo la agricultura urbana está transformando los espacios de las ciudades.",
            author: "Marta Jiménez",
            tutor: "Dr. Jorge Castillo",
            tags: ["Agricultura Urbana", "Sostenibilidad", "Ciudades"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Desarrollo de Ciudades Inteligentes",
            description:
                "Explora el concepto de ciudades inteligentes y su importancia en la planificación urbana moderna.",
            author: "Daniel Torres",
            tutor: "Prof. Elena Ruiz",
            tags: ["Ciudades Inteligentes", "Tecnología", "Urbanismo"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Retos en la Conservación de la Biodiversidad",
            description:
                "Un enfoque en los desafíos actuales en la conservación de la biodiversidad mundial.",
            author: "Luisa Pérez",
            tutor: "Dra. Ana María González",
            tags: ["Biodiversidad", "Conservación", "Ecología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Impacto de la Inteligencia Artificial en la Educación",
            description:
                "Un análisis de cómo la inteligencia artificial está revolucionando los métodos educativos.",
            author: "Jorge Hernández",
            tutor: "Dra. Silvia Ramírez",
            tags: ["Inteligencia Artificial", "Educación", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Historia y Evolución de la Internet",
            description:
                "Un recorrido por el desarrollo histórico de Internet y su transformación en la sociedad.",
            author: "Ana Mendoza",
            tutor: "Dr. Carlos Vargas",
            tags: ["Internet", "Historia", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Secretos del Universo Oscuro",
            description:
                "Explorando los misterios del universo oscuro y sus componentes desconocidos.",
            author: "Miguel Ángel López",
            tutor: "Prof. Laura Fernández",
            tags: ["Astrofísica", "Universo Oscuro", "Cosmología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Nanomedicina",
            description:
                "Investigando cómo la nanotecnología está cambiando el panorama de la medicina moderna.",
            author: "Sara Jiménez",
            tutor: "Dr. Roberto García",
            tags: ["Nanomedicina", "Tecnología", "Salud"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de las Ciudades Sostenibles",
            description:
                "Descubre las estrategias y tecnologías clave para el desarrollo de ciudades sostenibles.",
            author: "David Romero",
            tutor: "Prof. Patricia Molina",
            tags: ["Ciudades Sostenibles", "Urbanismo", "Medio Ambiente"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Avances en la Exploración de Marte",
            description:
                "Un vistazo a los últimos avances y descubrimientos en la exploración del planeta Marte.",
            author: "Laura Vázquez",
            tutor: "Dr. Alberto Torres",
            tags: ["Marte", "Exploración Espacial", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Impacto de las Redes Sociales en la Sociedad",
            description:
                "Analizando cómo las redes sociales están moldeando las interacciones humanas y la cultura.",
            author: "Óscar Sánchez",
            tutor: "Dra. Carmen Ruiz",
            tags: ["Redes Sociales", "Comunicación", "Sociedad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Tecnologías Emergentes en Energía Solar",
            description:
                "Explora las últimas innovaciones en tecnología solar y su potencial para el futuro energético.",
            author: "Beatriz González",
            tutor: "Prof. Juan Martín",
            tags: ["Energía Solar", "Tecnología", "Sostenibilidad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Desafíos de la Inteligencia Artificial Ética",
            description:
                "Un estudio sobre los desafíos éticos que presenta el avance de la inteligencia artificial.",
            author: "Francisco López",
            tutor: "Dra. Elena Gutiérrez",
            tags: ["Inteligencia Artificial", "Ética", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Explorando las Profundidades del Océano",
            description:
                "Descubre los misterios y la importancia de la exploración de las profundidades oceánicas.",
            author: "Cristina Fernández",
            tutor: "Prof. Mario Domínguez",
            tags: ["Oceanografía", "Exploración", "Ciencia Marina"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Nanomedicina",
            description:
                "Investigando cómo la nanotecnología está cambiando el panorama de la medicina moderna.",
            author: "Sara Jiménez",
            tutor: "Dr. Roberto García",
            tags: ["Nanomedicina", "Tecnología", "Salud"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de las Ciudades Sostenibles",
            description:
                "Descubre las estrategias y tecnologías clave para el desarrollo de ciudades sostenibles.",
            author: "David Romero",
            tutor: "Prof. Patricia Molina",
            tags: ["Ciudades Sostenibles", "Urbanismo", "Medio Ambiente"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Avances en la Exploración de Marte",
            description:
                "Un vistazo a los últimos avances y descubrimientos en la exploración del planeta Marte.",
            author: "Laura Vázquez",
            tutor: "Dr. Alberto Torres",
            tags: ["Marte", "Exploración Espacial", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Impacto de las Redes Sociales en la Sociedad",
            description:
                "Analizando cómo las redes sociales están moldeando las interacciones humanas y la cultura.",
            author: "Óscar Sánchez",
            tutor: "Dra. Carmen Ruiz",
            tags: ["Redes Sociales", "Comunicación", "Sociedad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Tecnologías Emergentes en Energía Solar",
            description:
                "Explora las últimas innovaciones en tecnología solar y su potencial para el futuro energético.",
            author: "Beatriz González",
            tutor: "Prof. Juan Martín",
            tags: ["Energía Solar", "Tecnología", "Sostenibilidad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Desafíos de la Inteligencia Artificial Ética",
            description:
                "Un estudio sobre los desafíos éticos que presenta el avance de la inteligencia artificial.",
            author: "Francisco López",
            tutor: "Dra. Elena Gutiérrez",
            tags: ["Inteligencia Artificial", "Ética", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Explorando las Profundidades del Océano",
            description:
                "Descubre los misterios y la importancia de la exploración de las profundidades oceánicas.",
            author: "Cristina Fernández",
            tutor: "Prof. Mario Domínguez",
            tags: ["Oceanografía", "Exploración", "Ciencia Marina"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Medicina",
            description:
                "Exploración de cómo la IA está revolucionando el diagnóstico y tratamiento médico.",
            author: "Elena Rodríguez",
            tutor: "Dr. Luis Fernández",
            tags: ["Inteligencia Artificial", "Medicina", "Tecnología Médica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Cambio Climático y sus Efectos Globales",
            description:
                "Un análisis exhaustivo de los efectos del cambio climático en todo el mundo.",
            author: "Javier García",
            tutor: "Dra. Ana Martínez",
            tags: ["Cambio Climático", "Medio Ambiente", "Sostenibilidad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Historia de la Robótica",
            description:
                "Desde sus inicios hasta la robótica avanzada de hoy en día.",
            author: "Carlos Martínez",
            tutor: "Prof. Laura Sánchez",
            tags: ["Robótica", "Tecnología", "Historia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Psicología del Comportamiento Humano",
            description:
                "Un estudio profundo sobre los factores que influyen en el comportamiento humano.",
            author: "María López",
            tutor: "Dr. Antonio Ramírez",
            tags: ["Psicología", "Comportamiento Humano", "Ciencias Sociales"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Inteligencia Cuántica",
            description:
                "Exploración de la computación cuántica y su potencial revolucionario.",
            author: "Daniel Pérez",
            tutor: "Prof. Carmen Ruiz",
            tags: ["Inteligencia Cuántica", "Tecnología", "Física"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Biodiversidad en Peligro",
            description:
                "Una reflexión sobre la pérdida de biodiversidad y sus impactos en el ecosistema.",
            author: "Lucía Fernández",
            tutor: "Dr. Juan López",
            tags: ["Biodiversidad", "Medio Ambiente", "Conservación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Impresión 3D",
            description:
                "Descubre cómo la impresión 3D está transformando la fabricación y el diseño.",
            author: "Antonio González",
            tutor: "Dra. Laura Martínez",
            tags: ["Impresión 3D", "Tecnología", "Fabricación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de la Inteligencia Artificial en la Educación",
            description:
                "Exploración de cómo la IA está cambiando la forma en que aprendemos y enseñamos.",
            author: "Isabel Ramírez",
            tutor: "Prof. Pablo Sánchez",
            tags: [
                "Inteligencia Artificial",
                "Educación",
                "Tecnología Educativa",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Era de la Exploración Espacial Privada",
            description:
                "Un vistazo a las empresas privadas que lideran la exploración del espacio.",
            author: "Diego Rodríguez",
            tutor: "Dr. María López",
            tags: ["Exploración Espacial", "Empresas Privadas", "Astronáutica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Crisis de la Biodiversidad Marina",
            description:
                "Los desafíos que enfrenta la biodiversidad en nuestros océanos y mares.",
            author: "Eduardo Martínez",
            tutor: "Dra. Ana Pérez",
            tags: ["Biodiversidad Marina", "Conservación", "Ecología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Industria Automotriz",
            description:
                "Cómo la IA está transformando la fabricación y seguridad de los vehículos.",
            author: "Miguel Torres",
            tutor: "Dr. Elena García",
            tags: [
                "Inteligencia Artificial",
                "Industria Automotriz",
                "Tecnología",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ciencia detrás de la Felicidad",
            description:
                "Exploración de las investigaciones científicas sobre la felicidad humana.",
            author: "Ana Sánchez",
            tutor: "Prof. Javier Rodríguez",
            tags: ["Felicidad", "Psicología", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Realidad Virtual",
            description:
                "Cómo la realidad virtual está cambiando la forma en que experimentamos el mundo.",
            author: "Pedro Martínez",
            tutor: "Dra. Laura Pérez",
            tags: ["Realidad Virtual", "Tecnología", "Entretenimiento"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Avances en la Medicina Regenerativa",
            description:
                "Un vistazo a las terapias regenerativas y su potencial para curar enfermedades.",
            author: "Isabel Sánchez",
            tutor: "Dr. Antonio López",
            tags: ["Medicina Regenerativa", "Salud", "Terapias"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ética en la Investigación Científica",
            description:
                "Un análisis de los principios éticos en la investigación científica y sus desafíos.",
            author: "Carlos López",
            tutor: "Dra. María García",
            tags: ["Ética", "Investigación Científica", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Importancia de la Conservación de los Bosques",
            description:
                "Exploración de la conservación forestal y su impacto en el medio ambiente.",
            author: "Laura Torres",
            tutor: "Prof. José Rodríguez",
            tags: ["Conservación Forestal", "Medio Ambiente", "Sostenibilidad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Industria de la Música",
            description:
                "Cómo la IA está influenciando la creación y distribución de música.",
            author: "Andrés Martínez",
            tutor: "Dra. Carmen Sánchez",
            tags: ["Inteligencia Artificial", "Música", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de Exoplanetas y la Búsqueda de Vida",
            description:
                "Un vistazo a la búsqueda de exoplanetas habitables y la posibilidad de vida extraterrestre.",
            author: "Lucía Pérez",
            tutor: "Dr. Juan Sánchez",
            tags: ["Exoplanetas", "Astronomía", "Búsqueda de Vida"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Evolución de la Inteligencia Artificial en los Videojuegos",
            description:
                "Cómo los videojuegos han impulsado el desarrollo de la inteligencia artificial.",
            author: "Diego López",
            tutor: "Prof. María Martínez",
            tags: ["Inteligencia Artificial", "Videojuegos", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de la Movilidad Urbana",
            description:
                "Exploración de soluciones innovadoras para la movilidad en las ciudades del futuro.",
            author: "Elena González",
            tutor: "Dr. Javier Pérez",
            tags: ["Movilidad Urbana", "Transporte", "Ciudades Sostenibles"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Agricultura",
            description:
                "Cómo la IA está mejorando la eficiencia y sostenibilidad en la agricultura.",
            author: "María Rodríguez",
            tutor: "Dr. Carlos Martínez",
            tags: [
                "Inteligencia Artificial",
                "Agricultura",
                "Tecnología Agrícola",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Secretos de la Genética Humana",
            description:
                "Un recorrido por los avances y descubrimientos en la genética humana.",
            author: "Pedro González",
            tutor: "Dra. Elena Pérez",
            tags: ["Genética Humana", "Ciencia", "Medicina"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial y la Automatización Industrial",
            description:
                "Cómo la IA está transformando la industria y la fabricación automatizada.",
            author: "Luis Sánchez",
            tutor: "Prof. Laura Torres",
            tags: ["Inteligencia Artificial", "Automatización", "Industria"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Papel de las Energías Renovables en el Futuro Energético",
            description:
                "Un análisis de las fuentes de energía renovable y su importancia en el futuro.",
            author: "Ana López",
            tutor: "Dr. Javier Rodríguez",
            tags: ["Energías Renovables", "Sostenibilidad", "Energía"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Psicología del Aprendizaje en Línea",
            description:
                "Exploración de los aspectos psicológicos del aprendizaje en línea y la educación virtual.",
            author: "Carlos Sánchez",
            tutor: "Dra. María Martínez",
            tags: [
                "Psicología del Aprendizaje",
                "Educación en Línea",
                "Tecnología Educativa",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de la Antártida y el Cambio Climático",
            description:
                "Un estudio de cómo la investigación en la Antártida contribuye a la comprensión del cambio climático.",
            author: "Laura Pérez",
            tutor: "Prof. Andrés García",
            tags: ["Antártida", "Cambio Climático", "Investigación Científica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Era de la Impresión 3D en la Medicina",
            description:
                "Cómo la impresión 3D está revolucionando la fabricación de dispositivos médicos y órganos.",
            author: "David Sánchez",
            tutor: "Dra. Ana Martínez",
            tags: ["Impresión 3D", "Medicina", "Tecnología Médica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de la Inteligencia Artificial en la Agricultura",
            description:
                "Exploración de las aplicaciones futuras de la IA en la agricultura y la ganadería.",
            author: "Isabel Pérez",
            tutor: "Prof. José López",
            tags: ["Inteligencia Artificial", "Agricultura", "Ganadería"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Búsqueda de Vida en Europa, la Luna de Júpiter",
            description:
                "Un análisis de las misiones espaciales para buscar signos de vida en la luna Europa.",
            author: "Javier Sánchez",
            tutor: "Dr. María López",
            tags: ["Europa", "Luna de Júpiter", "Exploración Espacial"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Influencia de la Inteligencia Artificial en la Publicidad",
            description:
                "Cómo la IA está transformando la publicidad digital y el marketing.",
            author: "Elena Martínez",
            tutor: "Dra. Carmen Rodríguez",
            tags: [
                "Inteligencia Artificial",
                "Publicidad",
                "Marketing Digital",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Atención Médica",
            description:
                "Cómo la IA está siendo utilizada para mejorar la atención médica y el diagnóstico.",
            author: "Ana García",
            tutor: "Dr. Javier López",
            tags: ["Inteligencia Artificial", "Atención Médica", "Diagnóstico"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Desafíos de la Ciberseguridad en la Era Digital",
            description:
                "Un análisis de los retos en la protección de datos y la ciberseguridad en la era digital.",
            author: "Carlos Rodríguez",
            tutor: "Dra. Elena Pérez",
            tags: ["Ciberseguridad", "Tecnología", "Seguridad Digital"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Neurociencia detrás de la Toma de Decisiones",
            description:
                "Exploración de cómo el cerebro humano toma decisiones y su impacto en la psicología.",
            author: "Marta López",
            tutor: "Prof. David Sánchez",
            tags: ["Neurociencia", "Toma de Decisiones", "Psicología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de las Criptomonedas y la Tecnología Blockchain",
            description:
                "Cómo las criptomonedas y la tecnología blockchain están cambiando las finanzas y la industria.",
            author: "Daniel García",
            tutor: "Dra. María Martínez",
            tags: ["Criptomonedas", "Blockchain", "Tecnología Financiera"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Agujeros Negros en el Espacio",
            description:
                "Un vistazo a la investigación y descubrimientos relacionados con los agujeros negros.",
            author: "Laura Pérez",
            tutor: "Dr. Antonio López",
            tags: ["Agujeros Negros", "Astrofísica", "Exploración Espacial"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Industria de Videojuegos",
            description:
                "Cómo la IA se utiliza para crear experiencias de juego más realistas y desafiantes.",
            author: "Diego Sánchez",
            tutor: "Prof. Carmen Rodríguez",
            tags: ["Inteligencia Artificial", "Videojuegos", "Entretenimiento"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Importancia de la Diversidad en el Lugar de Trabajo",
            description:
                "Un análisis de los beneficios de la diversidad en las empresas y organizaciones.",
            author: "Isabel García",
            tutor: "Dra. Carmen López",
            tags: ["Diversidad", "Inclusión", "Lugar de Trabajo"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Fondos Marinos y la Vida Submarina",
            description:
                "Cómo la investigación submarina está revelando secretos de los océanos y sus criaturas.",
            author: "Javier López",
            tutor: "Prof. Laura Rodríguez",
            tags: ["Fondos Marinos", "Exploración Submarina", "Ciencia Marina"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Automatización de la Industria Alimentaria",
            description:
                "Cómo la IA está optimizando la producción y distribución de alimentos.",
            author: "Elena Sánchez",
            tutor: "Dr. Juan García",
            tags: [
                "Inteligencia Artificial",
                "Industria Alimentaria",
                "Tecnología",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ética en la Clonación y la Ingeniería Genética",
            description:
                "Un estudio sobre los dilemas éticos en la clonación y la manipulación genética.",
            author: "Andrés López",
            tutor: "Dra. María Rodríguez",
            tags: ["Ética", "Clonación", "Ingeniería Genética"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Educación Superior",
            description:
                "Cómo la IA está transformando la enseñanza y el aprendizaje en la educación superior.",
            author: "Ana Martínez",
            tutor: "Prof. Javier Sánchez",
            tags: [
                "Inteligencia Artificial",
                "Educación Superior",
                "Tecnología Educativa",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Evolución de la Robótica en la Medicina",
            description:
                "Un recorrido por los avances de la robótica en cirugía y diagnóstico médico.",
            author: "Diego García",
            tutor: "Dra. Laura Rodríguez",
            tags: ["Robótica Médica", "Medicina", "Tecnología Médica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Desafíos de la Inteligencia Artificial en la Ética Empresarial",
            description:
                "Un análisis de los dilemas éticos en la implementación de IA en empresas.",
            author: "Carlos Martínez",
            tutor: "Dra. María López",
            tags: [
                "Inteligencia Artificial",
                "Ética Empresarial",
                "Tecnología",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Astronomía y la Búsqueda de Vida en Planetas Exoplanetarios",
            description:
                "Cómo los astrónomos buscan signos de vida en planetas fuera de nuestro sistema solar.",
            author: "Laura Sánchez",
            tutor: "Dr. Juan Pérez",
            tags: ["Astronomía", "Exoplanetas", "Búsqueda de Vida"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Importancia de la Conservación de los Ecosistemas Marinos",
            description:
                "Un enfoque en la preservación de los ecosistemas marinos y la biodiversidad acuática.",
            author: "Isabel López",
            tutor: "Prof. Andrés Rodríguez",
            tags: ["Conservación Marina", "Biodiversidad", "Ecología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Automatización Industrial",
            description:
                "Cómo la IA está revolucionando la automatización y la fabricación industrial.",
            author: "Pedro Sánchez",
            tutor: "Dra. Carmen Martínez",
            tags: [
                "Inteligencia Artificial",
                "Automatización Industrial",
                "Tecnología",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Psicología de la Creatividad y la Innovación",
            description:
                "Exploración de los procesos mentales detrás de la creatividad y la innovación.",
            author: "Marta Rodríguez",
            tutor: "Prof. David García",
            tags: ["Psicología", "Creatividad", "Innovación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Energía Nuclear",
            description:
                "Un vistazo a la energía nuclear y sus aplicaciones en la generación de electricidad.",
            author: "Javier Martínez",
            tutor: "Dr. Elena López",
            tags: ["Energía Nuclear", "Tecnología", "Sostenibilidad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de Marte en la Era Moderna",
            description:
                "Un análisis de las misiones recientes y futuras para explorar el planeta Marte.",
            author: "Elena García",
            tutor: "Prof. Carlos Pérez",
            tags: ["Marte", "Exploración Espacial", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Impacto de la Inteligencia Artificial en la Medicina",
            description:
                "Cómo la IA está transformando el diagnóstico, tratamiento y atención médica.",
            author: "Diego López",
            tutor: "Dra. María Rodríguez",
            tags: ["Inteligencia Artificial", "Medicina", "Tecnología Médica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Educación Primaria",
            description:
                "Cómo la IA está siendo utilizada en la enseñanza y el desarrollo de los niños.",
            author: "Ana Pérez",
            tutor: "Prof. Javier Rodríguez",
            tags: [
                "Inteligencia Artificial",
                "Educación Primaria",
                "Tecnología Educativa",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Planetas del Sistema Solar",
            description:
                "Un vistazo a las misiones espaciales que estudian los planetas de nuestro sistema solar.",
            author: "Carlos García",
            tutor: "Dra. Laura Martínez",
            tags: ["Sistema Solar", "Exploración Espacial", "Astronomía"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ética en la Inteligencia Artificial Autónoma",
            description:
                "Un análisis de los dilemas éticos en la IA autónoma y la toma de decisiones independientes.",
            author: "Isabel Martínez",
            tutor: "Dr. Pedro López",
            tags: ["Inteligencia Artificial", "Ética", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ingeniería Genética y la Modificación de Genomas",
            description:
                "Cómo la ingeniería genética está siendo utilizada para modificar ADN y curar enfermedades genéticas.",
            author: "Pedro Pérez",
            tutor: "Dra. María Sánchez",
            tags: ["Ingeniería Genética", "ADN", "Medicina"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de la Impresión 3D en la Construcción",
            description:
                "Exploración de cómo la impresión 3D está revolucionando la construcción de edificios y estructuras.",
            author: "Laura García",
            tutor: "Prof. Andrés López",
            tags: ["Impresión 3D", "Construcción", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Psicología del Comportamiento del Consumidor",
            description:
                "Un análisis de los factores psicológicos que influyen en las decisiones de compra de los consumidores.",
            author: "Diego Martínez",
            tutor: "Dra. Carmen García",
            tags: [
                "Psicología del Consumidor",
                "Comportamiento de Compra",
                "Marketing",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Importancia de la Biodiversidad en los Ecosistemas Terrestres",
            description:
                "Un enfoque en la conservación de la biodiversidad en los ecosistemas terrestres del mundo.",
            author: "Elena Pérez",
            tutor: "Prof. Carlos Rodríguez",
            tags: ["Biodiversidad", "Conservación", "Ecología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Industria de la Salud Mental",
            description:
                "Cómo la IA está siendo utilizada para el diagnóstico y tratamiento de trastornos mentales.",
            author: "Andrés García",
            tutor: "Dra. Laura Sánchez",
            tags: ["Inteligencia Artificial", "Salud Mental", "Psicología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Extremófilos en la Tierra",
            description:
                "Un estudio de las formas de vida extremas que pueden arrojar luz sobre la vida en otros planetas.",
            author: "Marta Martínez",
            tutor: "Dr. Juan Pérez",
            tags: ["Extremófilos", "Microbiología", "Biología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Industria de la Moda",
            description:
                "Cómo la IA está influyendo en el diseño de moda, la recomendación de prendas y la personalización.",
            author: "Carlos Sánchez",
            tutor: "Dra. Ana Rodríguez",
            tags: ["Inteligencia Artificial", "Moda", "Diseño"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Fenómenos Naturales Extremos",
            description:
                "Un análisis de los desastres naturales y eventos extremos que afectan a nuestro planeta.",
            author: "Ana López",
            tutor: "Prof. Javier García",
            tags: ["Fenómenos Naturales", "Desastres", "Geología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ética en la Inteligencia Artificial en la Justicia",
            description:
                "Cómo la IA se utiliza en sistemas judiciales y los desafíos éticos que plantea.",
            author: "Carlos Rodríguez",
            tutor: "Dra. María Martínez",
            tags: ["Inteligencia Artificial", "Justicia", "Ética"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Nanotecnología y sus Aplicaciones en la Medicina",
            description:
                "Cómo la nanotecnología está siendo utilizada para diagnósticos y tratamientos médicos avanzados.",
            author: "Isabel García",
            tutor: "Dr. Pedro Sánchez",
            tags: ["Nanotecnología", "Medicina", "Tecnología Médica"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de la Inteligencia Artificial en el Arte",
            description:
                "Exploración de cómo la IA está influyendo en la creación y apreciación artística.",
            author: "Diego Pérez",
            tutor: "Prof. Laura López",
            tags: ["Inteligencia Artificial", "Arte", "Creatividad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ciencia de la Astronomía y los Telescopios Espaciales",
            description:
                "Un vistazo a los telescopios espaciales y su contribución a la astronomía moderna.",
            author: "Laura Martínez",
            tutor: "Dr. Juan García",
            tags: [
                "Astronomía",
                "Telescopios Espaciales",
                "Exploración Espacial",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Industria de los Videojuegos",
            description:
                "Cómo la IA se utiliza para mejorar la jugabilidad y la inteligencia de los personajes en los juegos.",
            author: "Marta Rodríguez",
            tutor: "Dra. Carmen Pérez",
            tags: ["Inteligencia Artificial", "Videojuegos", "Entretenimiento"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Conservación de los Ecosistemas Acuáticos",
            description:
                "Un enfoque en la preservación de ríos, lagos y ecosistemas acuáticos en peligro.",
            author: "Carlos Martínez",
            tutor: "Prof. Ana López",
            tags: ["Conservación Acuática", "Ecología", "Medio Ambiente"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Industria del Entretenimiento",
            description:
                "Cómo la IA está cambiando la forma en que se crea y se consume el contenido de entretenimiento.",
            author: "Elena Sánchez",
            tutor: "Dr. Javier Rodríguez",
            tags: ["Inteligencia Artificial", "Entretenimiento", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Neurociencia de la Memoria Humana",
            description:
                "Exploración de cómo funciona la memoria en el cerebro humano y su relevancia en la psicología.",
            author: "Diego Martínez",
            tutor: "Dra. María García",
            tags: ["Neurociencia", "Memoria", "Psicología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Inteligencia Artificial en la Agricultura",
            description:
                "Cómo la IA está mejorando la gestión de cultivos y la producción agrícola.",
            author: "Isabel López",
            tutor: "Prof. Juan Pérez",
            tags: [
                "Inteligencia Artificial",
                "Agricultura",
                "Tecnología Agrícola",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Retos de la Exploración Espacial a Largo Plazo",
            description:
                "Un análisis de los desafíos que enfrentamos en la exploración espacial de largo alcance.",
            author: "Javier García",
            tutor: "Dra. Laura Martínez",
            tags: ["Exploración Espacial", "Astronáutica", "Ciencia Espacial"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial y la Ética en la Robótica",
            description:
                "Cómo la IA está influyendo en la ética y la toma de decisiones en la robótica.",
            author: "Ana Rodríguez",
            tutor: "Dr. Carlos López",
            tags: ["Inteligencia Artificial", "Robótica", "Ética"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Medicina Regenerativa y la Ingeniería de Tejidos",
            description:
                "Cómo la medicina regenerativa está revolucionando la reparación de tejidos y órganos.",
            author: "Pedro López",
            tutor: "Dra. María Pérez",
            tags: ["Medicina Regenerativa", "Ingeniería de Tejidos", "Salud"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Biotecnología y la Creación de Alimentos del Futuro",
            description:
                "Un vistazo a cómo la biotecnología está transformando la producción de alimentos.",
            author: "Laura Sánchez",
            tutor: "Prof. David Martínez",
            tags: ["Biotecnología", "Alimentación", "Tecnología Agrícola"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Detección de Fraudulentos Financieros",
            description:
                "Cómo la IA se utiliza para identificar actividades fraudulentas en el sector financiero.",
            author: "Carlos Pérez",
            tutor: "Dra. Laura García",
            tags: [
                "Inteligencia Artificial",
                "Fraude Financiero",
                "Tecnología Financiera",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de Exoplanetas Habitables",
            description:
                "Un análisis de la búsqueda de planetas en zonas habitables fuera de nuestro sistema solar.",
            author: "Ana López",
            tutor: "Prof. Juan García",
            tags: ["Exoplanetas", "Habitabilidad", "Astronomía"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ética en la Inteligencia Artificial y la Privacidad de Datos",
            description:
                "Un examen de las cuestiones éticas relacionadas con la privacidad de datos en la IA.",
            author: "Diego Martínez",
            tutor: "Dra. María Rodríguez",
            tags: ["Inteligencia Artificial", "Privacidad de Datos", "Ética"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ingeniería Genética y la Lucha contra Enfermedades Hereditarias",
            description:
                "Cómo la ingeniería genética está siendo utilizada para abordar enfermedades genéticas.",
            author: "Isabel García",
            tutor: "Dr. Pedro Sánchez",
            tags: [
                "Ingeniería Genética",
                "Enfermedades Hereditarias",
                "Medicina",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "El Futuro de la Impresión 3D en la Manufactura",
            description:
                "Exploración de cómo la impresión 3D está transformando la fabricación de productos.",
            author: "Diego Pérez",
            tutor: "Prof. Laura López",
            tags: ["Impresión 3D", "Manufactura", "Tecnología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Psicología del Comportamiento del Consumidor en Línea",
            description:
                "Un análisis de los factores psicológicos que influyen en el comportamiento del consumidor en línea.",
            author: "Marta Rodríguez",
            tutor: "Dra. Carmen Pérez",
            tags: [
                "Psicología del Consumidor",
                "Comportamiento en Línea",
                "Marketing",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Conservación de los Ecosistemas Fluviales",
            description:
                "Un enfoque en la preservación de ríos y ecosistemas fluviales en peligro de extinción.",
            author: "Carlos Martínez",
            tutor: "Prof. Ana López",
            tags: ["Conservación Fluvial", "Ecología", "Medio Ambiente"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Creación de Música",
            description:
                "Cómo la IA está influyendo en la composición musical y la creación de canciones.",
            author: "Elena Sánchez",
            tutor: "Dr. Javier Rodríguez",
            tags: ["Inteligencia Artificial", "Música", "Creatividad"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Neurociencia del Sueño y los Trastornos del Sueño",
            description:
                "Exploración de la neurociencia detrás del sueño y las condiciones de sueño anormales.",
            author: "Diego Martínez",
            tutor: "Dra. María García",
            tags: [
                "Neurociencia del Sueño",
                "Trastornos del Sueño",
                "Psicología",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Revolución de la Inteligencia Artificial en la Agricultura de Precisión",
            description:
                "Cómo la IA está optimizando la gestión de cultivos y la agricultura de precisión.",
            author: "Isabel López",
            tutor: "Prof. Juan Pérez",
            tags: [
                "Inteligencia Artificial",
                "Agricultura de Precisión",
                "Tecnología Agrícola",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "Los Desafíos de la Exploración Espacial a Marte",
            description:
                "Un análisis de los obstáculos y riesgos en las misiones de exploración a Marte.",
            author: "Javier García",
            tutor: "Dra. Laura Martínez",
            tags: ["Exploración a Marte", "Astronáutica", "Ciencia Espacial"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial y la Ética en la Robótica Autónoma",
            description:
                "Cómo la IA afecta la ética en robots autónomos y decisiones independientes.",
            author: "Ana Rodríguez",
            tutor: "Dr. Carlos López",
            tags: ["Inteligencia Artificial", "Robótica Autónoma", "Ética"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Medicina Regenerativa y la Reparación de Lesiones en Tejidos",
            description:
                "Cómo la medicina regenerativa está siendo utilizada para reparar tejidos dañados en el cuerpo humano.",
            author: "Pedro López",
            tutor: "Dra. María Pérez",
            tags: ["Medicina Regenerativa", "Reparación de Tejidos", "Salud"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Biotecnología y la Alimentación del Futuro",
            description:
                "Un vistazo a cómo la biotecnología está transformando la producción y calidad de los alimentos.",
            author: "Laura Sánchez",
            tutor: "Prof. David Martínez",
            tags: ["Biotecnología", "Alimentación", "Tecnología Agrícola"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Optimización de la Cadena de Suministro",
            description:
                "Cómo la IA está mejorando la eficiencia y gestión de la cadena de suministro en empresas.",
            author: "Carlos Pérez",
            tutor: "Dra. Laura García",
            tags: [
                "Inteligencia Artificial",
                "Cadena de Suministro",
                "Logística",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en el Diagnóstico de Cáncer",
            description:
                "Cómo la IA está siendo utilizada para mejorar la detección temprana y precisión en el diagnóstico de cáncer.",
            author: "Ana García",
            tutor: "Dr. Javier López",
            tags: ["Inteligencia Artificial", "Cáncer", "Diagnóstico Médico"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Agujeros Negros en el Universo",
            description:
                "Un vistazo a las investigaciones y descubrimientos relacionados con los agujeros negros en el cosmos.",
            author: "Carlos Rodríguez",
            tutor: "Dra. María Martínez",
            tags: ["Agujeros Negros", "Astrofísica", "Cosmología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ética en la Clonación Humana",
            description:
                "Un estudio sobre los dilemas éticos en la clonación de seres humanos y sus implicaciones.",
            author: "Marta López",
            tutor: "Prof. David Sánchez",
            tags: ["Clonación Humana", "Ética", "Biología"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Predicción del Cambio Climático",
            description:
                "Cómo la IA está contribuyendo a la modelización y predicción del cambio climático global.",
            author: "Daniel García",
            tutor: "Dra. Laura Rodríguez",
            tags: [
                "Inteligencia Artificial",
                "Cambio Climático",
                "Medio Ambiente",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Mundos Subterráneos",
            description:
                "Un recorrido por la investigación y descubrimientos en cuevas y ambientes subterráneos.",
            author: "Laura Pérez",
            tutor: "Dr. Antonio López",
            tags: ["Exploración Subterránea", "Espeleología", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Traducción de Idiomas",
            description:
                "Cómo la IA está mejorando la traducción automática y la comunicación intercultural.",
            author: "Diego Sánchez",
            tutor: "Prof. Carmen Rodríguez",
            tags: ["Inteligencia Artificial", "Traducción", "Comunicación"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Importancia de la Educación Ambiental",
            description:
                "Un análisis de la educación ambiental y su papel en la conservación del medio ambiente.",
            author: "Isabel García",
            tutor: "Dra. Carmen López",
            tags: ["Educación Ambiental", "Conservación", "Medio Ambiente"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Fondos Marinos Profundos",
            description:
                "Descubre los misterios y la biodiversidad en las profundidades del océano.",
            author: "Javier López",
            tutor: "Prof. Laura Rodríguez",
            tags: [
                "Fondos Marinos Profundos",
                "Exploración Submarina",
                "Biología Marina",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Automatización de la Industria Automotriz",
            description:
                "Cómo la IA está revolucionando la fabricación y conducción de vehículos automotores.",
            author: "Elena Sánchez",
            tutor: "Dr. Juan Martín",
            tags: [
                "Inteligencia Artificial",
                "Industria Automotriz",
                "Automatización",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Ética en la Investigación Científica",
            description:
                "Un análisis de los principios éticos en la realización de investigaciones científicas.",
            author: "Andrés López",
            tutor: "Dra. Elena Gutiérrez",
            tags: ["Ética Científica", "Investigación", "Ciencia"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Biología Sintética y la Creación de Organismos Modificados Genéticamente",
            description:
                "Cómo la biología sintética está siendo utilizada para diseñar organismos con propósitos específicos.",
            author: "Francisco López",
            tutor: "Dra. María Rodríguez",
            tags: [
                "Biología Sintética",
                "Organismos Modificados Genéticamente",
                "Tecnología",
            ],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Exploración de los Efectos del Cambio Climático en los Ecosistemas",
            description:
                "Un análisis de cómo el cambio climático está afectando a la flora y fauna de nuestro planeta.",
            author: "Cristina Fernández",
            tutor: "Prof. Mario Domínguez",
            tags: ["Cambio Climático", "Ecología", "Medio Ambiente"],
        },
        {
            ...getRandomBaseDocument(Category.length, GradeMaster.length),
            title: "La Inteligencia Artificial en la Automatización de la Industria Aeroespacial",
            description:
                "Cómo la IA está siendo utilizada en la fabricación y operación de aeronaves y satélites.",
            author: "Ana Rodríguez",
            tutor: "Dr. Carlos López",
            tags: [
                "Inteligencia Artificial",
                "Industria Aeroespacial",
                "Automatización",
            ],
        },
    ];

    tfgsData.forEach((tfg) => {
        tfg.banner = tfg.thumbnail;
        tfg.thumbnail += `640/360`;
        tfg.banner += `1920/1080`;
    });

    let data = tfgsData.map((tfg) => ({
        collegeId: tfg.collegeId,
        thumbnail: tfg.thumbnail,
        banner: tfg.banner,
        content: tfg.content,
        pages: tfg.pages,
        documentLink: tfg.documentLink,
        views: tfg.views,
        score: tfg.score,
        categoryId: tfg.categoryId,
        titulationId: tfg.titulationId,
        title: tfg.title,
        description: tfg.description,
        author: [tfg.author],
        tags: tfg.tags,
    }));

    await prisma.tfg.createMany({ data: data });
    console.log("All TFGs added to database!");
}
async function updateScoredTimes() {
    "use server";
    const tfgRecords = await prisma.tfg.findMany();
    for (let record of tfgRecords) {
        const randomScoredTimes = Math.floor(Math.random() * 1001);
        await prisma.tfg.update({
            where: { id: record.id },
            data: { scoredTimes: randomScoredTimes },
        });
    }
    console.log("All records updated with random scoredTimes!");
}

async function populateTutors() {
    "use server";
    const tutors = await prisma.tutor.findMany(); // Fetch all Tutor records
    const tfgsWithoutTutors = await prisma.tfg.findMany({
        where: {
            tutor: {
                none: {}, // Find TFG records without any related tutors
            },
        },
    });

    for (const tfg of tfgsWithoutTutors) {
        const assignedTutors = [];
        const numberOfTutors = Math.random() < 0.2 ? 1 : 2; // Decide to add one or two tutors

        for (let i = 0; i < numberOfTutors; i++) {
            const randomIndex = Math.floor(Math.random() * tutors.length);
            assignedTutors.push(tutors[randomIndex].id);
        }

        // Update the TFG record with the selected tutor(s)
        for (const tutorId of assignedTutors) {
            await prisma.tfg.update({
                where: { id: tfg.id },
                data: {
                    tutor: {
                        connect: { id: tutorId },
                    },
                },
            });
        }
    }
    console.log("populateTutors() completed!");
}

export default function SeedDb() {
    return (
        <div className="m-5">
            <form action={updateScoredTimes}>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Seed Database
                </button>
            </form>
        </div>
    );
}

import prisma from "@/app/lib/db";
import { collegeSeed } from "./seedData/college";
import { categoriesSeed } from "./seedData/categories";
import { titulationsSeed } from "./seedData/titulations";
import { departmentsSeed } from "./seedData/departments";
import { locationsSeed } from "./seedData/locations";
import { usersSeed } from "./seedData/users";
import { TFGSSeed } from "./seedData/tfgs";
import { Role, TFGStatus } from "@/app/lib/enums";
import { getRandomDates } from "./seedData/getRandomDate";
import { TFG_BLockElement } from "@/app/components/TFG_BlockDefinitions/BlockDefs";
import { MAX_BANNER_DIMENSIONS, MAX_BLOCKS, MAX_THUMBNAIL_DIMENSIONS } from "@/app/types/defaultData";

function getRandomSeed(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandomImage() {
    const width = getRandomIntegerBetween(200, 500);
    const height = getRandomIntegerBetween(200, 500);
    return `https://picsum.photos/seed/${getRandomSeed(20)}/${width}/${height}`;
}

function getRandomThumbnailAndBanner(): { thumbnail: string; banner: string } {
    const seed = getRandomSeed(35);
    return {
        thumbnail: `https://picsum.photos/seed/${seed}/${MAX_THUMBNAIL_DIMENSIONS.width}/${MAX_THUMBNAIL_DIMENSIONS.height}`,
        banner: `https://picsum.photos/seed/${seed}/${MAX_BANNER_DIMENSIONS.width}/${MAX_BANNER_DIMENSIONS.height}`,
    };
}

function getRandomImageURL(): { url: string; isFullHD: boolean } {
    const fullHDChance = Math.random() < 0.3;

    let url: string;
    let isFullHD: boolean;

    if (fullHDChance) {
        // 30% chance to generate a 1920x1080 image
        url = `https://picsum.photos/seed/${getRandomSeed(15)}/1920/1080`;
        isFullHD = true;
    } else {
        // 70% chance to generate an image with random dimensions between 200 and 500
        url = getRandomImage();
        isFullHD = false;
    }

    return { url, isFullHD };
}

function getRandomParagraphTitle(): string {
    const chance = Math.random();

    if (chance < 0.2) {
        const adjectives = ["Innovador", "Revolucionario", "Avanzado", "Sostenible", "Inteligente", "Interdisciplinario"];
        const nouns = ["Desarrollo", "Análisis", "Estudio", "Investigación", "Evaluación", "Implementación"];
        const subjects = ["en la tecnología", "en la educación", "en la salud", "en el medio ambiente", "en la economía", "en la ingeniería"];

        const getRandomElement = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];

        const adjective = getRandomElement(adjectives);
        const noun = getRandomElement(nouns);
        const subject = getRandomElement(subjects);

        return `${adjective} ${noun} ${subject}`;
    } else {
        return "";
    }
}
function getRandomParagraph(): string {
    const words = [
        "Lorem",
        "ipsum",
        "dolor",
        "sit",
        "amet",
        "consectetur",
        "adipiscing",
        "elit",
        "sed",
        "do",
        "eiusmod",
        "tempor",
        "incididunt",
        "ut",
        "labore",
        "et",
        "dolore",
        "magna",
        "aliqua",
        "Ut",
        "enim",
        "ad",
        "minim",
        "veniam",
        "quis",
        "nostrud",
        "exercitation",
        "ullamco",
        "laboris",
        "nisi",
        "ut",
        "aliquip",
        "ex",
        "ea",
        "commodo",
        "consequat",
        "Duis",
        "aute",
        "irure",
        "dolor",
        "in",
        "reprehenderit",
        "in",
        "voluptate",
        "velit",
        "esse",
        "cillum",
        "dolore",
        "eu",
        "fugiat",
        "nulla",
        "pariatur",
        "Excepteur",
        "sint",
        "occaecat",
        "cupidatat",
        "non",
        "proident",
        "sunt",
        "in",
        "culpa",
        "qui",
        "officia",
        "deserunt",
        "mollit",
        "anim",
        "id",
        "est",
        "laborum",
    ];

    const length = getRandomIntegerBetween(100, 500);

    let paragraph = "";
    while (paragraph.length < length) {
        const word = words[Math.floor(Math.random() * words.length)];
        if (paragraph.length + word.length + 1 > length) {
            break;
        }
        paragraph += (paragraph.length === 0 ? "" : " ") + word;
    }

    return paragraph;
}

function getRandomIntegerBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloatBetween(min: number, max: number): number {
    const randomFloat = Math.random() * (max - min) + min;
    return parseFloat(randomFloat.toFixed(2));
}

const getRandomBlock = (): TFG_BLockElement => {
    const type = getRandomIntegerBetween(1, 8);

    if (type === 1 || type === 2) {
        // MEDIA-TEXT / TEXT-MEDIA same params
        const randomImage = getRandomImageURL();
        return {
            type: type,
            data: JSON.stringify({
                mediaSrc: randomImage.url,
                mediaMaxHeight: 500,
                mediaPosition: "lg:mx-auto",
                mediaType: "image",
                mediaPopOver: randomImage.isFullHD,
                mediaHasTransparency: false,

                title: getRandomParagraphTitle(),
                text: getRandomParagraph(),
                textAlign: type === 1 ? "lg:text-left" : "lg:text-right",
                textVAlign: "lg:items-start",
            }),
        };
    } else if (type === 3) {
        // SINGLE-MEDIA
        const randomImage = getRandomImageURL();
        return {
            type: type,
            data: JSON.stringify({
                mediaSrc: randomImage.url,
                mediaMaxHeight: 500,
                mediaPosition: "lg:mx-auto",
                mediaType: "image",
                mediaPopOver: randomImage.isFullHD,
                mediaHasTransparency: false,
            }),
        };
    } else if (type === 4) {
        // DOUBLE-MEDIA
        const randomImage1 = getRandomImageURL();
        const randomImage2 = getRandomImageURL();
        return {
            type: type,
            data: JSON.stringify({
                media1Src: randomImage1.url,
                media1MaxHeight: 500,
                media1Position: "lg:mx-auto",
                media1Type: "image",
                media1PopOver: randomImage1.isFullHD,
                media1HasTransparency: false,
                media2Src: randomImage2.url,
                media2MaxHeight: 500,
                media2Position: "lg:mx-auto",
                media2Type: "image",
                media2PopOver: randomImage2.isFullHD,
                media2HasTransparency: false,
            }),
        };
    } else if (type === 5) {
        // TRIPLE-MEDIA
        const randomImage1 = getRandomImageURL();
        const randomImage2 = getRandomImageURL();
        const randomImage3 = getRandomImageURL();
        return {
            type: type,
            data: JSON.stringify({
                media1Src: randomImage1.url,
                media1MaxHeight: 500,
                media1Position: "lg:mx-auto",
                media1Type: "image",
                media1PopOver: randomImage1.isFullHD,
                media1HasTransparency: false,
                media2Src: randomImage2.url,
                media2MaxHeight: 500,
                media2Position: "lg:mx-auto",
                media2Type: "image",
                media2PopOver: randomImage2.isFullHD,
                media2HasTransparency: false,
                media3Src: randomImage3.url,
                media3MaxHeight: 500,
                media3Position: "lg:mx-auto",
                media3Type: "image",
                media3PopOver: randomImage3.isFullHD,
                media3HasTransparency: false,
            }),
        };
    } else if (type === 6) {
        // SINGLE-TEXT
        return {
            type: type,
            data: JSON.stringify({
                title: getRandomParagraphTitle(),
                text: getRandomParagraph(),
                textAlign: "lg:text-center",
                textVAlign: "lg:items-start",
            }),
        };
    } else if (type === 7) {
        // DOUBLE-TEXT
        return {
            type: type,
            data: JSON.stringify({
                title1: getRandomParagraphTitle(),
                text1: getRandomParagraph(),
                textAlign1: "lg:text-center",
                textVAlign1: "lg:items-start",
                title2: getRandomParagraphTitle(),
                text2: getRandomParagraph(),
                textAlign2: "lg:text-center",
                textVAlign2: "lg:items-start",
            }),
        };
    } else if (type === 8) {
        // TRIPLE-TEXT
        return {
            type: type,
            data: JSON.stringify({
                title1: getRandomParagraphTitle(),
                text1: getRandomParagraph(),
                textAlign1: "lg:text-center",
                textVAlign1: "lg:items-start",
                title2: getRandomParagraphTitle(),
                text2: getRandomParagraph(),
                textAlign2: "lg:text-center",
                textVAlign2: "lg:items-start",
                title3: getRandomParagraphTitle(),
                text3: getRandomParagraph(),
                textAlign3: "lg:text-center",
                textVAlign3: "lg:items-start",
            }),
        };
    }
    throw new Error("Invalid type");
};

const getRandomContentBlocks = (): string => {
    const blocks: TFG_BLockElement[] = [];
    const maxBlocks = getRandomIntegerBetween(5, MAX_BLOCKS);
    for (let i = 0; i < maxBlocks; i++) {
        blocks.push(getRandomBlock());
    }
    return JSON.stringify(blocks);
};

async function main() {
    console.log("Seeding database...");
    await prisma.college.createMany({ data: collegeSeed });
    const college = await prisma.college.findFirst();

    if (!college) throw new Error("Could not create college");

    await prisma.category.createMany({ data: categoriesSeed });
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        throw new Error("Could not create categories");
    }

    const titulationData = titulationsSeed.map((titulation) => ({
        ...titulation,
        collegeId: college.id,
    }));
    await prisma.titulation.createMany({ data: titulationData });
    const titulations = await prisma.titulation.findMany();
    if (titulations.length === 0) {
        throw new Error("Could not create titulations");
    }

    const departmentsData = departmentsSeed.map((department) => ({
        ...department,
        collegeId: college.id,
    }));
    await prisma.department.createMany({ data: departmentsData });
    const departments = await prisma.department.findMany();
    if (departments.length === 0) {
        throw new Error("Could not create departments");
    }

    const locationsData = locationsSeed.map((location) => ({
        ...location,
        collegeId: college.id,
    }));
    await prisma.location.createMany({ data: locationsData });
    const locations = await prisma.location.findMany();
    if (locations.length === 0) {
        throw new Error("Could not create locations");
    }

    const tfgData = TFGSSeed.map((tfg) => {
        const randomThumbnailAndBanner = getRandomThumbnailAndBanner();
        return {
            ...tfg,
            status: TFGStatus.PUBLISHED,
            views: getRandomIntegerBetween(10000, 400000),
            thumbnail: randomThumbnailAndBanner.thumbnail,
            banner: randomThumbnailAndBanner.banner,
            pages: getRandomIntegerBetween(80, 200),
            trendingScore: 0,
            scoredTimes: getRandomIntegerBetween(500, 2000),
            score: getRandomFloatBetween(1, 10),
            documentLink: "https://drive.google.com/file/d/1YNkDOHv0OnTJEuO47xwCg_uKszxCZ1fy/view?usp=drive_link",
            contentBlocks: getRandomContentBlocks(),
            categoryId: categories[Math.floor(Math.random() * categories.length)].id,
            titulationId: titulations[Math.floor(Math.random() * titulations.length)].id,
            departmentId: Math.random() < 0.2 ? null : departments[Math.floor(Math.random() * departments.length)].id,
            collegeId: college.id,
        };
    });
    await prisma.tfg.createMany({ data: tfgData });
    const tfgs = await prisma.tfg.findMany();

    const initialTfgIds = tfgs.map((tfg) => tfg.id);
    let tfgIds = [...initialTfgIds];

    function getRandomTfgId() {
        if (tfgIds.length === 0) {
            tfgIds = [...initialTfgIds];
        }
        const randomIndex = Math.floor(Math.random() * tfgIds.length);
        return tfgIds.splice(randomIndex, 1)[0];
    }

    const usersData: {
        personalProjectId: number | null;
        collegeId: number;
        name: string;
        image: null;
        email: string;
        role: number;
        socials: string | null;
        personalPage: string | null;
    }[] = usersSeed.map((user, index) => ({
        ...user,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        socials: user.socials ?? null,
        personalPage: null,
        personalProjectId: getRandomTfgId(),
        collegeId: college.id,
    }));

    usersData[0].personalProjectId = null;
    usersData[0].email = "e1";
    usersData[1].personalProjectId = null;
    usersData[1].email = "e2";
    usersData[2].personalProjectId = null;
    usersData[2].email = "tutor1";
    usersData[3].personalProjectId = null;
    usersData[3].email = "tutor2";
    usersData[4].personalProjectId = null;
    usersData[4].email = "manager";
    usersData[5].personalProjectId = null;
    usersData[5].email = "admin";

    await prisma.user.createMany({ data: usersData });
    const tutors = await prisma.user.findMany({
        where: {
            role: {
                not: Role.STUDENT,
            },
        },
    });
    const tutorTFGData = tfgs.flatMap((tfg) => {
        const numberOfTutors = Math.floor(Math.random() * 2) + 1;
        const assignedTutors = [];
        const availableTutors = [...tutors];
        for (let i = 0; i < numberOfTutors; i++) {
            if (availableTutors.length === 0) {
                break;
            }
            const randomIndex = Math.floor(Math.random() * availableTutors.length);
            const selectedTutor = availableTutors.splice(randomIndex, 1)[0];
            assignedTutors.push({
                userId: selectedTutor.id,
                tfgId: tfg.id,
                assignedBy: tutors[0].id,
            });
        }

        return assignedTutors;
    });
    await prisma.tutorTFG.createMany({ data: tutorTFGData });

    const startDate = new Date("2024-07-01T00:00:00Z");
    const endDate = new Date("2024-12-31T23:59:59Z");

    const defensesesRandom = getRandomDates(startDate, endDate);

    const defensesData = defensesesRandom.map(({ startTime, endTime }, index) => ({
        title: `Defense ${index + 1}`,
        locationId: locations[Math.floor(Math.random() * locations.length)].id,
        collegeId: college.id,
        startTime: startTime,
        endTime: endTime,
    }));
    await prisma.defense.createMany({ data: defensesData });
}

main();

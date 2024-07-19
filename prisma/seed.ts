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

async function main() {
    console.log('Seeding database...');
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

    const tfgData = TFGSSeed.map((tfg) => ({
        ...tfg,
        status: TFGStatus.PUBLISHED,
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        titulationId: titulations[Math.floor(Math.random() * titulations.length)].id,
        departmentId: Math.random() < 0.2 ? null : departments[Math.floor(Math.random() * departments.length)].id,
        collegeId: college.id,
    }));
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

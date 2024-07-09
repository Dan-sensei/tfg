import { authOptions } from "@/app/lib/authOptions";
import { badResponse, successResponse } from "@/app/utils/util";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { ReviewMessageType } from "@/app/types/interfaces";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Not signed in", 400);

    const userId = session.user.uid;
    const tfgId = parseInt(request.nextUrl.searchParams.get("tfgId") ?? "-1");
    if (isNaN(tfgId) || tfgId < 0) return badResponse("Invalid tfgId", 400);
    try {
        const messagesDb = await prisma.reviewMessage.findMany({
            where: {
                tfgId: tfgId,
                tfg: {
                    OR: [
                        {
                            authors: {
                                some: {
                                    id: userId,
                                },
                            },
                        },
                        {
                            tutors: {
                                some: {
                                    userId: userId,
                                },
                            },
                        },
                    ],
                },
            },
            select: {
                id: true,
                message: true,
                user: true,
                createdAt: true,
                edited: true,
                reads: {
                    select: {
                        userId: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            }
        });

        const messages: ReviewMessageType[] = messagesDb.map((message) => ({
            id: message.id,
            message: message.message,
            user: message.user,
            createdAt: message.createdAt,
            edited: message.edited,
            readBy: message.reads.filter((read) => read.userId !== null).map((read) => read.userId as number),
        }));
        return successResponse(messages);
    } catch (err) {
        console.log(err);
        return badResponse("Error sending message", 500);
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Not signed in", 400);
    const userId = session.user.uid;
    try {
        const body = await request.json();
        const { tfgId, message } = body;

        const addedMessageDb = await prisma.reviewMessage.create({
            data: {
                tfgId,
                message,
                userId,
            },
            include: {
                user: true,
            },
        });

        await prisma.messageRead.create({
            data: {
                userId,
                messageId: addedMessageDb.id
            },
        });

        const newMessage = {
            id: addedMessageDb.id,
            message,
            user: addedMessageDb.user,
            createdAt: addedMessageDb.createdAt,
            edited: addedMessageDb.edited,
            readBy: [userId],
        };

        return successResponse(newMessage);
    } catch (err) {
        console.log(err);
        return badResponse("Error sending message", 500);
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Not signed in", 400);
    const userId = session.user.uid;
    try {
        const body = await request.json();
        const { messageId, message } = body;

        await prisma.reviewMessage.update({
            where: {
                id: messageId,
                userId: userId,
            },
            data: {
                message,
                edited: true,
            },
        });
        return successResponse("Message updated");
    } catch (err) {
        return badResponse("Error updating message", 500);
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Not signed in", 400);
    const userId = session.user.uid;
    try {
        const body = await request.json();
        const { messageId } = body;

        await prisma.reviewMessage.delete({
            where: {
                id: messageId,
                userId: userId,
            },
        });
        return successResponse("Message deleted");
    } catch (err) {
        console.log(err);
        return badResponse("Error deleting message", 500);
    }
}

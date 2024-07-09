import { authOptions } from "@/app/lib/authOptions";
import { badResponse, successResponse } from "@/app/utils/util";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Not signed in", 400);
    const userId = session.user.uid;
    const body = await request.json();
    const { tfgId, messageIds } = body;

    try {
        // Check if the messages are from the specified TFG and the user is part of
        // the author group or the tutor group
        const checkMessages = await prisma.reviewMessage.findMany({
            where: {
                id: {
                    in: messageIds
                },
                tfg: {
                    id: tfgId,
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
                    ]
                },
                reads: {
                    none: {
                        userId: userId
                    }
                }
            },
            select: {
                id: true
            }
        })

        //If not, return
        const unreadMessages = checkMessages.map((message) => ({userId: userId, messageId: message.id}));
        if(unreadMessages.length === 0) return badResponse("No unread messages", 400);

        await prisma.messageRead.createMany({
            data: unreadMessages,
        });

        return successResponse("Messages marked as read");
    } catch (err) {
        console.log(err);
        return badResponse("Error sending message", 500);
    }
}
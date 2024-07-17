import { StringArraySchema } from "@/app/lib/schemas";
import { MAX_TAGS_IN_COOKIE } from "@/app/types/defaultData";
import { badResponse, successResponse } from "@/app/utils/util";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import * as v from "valibot";

export async function POST(request: NextRequest) {
    const get = cookies().get("interested-tags");
    const body = await request.json();

    const result = v.safeParse(StringArraySchema, body.tags);
    if (!result.success) return badResponse("Not tags");

    const tags = result.output;
    let currentTagsMap = new Map();
    if (get) {
        const currentTags = get.value.split(",").map((tag) => {
            const [name, timestamp] = tag.split(":");
            return { name, timestamp: parseInt(timestamp) };
        });

        currentTags.forEach((tag) => {
            currentTagsMap.set(tag.name, tag.timestamp);
        });
    }
    const now = Date.now();
    tags.forEach((tag) => {
        currentTagsMap.set(tag, now);
    });
    const tagArray = Array.from(currentTagsMap.entries());

    // Sort the tags by timestamp and keep the most recent 50
    const sortedTags = tagArray
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_TAGS_IN_COOKIE)
        .map(([name, timestamp]) => `${name}:${timestamp}`);

    const newTags = sortedTags.join(",");
    cookies().set("interested-tags", newTags);

    return successResponse(true);
}

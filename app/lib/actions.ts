"use server";
import { headers } from "next/headers";


export async function increaseTFGViews(id: number) {
    const forward = headers().get("x-forwarded-for");
const realip = headers().get("x-real-ip");
    return [forward, realip];
}

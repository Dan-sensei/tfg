import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { type, tfgId } = await req.json();

    const ip = req.headers.get("x-forwarded-for");
    console.log(ip)
    if(type === "visit"){

    }
    return new Response(JSON.stringify({status: 201, ip: ip}));
}
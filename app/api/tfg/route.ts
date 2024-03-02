import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { type, tfgId } = await req.json();

    const ip = req.headers.get("x-forwarded-for");
    const ip2 = req.headers.get("x-real-ip");
    const ip3 = req.ip;
    console.log(ip)
    if(type === "visit"){

    }
    return new Response(JSON.stringify({status: 201, ip: ip, ip2: ip2, ip3: ip3}));
}
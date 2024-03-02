import { NextRequest } from "next/server";
const requestIp = require('request-ip');

export async function POST(req: Request) {
    const { type, tfgId } = await req.json();

    const ip = req.headers.get("x-forwarded-for");
    const ip2 = req.headers.get("x-real-ip");
    const ip4 = requestIp.getClientIp(req);
    console.log(ip)
    if(type === "visit"){

    }
    return new Response(JSON.stringify({status: 201, ip: ip, ip2: ip2, ip4: ip4}));
}
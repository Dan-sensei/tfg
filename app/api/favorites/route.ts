import prisma from "@/app/utils/db";

export async function GET(request: Request) {
    return new Response("GET FACHERO");
}

export async function POST(request: Request) {
    const {ids} = await request.json();
    console.log(ids)
    const favorites = await prisma.tFG.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
            thumbnail: true,
            title: true,
            description: true,
            views: true,
            score: true,
            pages: true,
            createdAt: true,
        }
    });
    return new Response(JSON.stringify(favorites));
}

/*
interface Handler{
    (req: NextApiRequest, res: NextApiResponse): void
}
const GET: Handler = async (req, res) => {
    const recents = await prisma.tFG.findMany({
        select: {
            id: true,
            thumbnail: true,
            title: true,
            description: true,
            views: true,
            score: true,
            pages: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    res.status(200).json(recents);
}

const POST: Handler = async (req, res) => {
    const { dataArray } = req.body;
    console.log("holo")
    console.log(dataArray)
    return;
    try {
        const data = await prisma.tFG.findMany({
            where: {
                id: {
                    in: dataArray,
                },
            },
        });
        res.status(200).json({ data });
    } 
    catch (error) {
        console.error('Error querying data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const ERROR: Handler = (req, res) => {
    res.status(505).json({message: 'Method not allowed'})
}
const REQUESTS: { [key: string]: Handler } ={
    'GET': GET,
    'POST': POST,
    'ERROR': ERROR
}


export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    console.log("INDISDE")
    const HANDLER = REQUESTS[req.method ?? "ERROR"] ?? REQUESTS['ERROR'];
    HANDLER(req, res);

}

*/
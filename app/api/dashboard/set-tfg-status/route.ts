import { authOptions } from "@/app/lib/authOptions";
import { badResponse } from "@/app/utils/util";
import { getServerSession } from "next-auth";


export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Not signed in", 400);
    const userId = session.user.uid;
    try{

        
    } catch (err) {
        console.log(err);
        return badResponse("Error updating state", 500);
    }
}

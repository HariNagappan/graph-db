import {NextResponse} from "next/server";
import {currentUserId} from "@/lib/auth";
import {getNetwork} from "@/lib/graph";

// GET /api/network -> every other user with degree, mutual count and request status.
export async function GET() {
    const me = await currentUserId();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    try {
        return NextResponse.json({users: await getNetwork(me)});
    } catch (e) {
        console.error("Network error:", e);
        return NextResponse.json({error: "Failed to load network"}, {status: 500});
    }
}

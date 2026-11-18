import {NextResponse} from "next/server";
import {findUserByEmail} from "@/lib/sql";
import {ensureSetup} from "@/lib/setup";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
        return NextResponse.json({error: "Email is required"}, {status: 400});
    }

    try {
        await ensureSetup();
        return NextResponse.json({exists: !!findUserByEmail(email)}, {status: 200});
    } catch (e) {
        console.error("SQL error:", e);
        return NextResponse.json({error: "Database error"}, {status: 500});
    }
}

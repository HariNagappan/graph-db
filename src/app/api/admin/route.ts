import {NextResponse} from "next/server";
import {isAdmin} from "@/lib/auth";
import {getWholeGraph} from "@/lib/graph";
import {listUsers} from "@/lib/sql";

// GET /api/admin -> the whole Neo4j graph + the SQL users table (without password hashes). Admins only.
export async function GET() {
    if (!(await isAdmin())) return NextResponse.json({error: "Forbidden"}, {status: 403});

    try {
        return NextResponse.json({graph: await getWholeGraph(), users: listUsers()});
    } catch (e) {
        console.error("Admin error:", e);
        return NextResponse.json({error: "Failed to load admin data"}, {status: 500});
    }
}

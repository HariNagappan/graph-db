import {Suspense} from "react";
import UserConnections from "@/components/UserConnections";

export default function ConnectionsPage() {
    return (
        <Suspense fallback={<div className="m-5">Loading...</div>}>
            <UserConnections/>
        </Suspense>
    );
}

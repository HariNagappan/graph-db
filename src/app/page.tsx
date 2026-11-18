import {Suspense} from "react";
import AvailableUsers from "@/components/AvailableUsers";

export default function Page() {
    return (
        <Suspense fallback={<div className="m-5">Loading...</div>}>
            <AvailableUsers/>
        </Suspense>
    );
}

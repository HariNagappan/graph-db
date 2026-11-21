"use client";

import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import AppShell from "@/components/layout/AppShell";
import BrandMark from "@/components/UI/BrandMark";

/** Routes that render inside the signed-in application shell. */
const APP_ROUTES = new Set(["/", "/network", "/discover", "/requests", "/connections"]);

function Boot({label}: {label: string}) {
    return (
        <div className="gn gn-boot">
            <div className="gn-boot-inner" role="status" aria-live="polite">
                <BrandMark size={34} className="gn-boot-mark"/>
                <div className="gn-boot-line"><i/></div>
                <div className="gn-boot-text">{label}</div>
            </div>
        </div>
    );
}

function GuardedApp({children}: {children: React.ReactNode}) {
    const {data: session, status} = useSession();
    const router = useRouter();
    const isAdmin = session?.user?.role === "admin";

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/auth/login");
            return;
        }
        if (status === "authenticated" && isAdmin) {
            router.replace("/admin");
        }
    }, [status, isAdmin, router]);

    if (status !== "authenticated" || isAdmin) {
        return <Boot label={isAdmin ? "Opening the admin console" : "Loading your network"}/>;
    }

    return <AppShell>{children}</AppShell>;
}

export default function AppChrome({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    if (!APP_ROUTES.has(pathname)) return <>{children}</>;
    return <GuardedApp>{children}</GuardedApp>;
}

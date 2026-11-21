"use client";

import {useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {Menu, Search} from "lucide-react";
import UserMenu from "@/components/layout/UserMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function TopBar({onMenu}: {onMenu: () => void}) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const search = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        const value = typeof q === "string" ? q.trim() : "";
        router.push(value ? `/discover?q=${encodeURIComponent(value)}` : "/discover");
    };

    return (
        <header className="gn-top">
            <button
                type="button"
                className="gn-iconbtn gn-menu-btn"
                onClick={onMenu}
                aria-label="Open navigation"
            >
                <Menu size={18}/>
            </button>

            <form className="gn-search" onSubmit={search} role="search">
                <span className="gn-search-ico"><Search size={15}/></span>
                <input
                    ref={inputRef}
                    type="search"
                    name="q"
                    placeholder="Search people"
                    aria-label="Search people by name"
                    autoComplete="off"
                />
                <span className="gn-kbd" aria-hidden="true">Ctrl K</span>
            </form>

            <div className="gn-top-right">
                <ThemeToggle/>
                <span className="gn-top-sep" aria-hidden="true"/>
                <UserMenu/>
            </div>
        </header>
    );
}

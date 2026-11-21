"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useSession, signOut} from "next-auth/react";
import {ChevronDown, LogOut, User, Users} from "lucide-react";
import {AvatarRing} from "@/components/UI/Avatar";

export default function UserMenu() {
    const {data: session} = useSession();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    if (!session?.user) return null;
    const name = session.user.name ?? "Member";
    const href = `/connections?user_id=${encodeURIComponent(session.user.id)}`;

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                className="gn-userbtn"
                style={{width: "auto", padding: "4px 6px 4px 4px"}}
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Open profile menu"
            >
                <AvatarRing name={name} degree={0} status="self" size="sm"/>
                <span className="gn-userbtn-txt">
                    <span className="gn-userbtn-name">{name}</span>
                    <span className="gn-userbtn-role">Member</span>
                </span>
                <ChevronDown size={14}/>
            </button>

            {open && (
                <div className="gn-menu" role="menu" style={{right: 0, top: "calc(100% + 8px)"}}>
                    <div className="gn-menu-head">
                        <div style={{fontSize: 12.5, fontWeight: 650}}>{name}</div>
                        <div className="gn-tiny gn-dim" style={{marginTop: 2}}>{session.user.email}</div>
                    </div>
                    <Link className="gn-menu-item" href={href} role="menuitem" onClick={() => setOpen(false)}>
                        <User size={15}/>My profile
                    </Link>
                    <Link className="gn-menu-item" href="/network" role="menuitem" onClick={() => setOpen(false)}>
                        <Users size={15}/>My connections
                    </Link>
                    <div className="gn-menu-sep"/>
                    <button
                        type="button"
                        className="gn-menu-item"
                        role="menuitem"
                        onClick={() => void signOut({callbackUrl: "/auth/login"})}
                    >
                        <LogOut size={15}/>Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

import type {ConnectionStatus} from "@/components/people/types";
import {displayDegree, degreeLabel, initials, tint} from "@/components/people/helpers";

export type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl";

export function Avatar({
    name,
    size = "md",
    className = "",
}: {
    name: string;
    size?: AvatarSize;
    className?: string;
}) {
    return (
        <span className={`gn-av gn-av-${size} ${tint(name)} ${className}`} aria-hidden="true">
            {initials(name)}
        </span>
    );
}

/**
 * Avatar inside the degree ring. The ring is the product's core encoding:
 * solid violet = 1st, dashed cyan = 2nd, dotted lavender = 3rd, hairline = outside.
 */
export function AvatarRing({
    name,
    degree,
    status = "none",
    size = "md",
}: {
    name: string;
    degree: number | null;
    status?: ConnectionStatus;
    size?: AvatarSize;
}) {
    const d = displayDegree({name, degree, status, id: "", mutual: 0});
    const ring = d === null ? 0 : d;
    return (
        <span className={`gn-ring gn-ring-${ring}`}>
            <Avatar name={name} size={size}/>
        </span>
    );
}

export function DegreeBadge({status, degree}: {status: ConnectionStatus; degree: number | null}) {
    if (status === "self") return <span className="gn-deg gn-deg-self">You</span>;
    const d = status === "connected" ? 1 : degree;
    if (d === null) return <span className="gn-deg gn-deg-0">Outside</span>;
    return (
        <span className={`gn-deg gn-deg-${d}`}>
            {degreeLabel(d)}
        </span>
    );
}

"use client";

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {ArrowLeft, Compass, Lock, Users} from "lucide-react";
import {useNetwork} from "@/components/network/NetworkProvider";
import type {ProfileData} from "@/components/people/types";
import {degreePhrase, firstName, plural} from "@/components/people/helpers";
import {AvatarRing, DegreeBadge} from "@/components/UI/Avatar";
import ConnectionActions from "@/components/people/ConnectionActions";
import PersonRow from "@/components/people/PersonRow";
import {EmptyState, ErrorState} from "@/components/UI/States";

export default function ProfileView() {
    const params = useSearchParams();
    const router = useRouter();
    const {me, counts, loading: networkLoading} = useNetwork();

    const rawId = params.get("user_id");
    const id = rawId ?? me?.id ?? null;

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!rawId && me?.id) {
            router.replace(`/connections?user_id=${encodeURIComponent(me.id)}`, {scroll: false});
        }
    }, [rawId, me?.id, router]);

    const load = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/profile?user_id=${encodeURIComponent(id)}`, {cache: "no-store"});
            if (res.status === 404) {
                setProfile(null);
                setError("That person is not in the graph.");
                return;
            }
            if (!res.ok) {
                throw new Error(
                    res.status === 401
                        ? "Your session expired. Sign in again to continue."
                        : "Could not load this profile. The graph may be unreachable."
                );
            }
            setProfile(await res.json() as ProfileData);
        } catch (e) {
            setProfile(null);
            setError(e instanceof Error ? e.message : "Could not load this profile.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void load();
    }, [load]);

    const back = (
        <Link className="gn-btn gn-btn-ghost gn-btn-sm gn-backlink" href="/network">
            <ArrowLeft size={14}/>Back to my network
        </Link>
    );

    if (!id && !networkLoading) {
        return (
            <div>
                {back}
                <ErrorState
                    title="No profile selected"
                    message="Open a person from your network or from discovery to view their profile."
                />
            </div>
        );
    }

    if (loading || networkLoading || !profile) {
        if (error) {
            return (
                <div>
                    {back}
                    <ErrorState
                        title="Profile unavailable"
                        message={error}
                        onRetry={() => void load()}
                    />
                </div>
            );
        }
        return (
            <div>
                {back}
                <div className="gn-skeleton-page" role="status" aria-live="polite">
                    <span className="gn-sr">Loading profile…</span>
                    <div className="gn-skel" style={{height: 168, borderRadius: 14}}/>
                    <div className="gn-2col">
                        <div className="gn-skel" style={{height: 300, borderRadius: 14}}/>
                        <div className="gn-skel" style={{height: 220, borderRadius: 14}}/>
                    </div>
                </div>
            </div>
        );
    }

    const {person, mutual, connections} = profile;
    const isSelf = person.status === "self";
    const canSee = connections !== null;
    const degree = person.status === "connected" ? 1 : person.degree;
    const connectionsValue = canSee ? String(connections.length) : "—";
    const connectionLabel = canSee ? "connections" : "connections hidden";
    const secondValue = isSelf ? counts.second + counts.third : person.mutual;
    const secondLabel = isSelf ? "within 2 steps" : "mutual";

    const meta = isSelf
        ? "This is you. Your network is everything below."
        : person.status === "connected"
            ? `1st degree connection · ${person.mutual > 0 ? plural(person.mutual, "mutual connection") : "no mutual connections"}`
            : person.degree === null
                ? "No path to you within three steps."
                : `${degreePhrase(person.degree)} · ${person.mutual > 0 ? plural(person.mutual, "mutual connection") : "no mutual connections"}`;

    const connectionTitle = isSelf ? "Your connections" : `${firstName(person.name)}’s connections`;

    return (
        <div>
            {back}

            <div className="gn-card gn-profile-hero">
                <div className="gn-profile-hero-main">
                    <AvatarRing
                        name={person.name}
                        degree={person.degree}
                        status={person.status}
                        size="2xl"
                    />
                    <div className="gn-profile-id">
                        <div className="gn-flex gn-ic gn-gap-10 gn-flex-wrap">
                            <h1 className="gn-h1" style={{fontSize: 26}}>{person.name}</h1>
                            <DegreeBadge status={person.status} degree={person.degree}/>
                        </div>
                        <div className="gn-profile-meta">{meta}</div>
                        <div className="gn-profile-actions">
                            {isSelf ? (
                                <Link className="gn-btn gn-btn-secondary gn-btn-sm" href="/network">
                                    <Users size={14}/>My connections
                                </Link>
                            ) : (
                                <ConnectionActions person={person} onChanged={() => void load()} size="sm"/>
                            )}
                            <Link className="gn-btn gn-btn-ghost gn-btn-sm" href="/discover">
                                <Compass size={14}/>Discover people
                            </Link>
                        </div>
                    </div>
                    <div className="gn-profile-stats">
                        <div>
                            <div className="gn-profile-stat-v">{connectionsValue}</div>
                            <div className="gn-profile-stat-l">{connectionLabel}</div>
                        </div>
                        <div>
                            <div className="gn-profile-stat-v">{secondValue}</div>
                            <div className="gn-profile-stat-l">{secondLabel}</div>
                        </div>
                    </div>
                </div>
                <div className="gn-profile-note">
                    {isSelf
                        ? "Your degree rings, mutuals and connection lists are computed per pair in Neo4j."
                        : "GraphNet shows a full connection list only for you and your 1st degree connections."}
                </div>
            </div>

            <div className="gn-2col" style={{marginTop: 14}}>
                <div className="gn-stack">
                    <section className="gn-card">
                        <div className="gn-card-h">
                            <span className="gn-card-title">{connectionTitle}</span>
                            <span className="gn-card-meta">{canSee ? connections.length : "hidden"}</span>
                        </div>
                        {!canSee ? (
                            <EmptyState
                                icon={<Lock size={20}/>}
                                title="Visible after you connect"
                                description={`A full connection list is only visible for yourself and your 1st degree connections.${person.status === "sent" ? " Your request is still pending." : ""}`}
                            />
                        ) : connections.length === 0 ? (
                            <EmptyState
                                compact
                                title="No connections yet"
                                description={isSelf ? "Find people to start building your network." : `${firstName(person.name)} has not connected with anyone yet.`}
                            />
                        ) : (
                            connections.map((p) => (
                                <PersonRow key={p.id} person={p} protectConnected onChanged={() => void load()}/>
                            ))
                        )}
                    </section>
                </div>

                <div className="gn-stack">
                    {!isSelf && (
                        <section className="gn-card">
                            <div className="gn-card-h">
                                <span className="gn-card-title">Mutual connections</span>
                                <span className="gn-card-meta">{mutual.length}</span>
                            </div>
                            {mutual.length > 0 ? mutual.map((p) => (
                                <PersonRow key={p.id} person={p} protectConnected onChanged={() => void load()}/>
                            )) : (
                                <EmptyState
                                    compact
                                    title="No mutual connections"
                                    description={`You and ${firstName(person.name)} do not share a connection yet.`}
                                />
                            )}
                        </section>
                    )}

                    <section className="gn-card">
                        <div className="gn-card-h">
                            <span className="gn-card-title">Your network position</span>
                        </div>
                        <div className="gn-card-b">
                            <dl style={{margin: 0}}>
                                <div className="gn-kv"><dt>1st degree</dt><dd>{counts.first}</dd></div>
                                <div className="gn-kv"><dt>2nd degree</dt><dd>{counts.second}</dd></div>
                                <div className="gn-kv"><dt>3rd degree</dt><dd>{counts.third}</dd></div>
                                {!isSelf && (
                                    <div className="gn-kv">
                                        <dt>Distance to {firstName(person.name)}</dt>
                                        <dd>{degree === null ? "outside" : `${degree} ${degree === 1 ? "hop" : "hops"}`}</dd>
                                    </div>
                                )}
                            </dl>
                            <p className="gn-help-note">
                                Degrees are computed per pair in Neo4j, so they change the moment a connection is accepted.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

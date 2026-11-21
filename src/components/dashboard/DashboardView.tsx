"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {ArrowRight, Compass, Inbox, Users} from "lucide-react";
import {useNetwork} from "@/components/network/NetworkProvider";
import type {PeopleSort} from "@/components/people/helpers";
import {firstName, plural, sortPeople, suggestedPeople} from "@/components/people/helpers";
import OrbitMap from "@/components/dashboard/OrbitMap";
import PersonCard from "@/components/people/PersonCard";
import PersonRow from "@/components/people/PersonRow";
import MiniPersonRow from "@/components/people/MiniPersonRow";
import {EmptyState, ErrorState, PageLoading} from "@/components/UI/States";

const RING_CAP = 30;

export default function DashboardView() {
    const {me, people, buckets, counts, loading, error, refresh} = useNetwork();
    const [greeting, setGreeting] = useState("Welcome back");

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
    }, []);

    if (loading && !people) return <PageLoading/>;
    if (error && !people) {
        return <ErrorState message={error} onRetry={() => void refresh()}/>;
    }
    if (!people) return <PageLoading/>;

    const meName = me?.name ?? "You";
    const received = people.filter((p) => p.status === "received");
    const suggestions = suggestedPeople(people, 3);
    const hello = me?.name ? `${greeting}, ${firstName(me.name)}` : greeting;
    const capped =
        counts.first > RING_CAP || counts.second > RING_CAP || counts.third > RING_CAP;

    const sections: {key: string; title: string; hint: string; href: string; tone: string; sort: PeopleSort}[] = [
        {
            key: "first",
            title: "1st degree",
            hint: "People you know directly",
            href: "/network?degree=1",
            tone: "k1",
            sort: "name",
        },
        {
            key: "second",
            title: "2nd degree",
            hint: "One step beyond your connections",
            href: "/network?degree=2",
            tone: "k2",
            sort: "mutual",
        },
        {
            key: "third",
            title: "3rd degree",
            hint: "Two steps beyond your connections",
            href: "/network?degree=3",
            tone: "k3",
            sort: "mutual",
        },
    ];

    const stats = [
        {value: counts.first, label: "1st degree", tone: "k1"},
        {value: counts.second, label: "2nd degree", tone: "k2"},
        {value: counts.third, label: "3rd degree", tone: "k3"},
        {value: counts.received, label: "Requests waiting", tone: "k0"},
    ];

    return (
        <div>
            <div className="gn-page-head">
                <div className="gn-page-head-txt">
                    <div className="gn-eyebrow">Network overview</div>
                    <h1 className="gn-h1" style={{marginTop: 7}}>{hello}</h1>
                    <p className="gn-sub" style={{marginTop: 6, maxWidth: 560}}>
                        {plural(counts.first, "person", "people")} know you directly.{" "}
                        {plural(counts.second + counts.third, "person", "people")} more sit one or two steps out.
                    </p>
                </div>
                <div className="gn-page-head-actions">
                    <Link className="gn-btn gn-btn-secondary" href="/network">
                        <Users size={15}/>My network
                    </Link>
                    <Link className="gn-btn gn-btn-primary" href="/discover">
                        <Compass size={15}/>Find people
                    </Link>
                </div>
            </div>

            <div className="gn-stats">
                {stats.map((s) => (
                    <div className="gn-stat" key={s.label}>
                        <div className="gn-stat-v">{s.value}</div>
                        <div className="gn-stat-l">
                            <span className={`gn-stat-k ${s.tone}`}/>{s.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="gn-2col" style={{marginTop: 14}}>
                <section className="gn-card">
                    <div className="gn-card-h">
                        <span className="gn-card-title">Network map</span>
                        <span className="gn-card-meta">
                            {counts.inside} of {counts.total} inside 3 steps
                        </span>
                        <span className="gn-card-act">
                            <Link className="gn-btn gn-btn-ghost gn-btn-xs" href="/network">
                                Open<ArrowRight size={12}/>
                            </Link>
                        </span>
                    </div>
                    <div className="gn-card-b flush">
                        <div className="gn-map-body">
                            <div className="gn-map-legend">
                                {[
                                    {k: "k1", label: "1st degree", hint: "direct", value: counts.first},
                                    {k: "k2", label: "2nd degree", hint: "one step out", value: counts.second},
                                    {k: "k3", label: "3rd degree", hint: "two steps out", value: counts.third},
                                    {k: "k0", label: "Outside", hint: "no path in 3", value: counts.outside},
                                ].map((row) => (
                                    <div className="lg-row" key={row.label}>
                                        <span className="gn-orbit-key"><i className={row.k}/></span>
                                        <span>
                                            <span className="lg-label" style={{display: "block"}}>{row.label}</span>
                                            <span className="lg-hint" style={{display: "block"}}>{row.hint}</span>
                                        </span>
                                        <span className="lg-v">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="gn-grow" style={{height: "100%"}}>
                                <OrbitMap people={people} meName={meName}/>
                            </div>
                        </div>
                        {capped && (
                            <div className="gn-map-caption">
                                Showing up to {RING_CAP} people per ring so the map stays legible. Counts are exact.
                            </div>
                        )}
                    </div>
                </section>

                <div className="gn-stack">
                    <section className="gn-card">
                        <div className="gn-card-h">
                            <span className="gn-card-title">Requests</span>
                            <span className="gn-card-meta">{counts.received} waiting</span>
                            <span className="gn-card-act">
                                <Link className="gn-btn gn-btn-ghost gn-btn-xs" href="/requests">View all</Link>
                            </span>
                        </div>
                        {received.length > 0 ? (
                            received.slice(0, 3).map((p) => <PersonRow key={p.id} person={p}/>)
                        ) : (
                            <EmptyState
                                compact
                                icon={<Inbox size={20}/>}
                                title="No requests waiting"
                                description="New invitations will appear here. Discover people to send the first one."
                            />
                        )}
                        <div className="gn-card-f">
                            <span className="gn-tiny gn-dim">
                                <span className="gn-num" style={{color: "var(--g-text-2)"}}>{counts.sent}</span>{" "}
                                sent · awaiting response
                            </span>
                            <Link className="gn-btn gn-btn-ghost gn-btn-xs" style={{marginLeft: "auto"}} href="/requests">
                                View sent<ArrowRight size={12}/>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            <div className="gn-section-head">
                <h2 className="gn-h2">People you may know</h2>
                <span className="gn-hint-inline">Ranked by mutual connections</span>
                <Link className="gn-btn gn-btn-ghost gn-btn-sm" href="/discover">
                    See all<ArrowRight size={13}/>
                </Link>
            </div>
            {suggestions.length > 0 ? (
                <div className="gn-people">
                    {suggestions.map((p) => <PersonCard key={p.id} person={p}/>)}
                    {suggestions.length < 3 && (
                        <Link className="gn-person gn-person-cta" href="/discover" aria-label="Find more people">
                            <div className="gn-person-top">
                                <span className="gn-empty-ico"><Compass size={20}/></span>
                                <div className="gn-person-id">
                                    <span className="gn-person-name">Find more people</span>
                                    <div className="gn-person-meta">Search the whole network by name</div>
                                </div>
                            </div>
                            <div className="gn-person-b">
                                <span className="gn-btn gn-btn-ghost gn-btn-xs">
                                    Browse everyone<ArrowRight size={12}/>
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="gn-card">
                    <EmptyState
                        icon={<Compass size={20}/>}
                        title="No suggestions right now"
                        description="When people two or three steps away share a connection with you, they will appear here."
                        action={<Link className="gn-btn gn-btn-secondary gn-btn-sm" href="/discover">Browse everyone</Link>}
                    />
                </div>
            )}

            <div className="gn-section-head">
                <h2 className="gn-h2">Your network by degree</h2>
                <span className="gn-hint-inline">Every distance, computed per person in Neo4j</span>
                <Link className="gn-btn gn-btn-ghost gn-btn-sm" href="/network">
                    Open my network<ArrowRight size={13}/>
                </Link>
            </div>

            <div className="gn-degree-grid">
                {sections.map((section) => {
                    const list = buckets[section.key as "first" | "second" | "third"];
                    const top = sortPeople(list, section.sort).slice(0, 3);
                    return (
                        <section className="gn-card gn-degree-card" key={section.key}>
                            <div className="gn-card-h">
                                <span className={`gn-stat-k ${section.tone}`}/>
                                <span className="gn-card-title">{section.title}</span>
                                <span className="gn-card-meta">{list.length}</span>
                            </div>
                            <div>
                                {top.length > 0 ? top.map((p) => (
                                    <MiniPersonRow key={p.id} person={p}/>
                                )) : (
                                    <div className="gn-empty" style={{padding: "24px 16px"}}>
                                        <div className="gn-empty-t">Nobody in this band</div>
                                        <div className="gn-empty-d">Connect with more people and this fills up.</div>
                                    </div>
                                )}
                            </div>
                            <div className="gn-card-f">
                                <span className="gn-tiny gn-dim">{section.hint}</span>
                                <Link className="gn-btn gn-btn-ghost gn-btn-xs" href={section.href}>
                                    {list.length > 0 ? "View all" : "Find people"}
                                    <ArrowRight size={12}/>
                                </Link>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}

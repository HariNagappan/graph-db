'use client';
import {useCallback, useEffect, useState} from "react";
import GraphView, {GraphData} from "@/components/GraphView";

type UserRow = {id: string; email: string; role: string; created_at: string};

export default function AdminPage() {
    const [graph, setGraph] = useState<GraphData | null>(null);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        const res = await fetch("/api/admin", {cache: "no-store"});
        if (!res.ok) {
            setError(res.status === 403 ? "Admins only." : "Could not load admin data.");
            return;
        }
        const data = await res.json();
        setError("");
        setGraph(data.graph);
        setUsers(data.users);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (error) return <div className="m-5 text-red-500">{error}</div>;
    if (!graph) return <div className="m-5">Loading...</div>;

    const connected = graph.links.filter((l) => l.type === "CONNECTED").length;
    const requested = graph.links.length - connected;

    return (
        <div className="m-5">
            <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">Graph database (Neo4j)</div>
                <button onClick={load} className="cursor-pointer text-blue-500 hover:text-black text-sm">Refresh</button>
            </div>
            <div className="text-sm text-gray-600 mt-1 mb-3">
                {graph.nodes.length} :User nodes · {connected} CONNECTED · {requested} REQUESTED — drag nodes to move them
            </div>
            <div className="flex gap-5 text-xs text-gray-600 mb-2">
                <span><span className="inline-block w-6 h-0.5 bg-[#5423e7] align-middle mr-1"/>CONNECTED</span>
                <span><span className="inline-block w-6 border-t-2 border-dashed border-gray-400 align-middle mr-1"/>REQUESTED (arrow points to recipient)</span>
            </div>
            <GraphView data={graph}/>

            <div className="text-2xl font-bold mt-10">Relational database (SQLite) — users table</div>
            <div className="text-sm text-gray-600 mt-1 mb-3">
                Login credentials only. <code>id</code> matches the <code>:User</code> node id in Neo4j.
                Password hashes are stored but never sent to the browser.
            </div>
            <div className="overflow-x-auto border border-gray-600 rounded-2xl">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-2">id</th>
                        <th className="p-2">email</th>
                        <th className="p-2">password_hash</th>
                        <th className="p-2">role</th>
                        <th className="p-2">created_at</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="border-t border-gray-200">
                            <td className="p-2 font-mono text-xs">{u.id}</td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2 text-gray-400">(hidden)</td>
                            <td className="p-2">{u.role}</td>
                            <td className="p-2 whitespace-nowrap">{u.created_at}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {CircleAlert, GitBranch, Loader2} from "lucide-react";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";
import {useAuthStore} from "@/stores/authStore";
import {AvatarRing} from "@/components/UI/Avatar";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {email, password} = useAuthStore((state) => state.formData);

    useEffect(() => {
        if (!email || !password) router.replace("/auth/login");
    }, [email, password, router]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = name.trim();

        if (trimmed.length < 3 || trimmed.length > 60) {
            setError("Name must be 3-60 characters long");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, name: trimmed, password}),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error ?? "Could not create account");
                return;
            }

            const response = await signIn("credentials", {redirect: false, email, password});
            if (!response || response.error) {
                setError("Account created, but sign in failed. Please sign in again.");
                return;
            }
            // Full-page navigation so the in-memory password is dropped.
            window.location.replace("/");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthFormWrapper step={3}>
            <h1 className="gn-auth-title">What should people call you?</h1>
            <p className="gn-auth-sub">
                This name sits on your node in the graph and on every connection card.
            </p>

            <form onSubmit={handleSubmit} className="gn-auth-body" method="post">
                <div className="gn-field">
                    <label className="gn-label" htmlFor="auth-name">Full name</label>
                    <input
                        id="auth-name"
                        type="text"
                        name="name"
                        required
                        autoFocus
                        autoComplete="name"
                        maxLength={60}
                        placeholder="Jordan Mbeki"
                        className={`gn-input${error ? " is-error" : ""}`}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError("");
                        }}
                    />
                    <span className="gn-hint">Between 3 and 60 characters. Spaces are allowed between names.</span>
                    {error && <div className="gn-err"><CircleAlert size={14}/>{error}</div>}
                </div>

                <div className="gn-auth-preview">
                    <AvatarRing
                        name={name.trim() || "New Person"}
                        degree={null}
                        status="none"
                        size="md"
                    />
                    <div style={{minWidth: 0}}>
                        <div className="gn-tiny gn-dim">Your node preview</div>
                        <div style={{fontSize: 12.5, fontWeight: 600, marginTop: 2}}>
                            {name.trim() || "New Person"}
                        </div>
                    </div>
                    <GitBranch size={15} className="gn-dim" style={{marginLeft: "auto"}}/>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="gn-btn gn-btn-primary gn-btn-lg gn-btn-block"
                >
                    {loading ? <><Loader2 size={16} className="gn-spin"/>Creating account…</> : "Create account"}
                </button>
            </form>

            <p className="gn-auth-foot">
                You start with no connections. Discover people to send your first request.
            </p>
        </AuthFormWrapper>
    );
}

"use client";

import React, {useState} from "react";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "next/navigation";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";
import {CircleAlert, Loader2} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {formData: {email: savedEmail}, setFormData, resetFormData} = useAuthStore();

    async function credLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const email = (new FormData(e.currentTarget).get("email") as string).trim().toLowerCase();
        if (!email) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/check-email", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });
            if (!res.ok) {
                setError("Something went wrong. Please try again.");
                return;
            }
            const {exists} = await res.json();
            resetFormData();
            setFormData({email});
            router.push(exists ? "/auth/check-password" : "/auth/create-password");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthFormWrapper>
            <h1 className="gn-auth-title">Sign in or create an account</h1>
            <p className="gn-auth-sub">
                Enter your email. We check it against the account table, then take you to the right next step.
            </p>

            <form onSubmit={credLogin} className="gn-auth-body" method="post">
                <div className="gn-field">
                    <label className="gn-label" htmlFor="auth-email">Email</label>
                    <input
                        id="auth-email"
                        name="email"
                        type="email"
                        required
                        autoFocus
                        autoComplete="email"
                        placeholder="you@company.com"
                        defaultValue={savedEmail ?? ""}
                        className={`gn-input${error ? " is-error" : ""}`}
                        onChange={() => error && setError("")}
                    />
                    {error && <div className="gn-err"><CircleAlert size={14}/>{error}</div>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="gn-btn gn-btn-primary gn-btn-lg gn-btn-block"
                >
                    {loading ? <><Loader2 size={16} className="gn-spin"/>Checking…</> : "Continue"}
                </button>

                <div className="gn-auth-demo">
                    <span className="gn-dim">Demo network</span>
                    <span className="gn-mono">alice@demo.test</span>
                    <span className="gn-dim">·</span>
                    <span className="gn-mono">admin@gmail.com</span>
                </div>
            </form>

            <p className="gn-auth-foot">
                By continuing you agree to the terms of use and the privacy notice.
            </p>
        </AuthFormWrapper>
    );
}

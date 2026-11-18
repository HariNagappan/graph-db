'use client';
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";
import {useAuthStore} from "@/stores/authStore";

const inputStyle = " my-2 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#5423e7] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {email, password} = useAuthStore((state) => state.formData);

    useEffect(() => {
        if (!email || !password) router.replace("/auth/login");
    }, [email, password, router]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const name = (new FormData(e.currentTarget).get("name") as string).trim();

        if (name.length < 3 || name.length > 60) {
            setError("Name must be 3-60 characters long");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, name, password}),
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
            // Navigate to the full page (not client-side) so the in-memory password is dropped.
            window.location.replace("/");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthFormWrapper>
            <div className="self-start text-3xl tracking-wide font-semibold">What&apos;s your name?</div>
            <div className="self-start text-lg mb-6">This is how other people in your network will see you.</div>

            <form onSubmit={handleSubmit} className="w-full" method="post">
                <input type="text" name="name" autoFocus autoComplete="name" maxLength={60} placeholder="Full name"
                       className={inputStyle} onChange={() => setError("")}/>
                <button type="submit" disabled={loading}
                        className="w-full tracking-wider transition-all duration-200 bg-[#5423e7] cursor-pointer hover:bg-purple-700 rounded-full px-9 py-3.5 text-white text-lg font-semibold mt-10 disabled:opacity-60">
                    {loading ? "Creating account..." : "Continue"}
                </button>
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </form>
        </AuthFormWrapper>
    )
}

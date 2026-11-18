'use client';
import React, {useState} from "react";
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "next/navigation";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {setFormData, resetFormData} = useAuthStore();

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
            <div className="self-start text-3xl tracking-wide font-semibold">Sign in or create an account</div>
            <form onSubmit={credLogin} className="w-full mt-8" method="post">
                <input type="email" required autoComplete="email" name="email" placeholder="Email"
                       className="placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#1568e3] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"/>
                <button type="submit" disabled={loading}
                        className="w-full cursor-pointer tracking-wider transition-all duration-200 bg-[#5423e7] rounded-full px-9 py-3.5 text-white hover:bg-purple-800 text-lg font-semibold mt-5 disabled:opacity-60">
                    {loading ? "Please wait..." : "Continue"}
                </button>
                {error && <div className="text-red-500 text-sm font-bold mt-2">{error}</div>}
            </form>
        </AuthFormWrapper>
    )
}

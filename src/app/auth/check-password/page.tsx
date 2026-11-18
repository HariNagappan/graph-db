'use client';
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {signIn} from "next-auth/react";
import Link from "next/link";
import {useAuthStore} from "@/stores/authStore";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";

const inputStyle = " mt-6 mb-2 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#5423e7] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"
const buttonStyle = "w-full transition-all cursor-pointer duration-200 tracking-wider rounded-full px-9 py-3.5 text-lg font-semibold mt-7 bg-[#5423e7] text-white hover:bg-purple-700 disabled:opacity-60"

export default function CheckPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {email} = useAuthStore((state) => state.formData);

    // The email lives in memory only; after a page refresh start again.
    useEffect(() => {
        if (!email) router.replace("/auth/login");
    }, [email, router]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const res = await signIn("credentials", {redirect: false, email, password});
        setLoading(false);

        if (!res || res.error) {
            setError("Incorrect password");
        } else {
            window.location.replace("/");
        }
    }

    return (
        <AuthFormWrapper>
            <div className="self-start text-3xl tracking-wide font-semibold">Enter your password</div>
            <div className="mt-2 self-start text-lg tracking-wide">
                {email} <Link href="/auth/login" className="text-sm text-blue-500 ml-2">Change</Link>
            </div>

            <form onSubmit={handleSubmit} className="w-full" method="post">
                <input type="password" name="password" required autoFocus autoComplete="current-password"
                       placeholder="Password" className={inputStyle}
                       value={password} onChange={(e) => {setPassword(e.target.value); setError("");}}/>
                <button type="submit" disabled={loading} className={buttonStyle}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
                {error && <div className="text-lg text-red-500 mt-4">{error}</div>}
            </form>
        </AuthFormWrapper>
    )
}

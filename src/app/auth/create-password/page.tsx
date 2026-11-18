'use client';
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import AuthFormWrapper from "@/components/Auth/AuthFormWrapper";
import {useAuthStore} from "@/stores/authStore";

const inputStyle = " mt-6 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#5423e7] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"
const buttonStyle = "w-full transition-all duration-200 tracking-wider rounded-full px-9 py-3.5 text-lg font-semibold mt-2 "
const listStyle = " px-2.5 text-base";

const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[\W_]/.test(pwd)) score++;
    return score;
};

export default function CreatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const {formData: {email}, setFormData} = useAuthStore();

    useEffect(() => {
        if (!email) router.replace("/auth/login");
    }, [email, router]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canContinue) return;
        setFormData({password});
        router.push("/auth/register");
    }

    const strength = getStrength(password);
    const canContinue = password.length >= 6 && password.length <= 64 && strength >= 2;
    const strengthLabel = ['Weak', 'Fair', 'Strong', 'Very Strong'][strength - 1] || 'Weak';
    const progressColors = ['bg-gray-400', 'bg-yellow-300', 'bg-green-500', 'bg-green-500'];

    return (
        <AuthFormWrapper>
            <div className="self-start text-3xl tracking-wide font-semibold">Create a password</div>
            <div className="mt-2 self-start text-lg">
                New account for {email} <Link href="/auth/login" className="text-sm text-blue-500 ml-2">Change</Link>
            </div>

            <form onSubmit={handleSubmit} className="w-full" method="post">
                <input type="password" name="password" autoFocus autoComplete="new-password" maxLength={64}
                       placeholder="Password" className={inputStyle}
                       value={password} onChange={(e) => setPassword(e.target.value)}/>

                <div className="flex justify-between text-sm text-gray-600 mt-2 mb-0.5">
                    <span>Password strength</span>
                    <span className="font-bold">{strengthLabel}</span>
                </div>

                <div className="h-2 rounded-full bg-gray-200 overflow-hidden mt-2 mb-5">
                    <div
                        className={`h-full transition-all duration-300 ${progressColors[strength - 1] || 'bg-gray-300'}`}
                        style={{width: `${(strength / 4) * 100}%`}}
                    />
                </div>

                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1 mb-6">
                    {password.length < 6 && <li className={listStyle}>Includes 6-64 characters</li>}
                    {(!/\d/.test(password) || !/[a-zA-Z]/.test(password)) && <li className={listStyle}>Combines letters and numbers</li>}
                    {!(/[\W_]/.test(password)) && <li className={listStyle}>A special character ~ # @ $ % & ! * _ ? ^ -</li>}
                </ul>

                <button type="submit" disabled={!canContinue}
                        className={`${buttonStyle} ${canContinue ?
                            'bg-[#5423e7] text-white hover:bg-purple-700 cursor-pointer' : 'bg-purple-200 text-white cursor-not-allowed'}`}>
                    Continue
                </button>
            </form>
        </AuthFormWrapper>
    )
}

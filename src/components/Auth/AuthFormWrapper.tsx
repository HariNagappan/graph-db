import Link from "next/link";
import React, {ReactNode} from "react";

export default function AuthFormWrapper({children}: {children: ReactNode}) {
    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-[460px]">
                <div className="flex flex-col items-center">
                    <Link href="/" className="text-4xl font-bold color-primary m-9 mb-16">GraphNet</Link>
                    {children}
                </div>
            </div>
        </div>
    )
}

import Link from "next/link";
import {Database, GitBranch} from "lucide-react";
import BrandMark from "@/components/UI/BrandMark";
import Constellation from "@/components/Auth/Constellation";

export default function AuthFormWrapper({
    children,
    step,
}: {
    children: React.ReactNode;
    step?: 1 | 2 | 3;
}) {
    return (
        <div className="gn gn-auth" data-mode="app">
            <div className="gn-auth-art">
                <Link href="/" className="gn-auth-brand" style={{padding: 0}}>
                    <BrandMark size={28}/>
                    <span className="gn-wordmark" style={{fontSize: 17}}>GraphNet</span>
                </Link>

                <div className="gn-auth-art-mid">
                    <Constellation/>
                </div>

                <div className="gn-auth-claim">
                    <h2>Your network is not a list. It has a shape.</h2>
                    <p>
                        GraphNet maps who you know, who they know, and how far apart you really are.
                        Every connection is an edge you can see.
                    </p>
                    <div className="gn-auth-proof">
                        <span className="gn-pf"><GitBranch size={13}/>Three degrees, mapped</span>
                        <span className="gn-pf"><Database size={13}/>Neo4j graph core</span>
                    </div>
                </div>
            </div>

            <div className="gn-auth-panel">
                <div className="gn-auth-form">
                    <div className="gn-auth-brand gn-auth-brand-mobile">
                        <BrandMark size={24}/>
                        <span className="gn-wordmark" style={{fontSize: 15}}>GraphNet</span>
                    </div>

                    {step && (
                        <div className="gn-auth-step">
                            {[1, 2, 3].map((n) => (
                                <i key={n} className={n <= step ? "on" : ""}/>
                            ))}
                            <span>Step {step} of 3</span>
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}

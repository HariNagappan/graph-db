import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Provider from "@/components/SessionProvider";
import AppChrome from "@/components/layout/AppChrome";
import {ThemeProvider} from "@/components/theme/ThemeProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "GraphNet",
        template: "%s · GraphNet",
    },
    description: "A professional network whose shape comes from a Neo4j graph: 1st, 2nd and 3rd degree connections, mutuals, and a live graph console.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem("graphnet-theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`,
                    }}
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} gn`}>
                <ThemeProvider>
                    <Provider>
                        <AppChrome>{children}</AppChrome>
                    </Provider>
                </ThemeProvider>
            </body>
        </html>
    );
}

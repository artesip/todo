import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/query-client/query-client";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Todo",
};


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru">
            <body>
                <QueryProvider>
                    <div className="h-screen">
                        {children}
                    </div>
                </QueryProvider>
                
                <Toaster />
            </body>
        </html>
    )
}

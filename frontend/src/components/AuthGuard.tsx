"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Menu, FileText } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("user-role");

        if (!role && pathname !== "/login") {
            router.push("/login");
        } else if (role && pathname === "/login") {
            router.push("/");
        } else {
            setAuthorized(true);
        }
    }, [pathname, router]);

    if (!authorized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (pathname === "/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen w-full bg-black">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <FileText className="text-teal-500 w-6 h-6" />
                        <span className="font-bold text-xl tracking-tighter text-white">ContractFlow</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 lg:ml-72 bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 sm:p-6 lg:p-10 overflow-x-hidden">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

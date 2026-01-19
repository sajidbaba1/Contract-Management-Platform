"use client";

import Link from "next/link";
import { LayoutDashboard, PlusCircle, FileText, UserCog, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [role, setRole] = useState("Admin");

    useEffect(() => {
        const savedRole = localStorage.getItem('user-role');
        if (savedRole) {
            setRole(savedRole);
        }
    }, []);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={clsx(
                "w-72 border-r border-zinc-800 flex flex-col pt-8 bg-zinc-950/80 backdrop-blur-2xl fixed inset-y-0 z-[70] transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-6 mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <FileText className="text-zinc-950 w-6 h-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tighter text-white">ContractFlow</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <div className="text-[10px] font-bold text-zinc-500 px-4 mb-2 uppercase tracking-widest">Navigation</div>
                    <Link
                        href="/"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all text-zinc-400 hover:text-white group"
                    >
                        <LayoutDashboard size={20} className="group-hover:text-teal-400 transition-colors" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/blueprints/new"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all text-zinc-400 hover:text-white group"
                    >
                        <PlusCircle size={20} className="group-hover:text-teal-400 transition-colors" />
                        <span>New Blueprint</span>
                    </Link>

                    <div className="pt-6">
                        <div className="text-[10px] font-bold text-zinc-500 px-4 mb-2 uppercase tracking-widest">Developer</div>
                        <a
                            href="http://localhost:5140/scalar/v1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all text-zinc-400 hover:text-white group"
                        >
                            <FileText size={20} className="group-hover:text-teal-400 transition-colors" />
                            <span>API Docs (Scalar)</span>
                        </a>
                    </div>
                </nav>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900/30">
                    <div className="text-[10px] font-bold text-zinc-500 mb-4 uppercase tracking-widest">Mock Session</div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold ring-2 ring-zinc-800">
                            {role.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">{role} User</span>
                            <span className="text-[10px] text-teal-500 font-medium">Session Active</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('user-role');
                            window.location.href = '/login';
                        }}
                        className="w-full py-2 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-bold hover:bg-red-900/40 transition-all flex items-center justify-center gap-2"
                    >
                        <UserCog size={14} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

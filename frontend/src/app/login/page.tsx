"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCircle, UserCog, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = (role: string) => {
        localStorage.setItem("user-role", role);
        router.push("/");
        setTimeout(() => window.location.reload(), 100);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden text-white">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-10 rounded-3xl border border-zinc-800 shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-xl shadow-teal-500/20 mb-6">
                        <FileText className="text-zinc-950 w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">ContractFlow</h1>
                    <p className="text-zinc-500 mt-2 text-sm italic">Assignemnt Mock Authentication</p>
                    <div className="w-12 h-1 bg-zinc-800 rounded-full mt-6" />
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center mb-6">Select your role to continue</p>

                    {[
                        { id: "Admin", icon: ShieldCheck, desc: "Total control over all contracts and blueprints" },
                        { id: "Approver", icon: UserCircle, desc: "Authorized to Approve or Revoke pending contracts" },
                        { id: "Signer", icon: UserCog, desc: "Authorized to sign Sent/Pending documents" }
                    ].map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleLogin(role.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-800/50 transition-all group text-left"
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-teal-400 transition-colors">
                                <role.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <span className="block text-sm font-bold text-white group-hover:text-teal-400 transition-colors">{role.id}</span>
                                <span className="block text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{role.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <p className="text-[10px] text-zinc-600 text-center mt-10 uppercase tracking-widest">
                    This is a mock login for demonstration purposes.
                </p>
            </motion.div>
        </div>
    );
}

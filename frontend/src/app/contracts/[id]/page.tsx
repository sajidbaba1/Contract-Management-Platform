"use client";

import { useEffect, useState } from "react";
import { contractApi } from "@/lib/api";
import { Contract, ContractStatus } from "@/lib/types";
import {
    ArrowLeft,
    Lock,
    Unlock,
    CheckCircle2,
    Send,
    Ban,
    ThumbsUp,
    History,
    Clock,
    FileText
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import { AxiosError } from "axios";
import { toast } from 'react-toastify';

export default function ContractDetails() {
    const { id } = useParams();
    const [contract, setContract] = useState<Contract | null>(null);
    const [loading, setLoading] = useState(true);
    const [transitioning, setTransitioning] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState("Admin");

    useEffect(() => {
        const role = localStorage.getItem("user-role") || "Admin";
        setCurrentUserRole(role);
    }, []);

    useEffect(() => {
        if (id) fetchContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchContract = async () => {
        try {
            const { data } = await contractApi.getById(id as string);
            setContract(data);
        } catch (error) {
            console.error("Failed to fetch contract", error);
            toast.error("Failed to load contract. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleTransition = async (newStatus: ContractStatus) => {
        if (!contract) return;
        setTransitioning(true);
        try {
            await contractApi.transition(contract.id, newStatus);
            toast.success(`Contract status updated to ${newStatus}!`);
            await fetchContract();
        } catch (error) {
            const axiosError = error as AxiosError<string>;
            toast.error(axiosError.response?.data || "Failed to transition status");
        } finally {
            setTransitioning(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-zinc-500">Loading document...</div>;
    if (!contract) return <div className="p-12 text-center text-red-500">Document not found.</div>;

    const isLocked = contract.status === ContractStatus.Locked;
    const isRevoked = contract.status === ContractStatus.Revoked;

    const getAvailableActions = () => {
        if (isLocked || isRevoked) return [];

        const isAdmin = currentUserRole === "Admin";
        const isApprover = currentUserRole === "Approver";
        const isSigner = currentUserRole === "Signer";

        switch (contract.status) {
            case ContractStatus.Created:
                return [
                    ...(isAdmin || isApprover ? [{ status: ContractStatus.Approved, icon: ThumbsUp, label: "Approve", color: "bg-purple-600 hover:bg-purple-500" }] : []),
                    ...(isAdmin || isApprover ? [{ status: ContractStatus.Revoked, icon: Ban, label: "Revoke", color: "bg-red-900/50 hover:bg-red-800 text-red-200" }] : [])
                ];
            case ContractStatus.Approved:
                return [
                    ...(isAdmin || isApprover ? [{ status: ContractStatus.Sent, icon: Send, label: "Send to Signer", color: "bg-amber-600 hover:bg-amber-500" }] : [])
                ];
            case ContractStatus.Sent:
                return [
                    ...(isAdmin || isSigner ? [{ status: ContractStatus.Signed, icon: CheckCircle2, label: "Mark as Signed", color: "bg-green-600 hover:bg-green-500" }] : []),
                    ...(isAdmin || isApprover ? [{ status: ContractStatus.Revoked, icon: Ban, label: "Revoke", color: "bg-red-900/50 hover:bg-red-800 text-red-200" }] : [])
                ];
            case ContractStatus.Signed:
                return [
                    ...(isAdmin ? [{ status: ContractStatus.Locked, icon: Lock, label: "Lock Contract", color: "bg-zinc-700 hover:bg-zinc-600" }] : [])
                ];
            default:
                return [];
        }
    };

    const actions = getAvailableActions();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-4 w-full">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">{contract.name}</h1>
                                <span className={clsx("status-badge shrink-0", `status-${contract.status.toLowerCase()}`)}>
                                    {contract.status}
                                </span>
                            </div>
                            <p className="text-zinc-500 mt-2 flex items-center gap-2">
                                <FileText size={16} />
                                Based on {contract.blueprintName} blueprint
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            {actions.map((action) => (
                                <button
                                    key={action.status}
                                    disabled={transitioning}
                                    onClick={() => handleTransition(action.status as ContractStatus)}
                                    className={clsx(
                                        "premium-button flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all text-xs sm:text-sm",
                                        action.color
                                    )}
                                >
                                    <action.icon size={16} />
                                    <span>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Document Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-2xl border border-zinc-800 p-8 min-h-[500px] relative">
                        {isLocked && (
                            <div className="absolute top-4 right-4 text-zinc-600 flex items-center gap-1 text-xs uppercase tracking-widest font-bold">
                                <Lock size={14} /> Immutable
                            </div>
                        )}

                        <div className="space-y-10">
                            <div className="border-b border-zinc-800 pb-6">
                                <h2 className="text-2xl font-bold text-zinc-100 italic tracking-tight">Contract Execution Copy</h2>
                                <p className="text-zinc-500 text-xs mt-1">Ref ID: {contract.id.slice(0, 8).toUpperCase()}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {Object.entries(contract.fieldData || {}).map(([label, value], idx) => (
                                    <div key={label} className="space-y-2 group relative">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</label>
                                            <span className="text-[10px] text-zinc-800 font-mono opacity-0 group-hover:opacity-100 transition-opacity">Grid: {idx}, {idx}</span>
                                        </div>
                                        <div className="text-lg text-zinc-200 border-l-2 border-teal-500/30 pl-4 py-1">
                                            {typeof value === 'boolean' ? (value ? "Checked / Agreed" : "Unchecked") : (value || "—")}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-20 pt-10 border-t border-zinc-800 flex justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase text-zinc-600 font-bold">Executed On</p>
                                    <p className="text-sm font-medium text-white">{new Date(contract.createdAt).toLocaleDateString()}</p>
                                </div>
                                {contract.status === ContractStatus.Signed || contract.status === ContractStatus.Locked ? (
                                    <div className="text-teal-500 flex flex-col items-end">
                                        <CheckCircle2 size={32} />
                                        <p className="text-[10px] uppercase font-bold mt-1">Verified Signature</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Status/History */}
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl border border-zinc-800 p-6 space-y-6">
                        <h3 className="font-bold flex items-center gap-2 text-white">
                            <History size={18} className="text-zinc-500" />
                            Document Status
                        </h3>

                        <div className="space-y-6 relative">
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-zinc-800" />

                            {[
                                { s: ContractStatus.Created, label: "Document Created", icon: Clock },
                                { s: ContractStatus.Approved, label: "Internal Approval", icon: ThumbsUp },
                                { s: ContractStatus.Sent, label: "Sent for Signing", icon: Send },
                                { s: ContractStatus.Signed, label: "Signature Recorded", icon: CheckCircle2 },
                                { s: ContractStatus.Locked, label: "Locked & Archived", icon: Lock },
                            ].map((step) => {
                                const isActive = contract.status === step.s;
                                const isPassed = contract.status === ContractStatus.Revoked ? false :
                                    ["Created", "Approved", "Sent", "Signed", "Locked"].indexOf(contract.status) >= ["Created", "Approved", "Sent", "Signed", "Locked"].indexOf(step.s);

                                return (
                                    <div key={step.s} className="flex gap-4 relative z-10">
                                        <div className={clsx(
                                            "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                            isActive ? "bg-teal-500 text-black scale-125 shadow-lg shadow-teal-500/20" :
                                                isPassed ? "bg-zinc-700 text-zinc-400" : "bg-zinc-900 border border-zinc-800 text-zinc-700"
                                        )}>
                                            <step.icon size={10} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className={clsx("text-sm font-bold", isActive ? "text-teal-400" : isPassed ? "text-zinc-400" : "text-zinc-700")}>
                                                {step.label}
                                            </p>
                                            {isActive && <p className="text-[10px] text-zinc-500">Current active state</p>}
                                        </div>
                                    </div>
                                );
                            })}

                            {isRevoked && (
                                <div className="flex gap-4 relative z-10">
                                    <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center scale-125">
                                        <Ban size={10} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-red-500">Document Revoked</p>
                                        <p className="text-[10px] text-red-900/50">Cannot proceed further</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl border border-zinc-800 p-6">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-white">
                            <Unlock size={18} className="text-zinc-500" />
                            Compliance Details
                        </h3>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            This contract is being managed under the standard enterprise workflow.
                            {isLocked ? " All data is now immutable and stored in the secure archive." : " Modifications are only allowed while in the Created state."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

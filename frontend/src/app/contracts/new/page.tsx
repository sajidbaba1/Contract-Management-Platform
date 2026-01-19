"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { blueprintApi, contractApi } from "@/lib/api";
import { Blueprint, BlueprintField } from "@/lib/types";
import { FileText, ArrowLeft, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import { clsx } from "clsx";

export default function NewContract() {
    const router = useRouter();
    const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
    const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
    const [name, setName] = useState("");
    const [fieldData, setFieldData] = useState<Record<string, string | number | boolean | null>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBlueprints();
    }, []);

    const fetchBlueprints = async () => {
        try {
            const { data } = await blueprintApi.getAll();
            setBlueprints(data);
        } catch (error) {
            console.error("Failed to fetch blueprints", error);
            toast.error("Failed to load blueprints.");
        }
    };

    const handleBlueprintChange = async (id: string) => {
        if (!id) {
            setSelectedBlueprint(null);
            return;
        }
        try {
            const { data } = await blueprintApi.getById(id);
            setSelectedBlueprint(data);
            const initialData: Record<string, string | number | boolean | null> = {};
            data.fields.forEach((f: BlueprintField) => {
                initialData[f.label] = f.type === 'Checkbox' ? false : "";
            });
            setFieldData(initialData);
        } catch (error) {
            console.error("Failed to fetch blueprint details", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBlueprint) return;

        setLoading(true);
        try {
            await contractApi.create({
                blueprintId: selectedBlueprint.id,
                name,
                fieldData
            });
            toast.success(`Contract "${name}" created successfully!`);
            router.push("/");
        } catch (error) {
            toast.error("Failed to create contract.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={16} />
                <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
                <span className="text-sm font-medium sm:hidden">Back</span>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Create Contract</h1>
                    <p className="text-zinc-500 mt-1 text-sm">Generate a new contract from a template.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="glass-card p-4 sm:p-6 rounded-2xl border border-zinc-800 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Select Template (Blueprint)</label>
                        <select
                            required
                            onChange={(e) => handleBlueprintChange(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all appearance-none cursor-pointer text-white text-sm sm:text-base"
                        >
                            <option value="">Choose a blueprint...</option>
                            {blueprints.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Contract Title</label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Agreement with Acme Corp"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-white text-sm sm:text-base"
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedBlueprint && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-6 sm:space-y-8"
                        >
                            <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
                                <Sparkles className="text-teal-500" size={20} />
                                <h2 className="text-lg sm:text-xl font-bold text-white">Document Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {selectedBlueprint.fields.map((field, idx) => (
                                    <div key={idx} className={field.type === 'Signature' ? 'md:col-span-2' : ''}>
                                        <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-2">{field.label}</label>

                                        {field.type === 'Text' && (
                                            <input
                                                required
                                                type="text"
                                                value={(fieldData[field.label] as string) || ""}
                                                onChange={(e) => setFieldData({ ...fieldData, [field.label]: e.target.value })}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:border-teal-500/50 outline-none transition-all text-white text-sm"
                                            />
                                        )}

                                        {field.type === 'Date' && (
                                            <input
                                                required
                                                type="date"
                                                value={(fieldData[field.label] as string) || ""}
                                                onChange={(e) => setFieldData({ ...fieldData, [field.label]: e.target.value })}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:border-teal-500/50 outline-none transition-all color-scheme-dark text-white text-sm"
                                            />
                                        )}

                                        {field.type === 'Checkbox' && (
                                            <div
                                                onClick={() => setFieldData({ ...fieldData, [field.label]: !fieldData[field.label] })}
                                                className="flex items-center gap-3 cursor-pointer group"
                                            >
                                                <div className={`w-6 h-6 rounded border transition-all flex items-center justify-center ${fieldData[field.label] ? 'bg-teal-600 border-teal-600' : 'bg-zinc-950 border-zinc-800 group-hover:border-zinc-700'}`}>
                                                    {fieldData[field.label] && <div className="w-2 h-2 rounded-full bg-teal-950" />}
                                                </div>
                                                <span className="text-sm text-zinc-300">I agree to this field</span>
                                            </div>
                                        )}

                                        {field.type === 'Signature' && (
                                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 sm:p-8 border-dashed flex flex-col items-center justify-center gap-3 text-zinc-600 hover:text-zinc-500 hover:border-zinc-700 transition-all cursor-text text-center">
                                                <FileText size={40} />
                                                <span className="text-sm italic">Digitally signed via platform</span>
                                                <input
                                                    required
                                                    value={(fieldData[field.label] as string) || ""}
                                                    onChange={(e) => setFieldData({ ...fieldData, [field.label]: e.target.value })}
                                                    placeholder="Type your full name for signature"
                                                    className="mt-2 bg-transparent text-center border-b border-zinc-800 focus:border-teal-500 outline-none pb-1 w-full max-w-xs text-white text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    disabled={loading}
                                    className="premium-button w-full sm:w-auto px-10 py-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-teal-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-teal-900/20"
                                >
                                    <Send size={18} />
                                    <span>{loading ? "Generating..." : "Generate Contract"}</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}

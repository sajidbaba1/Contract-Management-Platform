"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { blueprintApi } from "@/lib/api";
import { Trash2, Plus, Save, Type, Calendar, PenTool, CheckSquare, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintField } from "@/lib/types";
import { toast } from 'react-toastify';
import Link from "next/link";

export default function NewBlueprint() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [fields, setFields] = useState<BlueprintField[]>([]);
    const [loading, setLoading] = useState(false);

    const addField = (type: string) => {
        setFields([...fields, { type: type as BlueprintField['type'], label: `New ${type} Field`, x: 0, y: 0 }]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, updates: Partial<BlueprintField>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fields.length === 0) {
            toast.error("Please add at least one field.");
            return;
        }

        setLoading(true);
        try {
            await blueprintApi.create({ name, description, fields });
            toast.success("Blueprint created successfully!");
            router.push("/");
        } catch (error) {
            toast.error("Failed to create blueprint.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-white">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Blueprint</h1>
                    <p className="text-zinc-500 mt-1 text-sm">Design a reusable contract template.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="glass-card p-4 sm:p-6 rounded-2xl border border-zinc-800 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Blueprint Name</label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Service Agreement 2024"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the purpose of this template..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all h-20 sm:h-24 resize-none text-white text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3 space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                            Blueprint Fields
                            <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">{fields.length}</span>
                        </h3>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {fields.length === 0 && (
                                    <div className="p-10 sm:p-12 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-600 text-sm italic">
                                        No fields added. Choose a type from the right.
                                    </div>
                                )}
                                {fields.map((field, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={index}
                                        className="glass-card p-3 sm:p-4 rounded-xl border border-zinc-800 flex items-center gap-3 sm:gap-4 group"
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 shrink-0">
                                            {field.type === 'Text' && <Type size={16} />}
                                            {field.type === 'Date' && <Calendar size={16} />}
                                            {field.type === 'Signature' && <PenTool size={16} />}
                                            {field.type === 'Checkbox' && <CheckSquare size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <input
                                                value={field.label}
                                                onChange={(e) => updateField(index, { label: e.target.value })}
                                                className="bg-transparent border-none outline-none text-sm font-medium focus:text-teal-400 transition-colors w-full text-white"
                                            />
                                            <div className="flex flex-wrap items-center gap-3">
                                                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{field.type}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-zinc-700">X:</span>
                                                    <input
                                                        type="number"
                                                        value={field.x}
                                                        onChange={(e) => updateField(index, { x: parseInt(e.target.value) || 0 })}
                                                        className="w-8 bg-zinc-900/50 border border-zinc-800 rounded px-1 text-[10px] text-zinc-400 focus:outline-none"
                                                    />
                                                    <span className="text-[10px] text-zinc-700">Y:</span>
                                                    <input
                                                        type="number"
                                                        value={field.y}
                                                        onChange={(e) => updateField(index, { y: parseInt(e.target.value) || 0 })}
                                                        className="w-8 bg-zinc-900/50 border border-zinc-800 rounded px-1 text-[10px] text-zinc-400 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeField(index)}
                                            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Field Types</h3>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                            {[
                                { type: 'Text', icon: Type, label: 'Text' },
                                { type: 'Date', icon: Calendar, label: 'Date' },
                                { type: 'Signature', icon: PenTool, label: 'Sign' },
                                { type: 'Checkbox', icon: CheckSquare, label: 'Check' },
                            ].map((item) => (
                                <button
                                    key={item.type}
                                    type="button"
                                    onClick={() => addField(item.type)}
                                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-zinc-950/50 hover:bg-zinc-900 transition-all text-xs sm:text-sm font-medium group"
                                >
                                    <item.icon className="text-zinc-500 group-hover:text-teal-500 transition-colors" size={16} />
                                    <span>{item.label}</span>
                                    <Plus className="ml-auto text-zinc-700 hidden sm:block" size={14} />
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={loading || fields.length === 0}
                            className="w-full premium-button py-4 mt-4 sm:mt-8 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:grayscale text-teal-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20"
                        >
                            <Save size={18} />
                            <span>{loading ? "Saving..." : "Save Template"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

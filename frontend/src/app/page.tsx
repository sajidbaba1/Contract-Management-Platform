"use client";

import { useEffect, useState } from "react";
import { contractApi } from "@/lib/api";
import { Contract, ContractStatus } from "@/lib/types";
import {
  Search,
  Eye,
  Clock,
  CheckCircle2,
  FileBadge,
  PlusCircle,
  FileText
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Dashboard() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Active" | "Pending" | "Signed">("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data } = await contractApi.getAll();
      setContracts(data);
    } catch (error) {
      console.error("Failed to fetch contracts", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.blueprintName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "All") return true;
    if (filter === "Active") return c.status !== ContractStatus.Locked && c.status !== ContractStatus.Revoked;
    if (filter === "Pending") return c.status === ContractStatus.Created || c.status === ContractStatus.Approved || c.status === ContractStatus.Sent;
    if (filter === "Signed") return c.status === ContractStatus.Signed || c.status === ContractStatus.Locked;
    return true;
  });

  const stats = [
    { label: "Total Contracts", value: contracts.length, icon: FileBadge, color: "text-teal-500" },
    { label: "Pending Approval", value: contracts.filter(c => c.status === ContractStatus.Created).length, icon: Clock, color: "text-amber-500" },
    { label: "Successfully Signed", value: contracts.filter(c => c.status === ContractStatus.Signed || c.status === ContractStatus.Locked).length, icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage and track your contract lifecycle.</p>
        </div>
        <div className="flex w-full sm:w-auto">
          <Link
            href="/contracts/new"
            className="premium-button w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-teal-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20"
          >
            <PlusCircle size={18} />
            <span>Create Contract</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="glass-card p-6 rounded-2xl border border-zinc-800"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-4 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 flex-1 max-w-md">
            <Search className="text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search by contract or blueprint name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-zinc-600 focus:ring-0"
            />
          </div>
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            {(["All", "Active", "Pending", "Signed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  filter === f ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Contract Name</th>
                <th className="px-6 py-4 font-semibold">Blueprint</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-10 text-center text-zinc-600">Loading contracts...</td>
                  </tr>
                ))
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="text-zinc-800" size={48} />
                      <p className="text-zinc-500">No contracts found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4 font-medium">{contract.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{contract.blueprintName}</td>
                    <td className="px-6 py-4">
                      <span className={clsx("status-badge", `status-${contract.status.toLowerCase()}`)}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/contracts/${contract.id}`}
                          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <Eye size={18} />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

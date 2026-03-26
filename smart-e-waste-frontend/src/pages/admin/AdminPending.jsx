// src/pages/admin/AdminPending.jsx
import React, { useEffect, useMemo, useState } from "react";
import { fetchAdminUsersApi, approveUserApi } from "../../api";

export default function AdminPending() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchAdminUsersApi(token);
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const pending = useMemo(() => users.filter((u) => u.status === "PENDING"), [users]);

    const filtered = pending.filter((u) =>
        `${u.fullName || ""} ${u.email || ""} ${u.phone || ""}`.toLowerCase().includes(query.toLowerCase())
    );

    const handleApprove = async (id) => {
        try {
            await approveUserApi(id, true, token);
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "VERIFIED" } : u)));
        } catch {
            loadUsers();
        }
    };

    const handleReject = async (id) => {
        try {
            await approveUserApi(id, false, token);
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "REJECTED" } : u)));
        } catch {
            loadUsers();
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-xl font-semibold">Pending Approvals</h3>

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, email or phone"
                    className="border rounded-md px-3 py-2 w-full sm:w-72"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <p className="text-slate-500">No pending users found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((u, idx) => (
                        <div
                            key={u.id}
                            className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400
                                       flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div>
                                <p className="text-sm text-slate-500">#{idx + 1}</p>
                                <p className="text-lg font-semibold">{u.fullName}</p>
                                <p className="text-sm text-slate-600">{u.email}</p>
                                <p className="text-sm text-slate-600">{u.phone || "-"}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleApprove(u.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                                    Approve
                                </button>
                                <button onClick={() => handleReject(u.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

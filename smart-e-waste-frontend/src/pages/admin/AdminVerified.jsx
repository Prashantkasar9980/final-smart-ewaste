// src/pages/admin/AdminVerified.jsx
import React, { useEffect, useState } from "react";
import { fetchAdminUsersApi } from "../../api";

export default function AdminVerified() {
    const [users, setUsers] = useState([]);
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

    const verified = users.filter((u) => u.status === "VERIFIED");

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Verified Users</h3>

            {verified.length === 0 ? (
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <p className="text-slate-500">No verified users yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {verified.map((u, idx) => (
                        <div
                            key={u.id}
                            className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500
                                       flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div>
                                <p className="text-sm text-slate-500">#{idx + 1}</p>
                                <p className="text-lg font-semibold">{u.fullName}</p>
                                <p className="text-sm text-slate-600">{u.email}</p>
                                <p className="text-sm text-slate-600">{u.phone || "-"}</p>
                            </div>

                            <span className="text-slate-500 text-sm">No action</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

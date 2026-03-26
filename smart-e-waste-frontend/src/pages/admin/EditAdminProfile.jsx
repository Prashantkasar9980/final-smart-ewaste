import React, { useState, useEffect } from "react";
import { getAuthFromStorage, saveAuthToStorage } from "../../api";
import { useNavigate } from "react-router-dom";

const EditAdminProfile = () => {
    const navigate = useNavigate();
    const auth = getAuthFromStorage();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        city: "",
        address: "",
    });

    // ✅ RUN ONLY ONCE (FIXES INFINITE LOOP)
    useEffect(() => {
        if (!auth || !auth.token) {
            navigate("/login");
            return;
        }

        setForm({
            fullName: auth.fullName || "",
            phone: auth.phone || "",
            city: auth.city || "",
            address: auth.address || "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 👈 EMPTY dependency array (IMPORTANT)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/admin/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Update failed");

            const updated = await res.json();

            // ✅ UPDATE LOCAL STORAGE ONCE
            saveAuthToStorage({ ...auth, ...updated });

            alert("Admin profile updated");
            navigate("/admin/profile");

        } catch (err) {
            console.error(err);
            alert("Error updating admin profile");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <button
                onClick={() => navigate("/admin/profile")}
                className="mb-4 text-emerald-600 font-semibold hover:underline"
            >
                ◀ Back to Profile
            </button>

            <h1 className="text-3xl font-bold mb-6 text-emerald-700">
                Edit Admin Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Full Name"
                />

                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Phone"
                />

                <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="City"
                />

                <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Address"
                />

                <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditAdminProfile;

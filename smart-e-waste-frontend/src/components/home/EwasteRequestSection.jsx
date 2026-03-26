import React from "react";
import { useNavigate } from "react-router-dom";

const EwasteRequestSection = () => {
    const navigate = useNavigate();

    console.log('EwasteRequestSection rendered');

    return (
        <div className="bg-emerald-50 py-16 px-6 rounded-2xl text-center">
            <div className="text-xs text-rose-600 font-semibold">[debug] EwasteRequestSection mounted</div>
            <h2 className="text-3xl font-bold text-emerald-800">
                Ready to Recycle Your E-waste?
            </h2>

            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                Submit a quick pickup request and help us dispose electronic waste responsibly.
                Safe • Simple • Sustainable
            </p>

            <button
                onClick={() => navigate("/login")}
                className="mt-8 px-8 py-3 text-lg text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition"
            >
                Request E-waste Pickup →
            </button>
        </div>
    );
};

export default EwasteRequestSection;

import React from "react";
import { useNavigate } from "react-router-dom";

const EwasteTrackSection = () => {
    const navigate = useNavigate();

    console.log('EwasteTrackSection rendered');

    return (
        <div className="bg-sky-50 py-16 px-6 rounded-2xl text-center">

            <h2 className="text-3xl font-bold text-sky-800">
                Track Your E-waste Request
            </h2>

            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                Stay updated on your pickup status — from request approval
                to successful collection. Transparent • Real-time • Reliable
            </p>

            <button
                onClick={() => navigate("/user/track")}
                className="mt-8 px-8 py-3 text-lg text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg transition"
            >
                Track Pickup Status →
            </button>
        </div>
    );
};

export default EwasteTrackSection;

import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const guidelines = [
    "Do not throw electronics in regular trash bins.",
    "Separate batteries, cables, and devices for proper recycling.",
    "Erase all personal data from your devices before disposal.",
    "Drop off small electronics at certified e-waste centers.",
    "Donate working electronics to NGOs or schools instead of discarding.",
];

const GuidelinesPage = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Responsible e-waste disposal guidelines</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Follow these practices for safe and sustainable recycling.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guidelines.map((item, index) => (
                    <div
                        key={index}
                        className="group flex gap-4 rounded-2xl border-2 border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md hover:bg-emerald-50/30"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-200 group-hover:bg-emerald-100 group-hover:scale-105">
                            <FiCheckCircle className="text-xl" />
                        </span>
                        <p className="text-slate-700 leading-relaxed group-hover:text-slate-800">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuidelinesPage;

// src/components/home/Features.jsx
import React from "react";

const Features = () => {
    return (
        <section id="services" className="w-full py-24 bg-slate-50">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">

                {/* SECTION TITLE */}
                <div className="text-center mb-16">
                    <p className="text-emerald-600 font-semibold tracking-wide text-base">
                        OUR CORE ADVANTAGES
                    </p>

                    <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                        Smart technology for a <br />
                        <span className="text-emerald-600">Cleaner Planet</span>
                    </h2>
                </div>

                {/* RESPONSIVE GRID:
                    - mobile (sm / 640+) -> two columns (so two items per row)
                    - lg -> three columns with the first card spanning two columns
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* CARD 2 (gradient) — on small screens should be first so it pairs with card5 */}
                    <div className="order-1 lg:order-2 bg-gradient-to-br from-slate-900 to-emerald-700 text-white rounded-3xl shadow-xl p-8 md:p-10">
                        <div className="p-3 bg-emerald-600/40 rounded-xl w-fit">
                            <span className="text-3xl">🛡️</span>
                        </div>
                        <h3 className="text-2xl font-bold mt-5 mb-3">100% Data Security</h3>
                        <p className="text-lg leading-relaxed opacity-90">
                            Defense-standard secure data wiping for all devices.
                        </p>
                    </div>

                    {/* CARD 5 (green) — pair with gradient on mobile */}
                    <div className="order-2 lg:order-5 bg-emerald-600 text-white rounded-3xl shadow-xl p-8 md:p-10">
                        <div className="p-3 bg-emerald-500/40 rounded-xl w-fit">
                            <span className="text-3xl">🌍</span>
                        </div>
                        <h3 className="text-2xl font-bold mt-5 mb-3">Global Standards</h3>
                        <p className="text-lg leading-relaxed opacity-90">
                            WEEE, ISO 14001, and R2 certified recycling processes.
                        </p>
                    </div>

                    {/* CARD 3 (Impact Tracking) */}
                    <div className="order-3 lg:order-3 bg-white rounded-3xl shadow-lg p-8 md:p-10 border">
                        <div className="p-3 bg-blue-100 rounded-xl w-fit">
                            <span className="text-3xl">📊</span>
                        </div>
                        <h3 className="text-2xl font-bold mt-5 mb-3">Impact Tracking</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Visualize your environmental contribution in real-time.
                        </p>
                    </div>

                    {/* CARD 4 (Instant Rewards) */}
                    <div className="order-4 lg:order-4 bg-white rounded-3xl shadow-lg p-8 md:p-10 border">
                        <div className="p-3 bg-orange-100 rounded-xl w-fit">
                            <span className="text-3xl">⚡</span>
                        </div>
                        <h3 className="text-2xl font-bold mt-5 mb-3">Instant Rewards</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Earn reward points immediately after verified pickups.
                        </p>
                    </div>

                    {/* CARD 1 (Intelligent Pickup Logistics)
                        - Desktop: keep as large left card (span 2 cols)
                        - Small screens: place it after the two rows and span full width (sm:col-span-2)
                    */}
                    <div className="order-5 lg:order-1 lg:col-span-2 sm:col-span-2 bg-white rounded-3xl shadow-lg p-8 md:p-10 border">
                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <span className="text-3xl">🚛</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                    Intelligent Pickup Logistics
                                </h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Our AI-driven fleet management system optimizes real-time
                                    routes to ensure the fastest collection service while reducing
                                    carbon emissions.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;

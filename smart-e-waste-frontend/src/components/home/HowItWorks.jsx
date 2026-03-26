// src/components/home/HowItWorks.jsx
import React from "react";

const HowItWorks = () => {
    return (
        <section id="process" className="w-full py-20 md:py-28 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">

                {/* TITLE */}
                <div className="text-center mb-16">
                    <p className="text-emerald-600 font-semibold tracking-wide text-lg">
                        SIMPLE PROCESS
                    </p>

                    <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                        From Clutter to Clean in <span className="text-emerald-600">4 Steps</span>
                    </h2>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

                    {[ 
                        { num: 1, icon: "📱", title: "Book a Pickup", desc: "Select your e-waste items and schedule a convenient pickup time." },
                        { num: 2, icon: "🚚", title: "We Collect", desc: "Our trained collectors safely pick up your items from your doorstep." },
                        { num: 3, icon: "♻️", title: "Responsible Recycling", desc: "Items are taken to certified recycling centers for eco-friendly processing." },
                        { num: 4, icon: "🏅", title: "Earn Rewards", desc: "Earn reward points for every kilogram recycled and redeem vouchers." },
                    ].map((step) => (
                        <div
                          key={step.num}
                          className="relative bg-white rounded-3xl shadow-lg p-8 md:p-12 border min-w-0"
                        >
                            <div className="absolute -top-5 right-5 w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white flex items-center justify-center rounded-full text-lg md:text-xl font-bold shadow-md">
                                {step.num}
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-100 w-fit mb-6 text-5xl">
                                {step.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>

                            <p className="text-lg text-slate-600 leading-relaxed break-words">{step.desc}</p>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

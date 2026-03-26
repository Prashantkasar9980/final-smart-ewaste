import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero-illustration.png";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full pt-8 md:pt-12 pb-20 md:pb-28 bg-white">
            <div
                className="max-w-[1400px] mx-auto px-6 md:px-10
                grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16
                items-center"
            >

                {/* LEFT TEXT */}
                <div className="lg:pr-20">
                    <span className="px-5 py-2 text-xs md:text-sm font-semibold rounded-full bg-emerald-100 text-emerald-700">
                        ● SMART E-WASTE MANAGEMENT
                    </span>

                    <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900">
                        Recycling made <br />
                        <span className="text-emerald-600">Simple & Smart.</span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                        Transform your e-waste into sustainable impact. We provide solutions
                        for collecting, recycling, and repurposing electronics.
                    </p>

                    {/* BUTTONS */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <button
    onClick={() => navigate("/user")}
    className="w-full sm:w-auto px-8 py-3 text-lg text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition"
>
    Start Recycling →
</button>


                        <button className="w-full sm:w-auto px-8 py-3 text-lg bg-white border-2 border-slate-300 rounded-xl shadow-md hover:bg-slate-50 transition flex items-center gap-3">
                            <span className="text-emerald-600 text-2xl">▶</span>
                            How it works
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex justify-center lg:justify-end">
                    <img
                        src={heroImage}
                        alt="Smart e‑waste management"
                        className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px] rounded-3xl shadow-xl object-cover"
                    />
                </div>

            </div>
        </section>
    );
};

export default Hero;

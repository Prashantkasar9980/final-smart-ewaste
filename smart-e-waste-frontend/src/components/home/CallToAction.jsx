import React from "react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full flex justify-center px-4 py-20">
            <div className="w-full max-w-6xl bg-green-600 rounded-3xl text-white text-center px-6 py-16 relative overflow-hidden">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to make a real impact?
                </h2>

                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10">
                    Join thousands of others who are cleaning up the planet, one device at
                    a time. It takes less than 2 minutes to schedule your first pickup.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {/* Create Free Account */}
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-white text-green-700 font-semibold px-8 py-3 rounded-xl border-2 border-white hover:bg-green-50 transition"
                    >
                        Create Free Account
                    </button>

                    {/* Schedule Pickup (optional route) */}
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-green-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-800 transition flex items-center justify-center gap-2"
                    >
                        Schedule Pickup →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;

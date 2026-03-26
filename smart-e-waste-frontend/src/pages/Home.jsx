import React from "react";

import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Stats from "../components/home/Stats";
import HowItWorks from "../components/home/HowItWorks";
import CallToAction from "../components/home/CallToAction";
import EwasteRequestSection from "../components/home/EwasteRequestSection";

/**
 * Home page — each major section wrapped with an ID so Navbar anchors work
 * (e.g. href="#services" will scroll to the Features section when Home is present).
 */
const Home = () => {
    return (
        <div className="w-full">
            {/* hero section (home anchor) */}
            <section id="home">
                <Hero />
            </section>

            {/* services / features */}
            <section id="services">
                <Features />
            </section>

            {/* stats (kept as a separate block) */}
            <section id="stats">
                <Stats />
            </section>

            {/* process / how it works */}
            <section id="process">
                <HowItWorks />
            </section>

            {/* contact / CTA */}
            <section id="contact">
                <CallToAction />
            </section>
        </div>
    );
};

export default Home;

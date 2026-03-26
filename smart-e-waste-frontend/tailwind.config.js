/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#059669",
                    hover: "#047857",
                },
                background: "#f8fafc",
                card: "#ffffff",
                borderColor: "#e2e8f0",
                textMain: "#0f172a",
                textMuted: "#64748b",
                success: "#22c55e",
                warning: "#facc15",
                danger: "#ef4444",
            },
            boxShadow: {
                card: "0 2px 8px rgba(0,0,0,0.04)",
            },
            borderRadius: {
                xl: "12px",
            }
        },
    },
    plugins: [],
};
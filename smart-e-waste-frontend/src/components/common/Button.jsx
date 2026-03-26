import React from "react";

const Button = ({
                    children,
                    variant = "primary",
                    size = "md",
                    className = "",
                    ...props
                }) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary:
            "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md",

        secondary:
            "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50",

        outline:
            "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",

        ghost:
            "text-slate-600 hover:bg-slate-100",

        danger:
            "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
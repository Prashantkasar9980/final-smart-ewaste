import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Keep a console trail for debugging
        console.error("[APP RUNTIME ERROR]", error, errorInfo);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        const message =
            this.state.error?.message ||
            String(this.state.error) ||
            "Unknown runtime error";

        return (
            <div className="min-h-screen bg-white text-slate-900 p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
                        <h1 className="text-xl font-extrabold text-red-700">
                            App crashed while rendering
                        </h1>
                        <p className="mt-2 text-sm text-red-700">
                            Fix the error below and reload.
                        </p>
                        <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-white border border-red-200 p-4 text-sm text-slate-900">
                            {message}
                        </pre>
                    </div>
                </div>
            </div>
        );
    }
}


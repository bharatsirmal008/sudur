"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export default function EsewaPayPage() {
    const searchParams = useSearchParams();
    const tx = searchParams.get("tx");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [payload, setPayload] = useState<any>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!tx) {
            setError("Missing transaction ID");
            setLoading(false);
            return;
        }

        const fetchPayload = async () => {
            try {
                const res = await fetch(`/api/nepal/esewa/payload?tx=${tx}`);
                if (!res.ok) throw new Error("Failed to fetch payment details");
                const data = await res.json();
                setPayload(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPayload();
    }, [tx]);

    useEffect(() => {
        if (payload && formRef.current) {
            formRef.current.submit();
        }
    }, [payload]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Redirecting to eSewa...</h1>
                <p className="text-slate-500">Please do not close this window.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Error</h1>
                <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">{error}</p>
                <button
                    onClick={() => window.location.href = "/donate"}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
                >
                    Back to Donation Page
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Processing...</h1>

            {/* eSewa Hidden Form */}
            {payload && (
                <form
                    ref={formRef}
                    action="https://epay.esewa.com.np/api/epay/main/v2"
                    method="POST"
                >
                    {Object.entries(payload).map(([key, value]: [string, any]) => (
                        <input key={key} type="hidden" name={key} value={value} />
                    ))}
                </form>
            )}
        </div>
    );
}

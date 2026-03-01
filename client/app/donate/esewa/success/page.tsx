"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function EsewaSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);
    const data = searchParams.get("data");

    useEffect(() => {
        if (data) {
            // In a real app, you would verify the 'data' payload with your backend
            // For this demo, we'll assume it's successful if we reached this URL
            setTimeout(() => {
                setVerifying(false);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#4F46E5", "#10B981", "#F59E0B"]
                });
            }, 1500);
        } else {
            setVerifying(false);
        }
    }, [data]);

    if (verifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Verifying Payment...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Thank You!</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Your eSewa payment was successful. Your generous contribution helps us continue our mission.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/"
                        className="w-full py-4 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

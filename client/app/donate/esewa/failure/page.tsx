"use client";

import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function EsewaFailurePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800 text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payment Failed</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    We couldn't process your eSewa payment. This could be due to insufficient balance or a network issue.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <Link
                        href="/donate"
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="w-full py-4 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

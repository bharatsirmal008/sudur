"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Loader2, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            // Optional: specify custom parameters
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user.email?.toLowerCase().endsWith("@gmail.com")) {
                setError("Only @gmail.com addresses are allowed.");
                await auth.signOut();
                setIsLoading(false);
                return;
            }

            // Sync with NextAuth
            const res = await signIn("credentials", {
                redirect: false,
                email: user.email,
                isFirebase: "true",
            });

            if (res?.error) {
                setError(res.error);
                setIsLoading(false);
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            console.error("Firebase Auth Error:", err);
            setError(err.message || "Failed to sign in with Google");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
                        <Heart className="w-8 h-8 text-white" />
                    </Link>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Sign in securely with your Google account
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl border border-slate-100 dark:border-slate-800">

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold transition-all group active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 font-medium">Safe & Secure</span>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-500 dark:text-slate-400 px-4 leading-relaxed">
                            By continuing, you agree to SUDUR's Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

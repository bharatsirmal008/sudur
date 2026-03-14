"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("error")) {
            const timer = setTimeout(() => {
                setError("Authentication failed. Please try again.");
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Strict check for actual, verified @gmail.com IDs
            if (!user.email?.toLowerCase().endsWith("@gmail.com")) {
                setError("Only verified @gmail.com accounts are allowed.");
                await auth.signOut();
                setIsLoading(false);
                return;
            }

            // Ensure the email is verified by Google
            if (!user.emailVerified) {
                setError("Your Google account must be verified.");
                await auth.signOut();
                setIsLoading(false);
                return;
            }

            // Sync with NextAuth backend
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
        } catch (err: unknown) {
            console.error("Firebase Auth Error:", err);
            const message = err instanceof Error ? err.message : "Google sign-in failed";
            setError(message || "Google sign-in failed. Please use a verified account.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full opacity-50 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[440px] px-6"
            >
                <div className="bg-[#121218]/80 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Login</h1>
                        <p className="text-slate-400 text-sm font-medium italic opacity-80">Sign in with your verified Google account</p>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-2xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70 mb-8"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                        ) : (
                            <>
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

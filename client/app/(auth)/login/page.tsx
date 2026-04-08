"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

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

    const handleFacebookLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user.email) {
                setError("An email associated with your Facebook account is required.");
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
            console.error("Firebase Facebook Auth Error:", err);
            const message = err instanceof Error ? err.message : "Facebook sign-in failed";
            setError(message || "Facebook sign-in failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
            {/* Base Background Image (The "Proper" Background) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero_bg.jpeg"
                    alt=""
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-white/70" />
            </div>

            {/* Central Overlapping Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-[80%] -translate-y-1/2 w-[45rem] h-[45rem] bg-yellow-200/50 blur-[130px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-1/2 w-[45rem] h-[45rem] bg-cyan-200/40 blur-[130px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[440px] px-6"
            >
                <div className="bg-white/95 p-10 rounded-[15px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden">
                    {/* Inner Card Background Image */}
                    <img src="/hero_bg.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="" />

                    {/* Branded Asset Backgrounds: Four Corners */}
                    <img src="/pink_ellipse.svg" className="absolute -top-10 -left-10 w-48 h-48 opacity-40  pointer-events-none" alt="" />
                    <img src="/yellow_ellipse.svg" className="absolute -top-10 -right-10 w-48 h-48 opacity-40 pointer-events-none" alt="" />
                    <img src="/green_ellipse.svg" className="absolute -bottom-10 -left-10 w-48 h-48 opacity-40  pointer-events-none" alt="" />
                    <img src="/blue_ellipse.svg" className="absolute -bottom-10 -right-10 w-48 h-48 opacity-40  pointer-events-none" alt="" />

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Login</h1>
                            <p className="text-slate-500 text-sm font-medium italic">Sign in with your social accounts</p>
                        </div>

                        {error && (
                            <div className="mb-8 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-[10px] text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="group relative overflow-hidden w-full flex items-center justify-center gap-3 px-6 py-4 cursor-pointer rounded-[10px] bg-white text-slate-900 font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70 mb-4 shadow-sm"
                        >
                            <img src="/pink_ellipse.svg" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="" />
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 relative z-10" />
                            ) : (
                                <div className="flex items-center gap-3 relative z-10">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </div>
                            )}
                        </button>

                        <button
                            onClick={handleFacebookLogin}
                            disabled={isLoading}
                            className="w-full relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 cursor-pointer rounded-[10px] bg-white text-[#1877F2] font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70 mb-8"
                        >
                            <img src="/yellow_ellipse.svg" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="" />
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-[#1877F2] relative z-10" />
                            ) : (
                                <div className="flex items-center gap-3 relative z-10">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span>Continue with Facebook</span>
                                </div>
                            )}
                        </button>

                    </div>
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

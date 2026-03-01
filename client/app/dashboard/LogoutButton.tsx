"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Sign Out
        </button>
    );
}

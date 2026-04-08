import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                otp: { label: "Verification Code", type: "text" },
                isOtp: { label: "isOtp", type: "text" },
                isFirebase: { label: "isFirebase", type: "text" }
            },
            async authorize(credentials) {
                try {
                    // In production, fetch MUST be an absolute URL on the server.
                    let API_BASE = (process.env.NEXTAUTH_URL === "http://localhost:3000" || !process.env.NEXTAUTH_URL)
                        ? "http://localhost:5000"
                        : (process.env.BACKEND_API_URL || "");

                    // Fallback for common development scenarios or missing env vars
                    if (!API_BASE && typeof window === 'undefined') {
                        API_BASE = "https://sudurapi.vercel.app"; // Defaulting to your known backend URL
                    }

                    const res = await fetch(`${API_BASE}/api/login`, {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    });

                    const user = await res.json();

                    if (!res.ok) {
                        throw new Error(user.message || "Invalid credentials");
                    }

                    if (user) {
                        return user;
                    }

                    return null;
                } catch (error: unknown) {
                    throw new Error(error instanceof Error ? error.message : "Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.picture = user.image;
            }
            if (trigger === "update" && session?.image) {
                token.picture = session.image;
            }
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).image = token.picture as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

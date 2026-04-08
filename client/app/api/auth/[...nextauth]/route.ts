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
                    // Prioritize BACKEND_API_URL if it's set
                    let API_BASE = process.env.BACKEND_API_URL || "";

                    // Fallback to https://sudurapi.vercel.app if empty or we're in production and BASE is localhost
                    if ((!API_BASE || API_BASE.includes("localhost")) && typeof window === 'undefined') {
                        API_BASE = "https://sudurapi.vercel.app";
                    }

                    // Development fallback
                    if (!API_BASE) {
                        API_BASE = "http://localhost:5000";
                    }

                    console.log(`[NextAuth] Authorizing with API_BASE: ${API_BASE}`);
                    const loginUrl = `${API_BASE}/api/login`;
                    console.log(`[NextAuth] Full Login URL: ${loginUrl}`);

                    const res = await fetch(loginUrl, {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    });

                    console.log(`[NextAuth] Backend Response Status: ${res.status}`);
                    const user = await res.json();
                    console.log(`[NextAuth] Backend Response JSON:`, user);

                    if (!res.ok) {
                        throw new Error(user.message || "Invalid credentials");
                    }

                    if (user && user.email) {
                        console.log(`[NextAuth] Successfully authorized: ${user.email}`);
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

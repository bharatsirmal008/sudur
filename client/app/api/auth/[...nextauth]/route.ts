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
                    const API_BASE = process.env.NEXTAUTH_URL === "http://localhost:3000" ? "http://localhost:5000" : (process.env.BACKEND_API_URL || "");
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
                } catch (error: any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
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

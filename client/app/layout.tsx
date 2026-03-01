import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { Outfit, Space_Grotesk } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: "SUDUR - Community Platform",
  description: "Official SUDUR Website for sustainable impact and community empowerment.",
  keywords: ["SUDUR", "Community", "Empowerment", "Volunteering", "Donations", "NGO", "Non-profit", "Social Impact"],
  authors: [{ name: "SUDUR Team" }],
  openGraph: {
    title: {
      default: "SUDUR - Community Platform",
      template: "%s | SUDUR",
    },
    description: "Official SUDUR Website for sustainable impact and community empowerment.",
    type: "website",
    locale: "en_US",
    siteName: "SUDUR Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "SUDUR - Community Platform",
    description: "Official SUDUR Website for sustainable impact and community empowerment.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


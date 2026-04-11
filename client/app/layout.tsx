import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./context/ToastContext";
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
  title: "Youth Association Of Purbichauki",
  description: "Official Youth Association Of Purbichauki Website for sustainable impact and community empowerment.",
  keywords: ["Youth Association Of Purbichauki", "Community", "Empowerment", "Volunteering", "NGO", "Non-profit", "Social Impact"],
  authors: [{ name: "Youth Association Of Purbichauki Team" }],
  openGraph: {
    title: {
      default: "Youth Association Of Purbichauki - Community Platform",
      template: "%s | Youth Association Of Purbichauki",
    },
    description: "Official Youth Association Of Purbichauki Website for sustainable impact and community empowerment.",
    type: "website",
    locale: "en_US",
    siteName: "Youth Association Of Purbichauki Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Youth Association Of Purbichauki - Community Platform",
    description: "Official Youth Association Of Purbichauki Website for sustainable impact and community empowerment.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/YAOP.png",
    apple: "/YAOP.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-black text-gray-200 transition-colors duration-300 font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


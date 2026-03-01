import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import StatsSection from "./components/StatsSection";
import EventsSection from "./components/EventsSection";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <AboutSection />
      <EventsSection />
      <ContactSection />
      <StatsSection />
    </main>
  );
}
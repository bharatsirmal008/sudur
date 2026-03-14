import Hero from "./components/Hero";
import About from "./components/About";
import Events from "./components/Events";
import Transparency from "./components/Transparency";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Events />
      <Transparency />
    </main>
  );
}
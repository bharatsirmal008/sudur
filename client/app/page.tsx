import Hero from "./components/Hero";
import About from "./components/About";
import Events from "./components/Events";
import Location from "./components/Location";
import Transparency from "./components/Transparency";
import Gallery from "./components/Gallery";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Location />
      <Events />
      <Transparency />
      <Gallery />
    </main>
  );
}
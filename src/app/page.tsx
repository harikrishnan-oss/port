import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export const revalidate = 0;

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Contact />
    </main>
  );
}

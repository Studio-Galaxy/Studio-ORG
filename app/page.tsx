import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/hero/Hero";
import { IdeaStory } from "@/components/story/IdeaStory";
import { Process } from "@/components/story/Process";
import { WhatWeCreate } from "@/components/create/WhatWeCreate";
import { Possibilities } from "@/components/possibilities/Possibilities";
import { Philosophy } from "@/components/philosophy/Philosophy";
import { Capabilities } from "@/components/capabilities/Capabilities";
// Galaxy chapter is switched off for now — uncomment this import and <Galaxy /> below to bring it back.
// import { Galaxy } from "@/components/galaxy/Galaxy";
import { Contact, FinalStatement } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <a href="#idea" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <IdeaStory />
        <Process />
        <WhatWeCreate />
        <Possibilities />
        <Philosophy />
        <Capabilities />
        {/* <Galaxy /> */}
        <FinalStatement />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

import * as React from "react";
import { useEffect, useRef } from "react";
import type { PageProps } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Gallery from "../components/homepage/gallery";
import OrganizerSection from "../components/homepage/organizer";
import SectionHeader from "../components/sectionHeader";
import UniGallery from "../components/homepage/uniGallery";
import ResearchFields from "../components/homepage/fields";
import UpcomingTimeline from "../components/homepage/upcomingTimeline";
import { createPageHead } from "../components/pageHead";

const heroBackground = (
  <div className="absolute inset-0 -z-10">
    <StaticImage
      src="../images/bg1.jpeg"
      alt="Hero Background"
      className="w-full h-full object-cover"
      quality={90}
      formats={["auto", "webp", "avif"]}
      placeholder="blurred"
      loading="eager"
    />
  </div>
);

const homeBackground = (
  <div className="absolute top-0 left-0 w-full h-[300vh] -z-20">
    <StaticImage
      src="../images/bg2.jpeg"
      alt="Content Background"
      className="w-full h-full object-cover object-top opacity-40"
      quality={90}
      formats={["auto", "webp", "avif"]}
      placeholder="blurred"
      loading="eager"
    />
    {/* Smoothly fade the image into the solid dark background — starts fading at 70% */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-[rgb(30,22,48)/70] via-70% to-[rgb(30,22,48)]" />
  </div>
);


const IndexPage: React.FC<PageProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // 2. GSAP & ScrollTrigger setup
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // 3. Pin the Hero Section and create the dimensional scale effect
    const pinTrigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      endTrigger: contentRef.current,
      end: "bottom bottom", 
      pin: true,
      pinSpacing: false, // Allows subsequent content to slide completely over the hero
    });

    // Dimensional shrink/fade effect on the hero as it gets covered
    gsap.to(heroRef.current, {
      scale: 0.9,
      opacity: 0,
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top bottom", // Starts when the content top hits the bottom of the viewport
        end: "top top",      // Ends when the content top hits the top of the viewport
        scrub: true,         // Links animation directly to scrollbar
      },
    });

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      pinTrigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen flex flex-col bg-[rgb(30,22,48)]">
      {/* HERO SECTION - Set to z-0 so it stays underneath the scrolling content */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden z-0">
        {heroBackground}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 w-full h-[40vh] z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgb(30, 22, 48), transparent)" }}
        />

        {/* HERO CONTENT */}
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-center mt-20 px-6 md:px-12">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-purple-400/40 bg-black/35 px-5 py-3 text-sm md:text-base font-semibold text-white backdrop-blur-md shadow-lg shadow-purple-500/10">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse" />
            Paper Registration Deadline:{" "}
            <span className="inline-flex items-baseline whitespace-nowrap">
              31<sup className="relative -top-1 ml-0 text-[0.7em] leading-none">st</sup>
            </span>{" "}
            July 2027
          </div>

          <div className="mb-10 pt-10">
            <StaticImage
              src="../images/logo2026.png"
              alt="MERCon 2027 Logo"
              className="w-full max-w-64 md:max-w-[400px] lg:max-w-[600px] h-auto mx-auto"
            />
          </div>

          <h3 className="px-5 text-xl font-normal leading-relaxed max-w-3xl text-gray-200 mt-4 mb-12">
            Moratuwa Engineering Research Conference 2027 (MERCon 2027) is the 13<sup>th</sup> international conference
            organized by the Engineering Research Unit, University of Moratuwa.
          </h3>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
            <div className="px-6 py-4 bg-purple-500/10 border border-purple-500 rounded-4xl text-white font-semibold">
              13<sup className="">th</sup> & 14<sup className="">th</sup> August 2027
            </div>

            <div className="px-6 py-4 bg-purple-500/10 border border-purple-500 rounded-4xl text-white font-semibold">
              University of Moratuwa
            </div>
          </div>

          <a href="#call-for-papers" className="text-purple-500 text-3xl animate-bounce mt-4 cursor-pointer">
            ↓
          </a>
        </div>
      </section>

      {/* CONTENT SECTION (Slides over hero) - Set to z-10 */}
      <div ref={contentRef} className="relative w-full z-10 bg-[rgb(30,22,48)] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {/* Background */}
        {homeBackground}

        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 w-full h-[40vh] z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgb(30, 22, 48), transparent)" }}
        />

        <div className="relative z-20">
          <section id="call-for-papers" className="w-full py-20 px-6 md:px-12">
            <ResearchFields />
          </section>

          <UpcomingTimeline />

          <Gallery />
          <OrganizerSection />
        </div>

        {/* VENUE */}
        <section id="venue" className="w-full py-16 px-6 md:px-12 bg-dark-900">
          <div className="container mx-auto">
            <SectionHeader headerText="Event Venue" />
            {/* Map */}
            <div className="flex w-full justify-center">
              <div className="max-w-4xl w-full mb-12 rounded-lg overflow-hidden border border-accent-gold/50">
                <iframe
                  width="100%"
                  height="500"
                  frameBorder="0"
                  src="https://maps.google.com/maps?q=university of moratuwa&t=&z=15&ie=UTF8&iwloc=&output=embed"
                ></iframe>
              </div>
            </div>
            <UniGallery />
          </div>
        </section>
      </div>
    </div>
  );
};

export default IndexPage;

export const Head = createPageHead({
  title: "MERCon 2027 - Home",
  description:
    "MERCon 2027 is the 13th International Conference organized by the Engineering Research Unit, University of Moratuwa.",
});

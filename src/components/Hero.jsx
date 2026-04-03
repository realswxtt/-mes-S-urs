import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { relationshipData } from '../data/relationshipData';

const Hero = () => {
    const heroRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (!heroRef.current) return;

        const ctx = gsap.context(() => {
            // Targets existence check
            const bg = heroRef.current.querySelector(".hero-bg");
            const text = gsap.utils.toArray(".reveal-text");

            if (bg) {
                gsap.fromTo(bg,
                    { scale: 1.2 },
                    { scale: 1, duration: 3, ease: "power2.out" }
                );
            }

            if (text.length > 0) {
                gsap.fromTo(text,
                    { y: 100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.5, stagger: 0.3, ease: "power4.out", delay: 0.5 }
                );
            }

            if (overlayRef.current) {
                gsap.fromTo(overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 2, ease: "power1.inOut" }
                );
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
            <div
                className="hero-bg absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${relationshipData.hero.backgroundImage})` }}
            />

            <div
                ref={overlayRef}
                className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-luxury-black opacity-0"
            />

            <div className="relative z-10 text-center px-4">
                <div className="overflow-hidden mb-4">
                    <h1 className="reveal-text text-5xl md:text-8xl font-serif text-white font-light tracking-tight">
                        {relationshipData.hero.title}
                    </h1>
                </div>
                <div className="overflow-hidden">
                    <p className="reveal-text text-lg md:text-2xl font-sans text-gold/80 italic tracking-widest uppercase">
                        {relationshipData.hero.subtitle}
                    </p>
                </div>

                <div className="mt-12 reveal-text">
                    <div className="animate-bounce-slow text-white/50">
                        <span className="text-xs tracking-[0.3em] uppercase">Desliza para explorar</span>
                        <div className="w-px h-12 bg-linear-to-b from-gold/50 to-transparent mx-auto mt-4" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import LiveCounter from '../components/LiveCounter';
import PremiumGallery from '../components/PremiumGallery';
import LetterSystem from '../components/LetterSystem';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <main className="relative">
            <Hero />
            <section id="counter" className="py-20 bg-black/50">
                <LiveCounter />
            </section>
            <Timeline />
            <section id="gallery" className="py-20">
                <PremiumGallery />
            </section>
            <section id="letters" className="py-20">
                <LetterSystem />
            </section>

            <section id="final-cta" className="py-40 text-center bg-gradient-to-b from-transparent to-gold/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-4xl font-serif mb-8 text-white/50 italic">Hay algo más que quiero decirte...</h2>
                    <Link
                        to="/momento-especial"
                        className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full text-gold font-sans uppercase tracking-[0.3em] text-xs hover:bg-gold hover:text-black transition-all duration-500 group"
                    >
                        Continuar la historia <div className="w-10 h-[1px] bg-gold group-hover:bg-black transition-colors" />
                    </Link>
                </div>
            </section>

            <footer className="py-10 text-center text-zinc-500 text-sm font-sans uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} Âmes Sœurs • Pour Toujours
            </footer>
        </main>
    );
};

export default Home;

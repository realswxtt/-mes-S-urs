import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Heart, Stars, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SpecialMoment = () => {
    const containerRef = useRef(null);
    const [step, setStep] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);

    const storySteps = [
        {
            text: "Hay momentos que definen una vida...",
            color: "from-black via-black to-black",
            image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=2000&auto=format&fit=crop"
        },
        {
            text: "Y todos los míos tienen nombre de mujer.",
            color: "from-black via-zinc-900 to-black",
            image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=2000&auto=format&fit=crop"
        },
        {
            text: "Contigo el mundo se detiene, y el universo cobra sentido.",
            color: "from-zinc-900 via-black to-[#0b0b0b]",
            image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=2000&auto=format&fit=crop"
        },
        {
            text: "Eres mi destino, mi presente y mi futuro.",
            color: "from-[#0b0b0b] via-zinc-900 to-[#0b0b0b]",
            image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=2000&auto=format&fit=crop"
        }
    ];

    useEffect(() => {
        gsap.fromTo(".story-text",
            { opacity: 0, y: 30, filter: "blur(10px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 2, ease: "power3.out" }
        );
    }, [step]);

    const handleNext = () => {
        if (step < storySteps.length - 1) {
            gsap.to(".story-text", {
                opacity: 0,
                y: -30,
                filter: "blur(10px)",
                duration: 1,
                onComplete: () => setStep(step + 1)
            });
        } else {
            setIsFinishing(true);
        }
    };

    const handleProposal = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#ffffff', '#f5f5dc']
        });

        gsap.to(".proposal-content", {
            scale: 1.1,
            duration: 0.5,
            yoyo: true,
            repeat: 1
        });

        setTimeout(() => {
            alert("¡Ella dijo que SÍ! ❤️");
        }, 1000);
    };

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
            {/* Background Transitions */}
            <div className="absolute inset-0 transition-all duration-2000 ease-in-out opacity-20">
                <img
                    src={storySteps[step].image}
                    className="w-full h-full object-cover animate-zoom-slow"
                    alt="Atmosphere"
                />
            </div>
            <div className={`absolute inset-0 bg-linear-to-b ${storySteps[step].color} opacity-80`} />

            {!isFinishing ? (
                <div className="relative z-10 text-center px-4 max-w-3xl">
                    <p className="story-text text-3xl md:text-5xl font-serif text-white leading-relaxed italic mb-12">
                        {storySteps[step].text}
                    </p>
                    <button
                        onClick={handleNext}
                        className="group flex items-center gap-4 mx-auto text-gold font-sans uppercase tracking-[0.4em] text-xs hover:text-white transition-all"
                    >
                        Siguiente <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            ) : (
                <div className="relative z-10 proposal-content text-center px-4 max-w-2xl bg-white/5 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] border border-white/10 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-gold animate-pulse">
                            <Heart size={40} fill="currentColor" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">¿Quieres seguir escribiendo esta historia conmigo?</h2>
                    <p className="text-zinc-400 font-sans mb-12 leading-relaxed">
                        Cada galaxia, cada estrella y cada segundo nos trajo hasta este momento. Eres tú. Siempre has sido tú.
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleProposal}
                            className="px-10 py-5 bg-gold text-black rounded-full font-serif text-2xl hover:scale-105 hover:bg-gold/90 transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                        >
                            Sí, mil veces sí
                        </button>
                        <Link to="/" className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest mt-8">
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            )}

            {/* Decorative stars */}
            <div className="absolute top-10 left-10 text-gold/20 animate-pulse"><Stars size={40} /></div>
            <div className="absolute bottom-10 right-10 text-gold/20 animate-pulse animation-delay-1000"><Stars size={40} /></div>
        </div>
    );
};

export default SpecialMoment;

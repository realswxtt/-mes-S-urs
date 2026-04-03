import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { relationshipData } from '../data/relationshipData';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Timeline = () => {
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".timeline-item");

            items.forEach((item, index) => {
                const img = item.querySelector(".timeline-image-container");
                const content = item.querySelector(".timeline-content");

                // Parallax effect for the image
                if (img) {
                    gsap.fromTo(img.querySelector("img"),
                        { y: -50 },
                        {
                            y: 50,
                            ease: "none",
                            scrollTrigger: {
                                trigger: img,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true
                            }
                        }
                    );

                    // Entrance reveal
                    gsap.fromTo(img,
                        { scale: 0.9, opacity: 0, y: 50 },
                        {
                            scale: 1, opacity: 1, y: 0,
                            duration: 1.2,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: img,
                                start: "top 80%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                }

                // Content reveal
                if (content) {
                    gsap.fromTo(content,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1, y: 0,
                            duration: 1,
                            ease: "power2.out",
                            delay: 0.3,
                            scrollTrigger: {
                                trigger: content,
                                start: "top 85%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-luxury-black py-24 md:py-48 overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-32">
                    <h2 className="text-4xl md:text-7xl font-serif text-white mb-6">Nuestra Historia</h2>
                    <div className="w-16 h-px bg-gold mx-auto opacity-40 mb-8" />
                    <p className="text-gold/60 font-sans tracking-[0.4em] uppercase text-[10px] md:text-xs">
                        Cada capítulo, un recuerdo eterno
                    </p>
                </div>

                <div className="space-y-48 md:space-y-80">
                    {relationshipData.timeline.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => item.link && navigate(item.link)}
                            className={`timeline-item flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                } items-center gap-12 md:gap-24 ${item.link ? 'cursor-pointer' : ''}`}
                        >
                            {/* Image Column */}
                            <div className="timeline-image-container w-full md:w-3/5 aspect-4/5 md:aspect-video rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 bg-zinc-900 group">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=800'; }}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="text-gold font-serif text-2xl md:text-4xl opacity-50">{String(index + 1).padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="timeline-content w-full md:w-2/5 text-center md:text-left">
                                <span className="text-gold/40 font-sans text-[10px] tracking-[0.5em] uppercase mb-4 block">
                                    {item.date}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-serif mb-6 text-white leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-400 font-sans leading-relaxed text-lg italic pr-0 md:pr-12">
                                    "{item.description}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decorative center line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-gold/10 to-transparent pointer-events-none hidden md:block" />
        </section>
    );
};

export default Timeline;

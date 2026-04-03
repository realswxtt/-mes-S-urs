import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { relationshipData } from '../data/relationshipData';

gsap.registerPlugin(ScrollTrigger);

const ChatSection = () => {
    const containerRef = useRef(null);
    const [visibleMessages, setVisibleMessages] = useState([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            relationshipData.messages.forEach((msg, index) => {
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: `top+=${index * 150} center`,
                    onEnter: () => {
                        setVisibleMessages(prev => [...prev, msg]);
                    },
                    once: true
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="max-w-2xl mx-auto px-4 min-h-[600px] flex flex-col justify-center">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-serif text-white/80">Recuerdas cuando...</h2>
            </div>

            <div className="space-y-8">
                {visibleMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex flex-col ${msg.sender === 'Él' ? 'items-start' : 'items-end'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl text-sm md:text-base font-sans animate-fade-in-up ${msg.sender === 'Él'
                                    ? 'bg-zinc-800 text-white rounded-bl-none'
                                    : 'bg-gold/20 text-gold border border-gold/20 rounded-br-none shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                                }`}
                        >
                            <p className="leading-relaxed">{msg.text}</p>
                            <span className="text-[10px] opacity-40 mt-2 block">{msg.time}</span>
                        </div>
                        <span className="text-[10px] text-zinc-600 mt-1 px-2 uppercase tracking-widest">{msg.sender}</span>
                    </div>
                ))}

                {visibleMessages.length < relationshipData.messages.length && (
                    <div className="flex items-center gap-2 text-zinc-600 animate-pulse px-4">
                        <div className="w-1.5 h-1.5 bg-current rounded-full" />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animation-delay-200" />
                        <div className="w-1.5 h-1.5 bg-current rounded-full animation-delay-400" />
                        <span className="text-[10px] uppercase tracking-widest ml-2">Escribiendo...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSection;

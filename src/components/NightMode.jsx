import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import gsap from 'gsap';

const NightMode = () => {
    const [isNight, setIsNight] = useState(true);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (isNight) {
                document.body.classList.add('night-mode');
                const stars = gsap.utils.toArray(".star");
                if (stars.length > 0) {
                    gsap.to(stars, {
                        opacity: "random(0.2, 1)",
                        repeat: -1,
                        yoyo: true,
                        duration: "random(1, 4)",
                        stagger: {
                            amount: 5,
                            from: "random"
                        }
                    });
                }
            } else {
                document.body.classList.remove('night-mode');
            }
        });
        return () => {
            ctx.revert();
            document.body.classList.remove('night-mode');
        };
    }, [isNight]);

    const stars = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
    }));

    return (
        <>
            <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${isNight ? 'opacity-100' : 'opacity-0'}`}>
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="star absolute bg-white rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            boxShadow: '0 0 5px white'
                        }}
                    />
                ))}
            </div>

            <button
                onClick={() => setIsNight(!isNight)}
                className="fixed top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95"
                title={isNight ? "Modo Día" : "Modo Noche"}
            >
                {isNight ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </>
    );
};

export default NightMode;

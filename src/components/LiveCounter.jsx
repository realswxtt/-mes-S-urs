import React, { useState, useEffect } from 'react';
import { relationshipData } from '../data/relationshipData';

const LiveCounter = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const target = new Date(relationshipData.startDate);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = now.getTime() - target.getTime();

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const CounterItem = ({ label, value }) => (
        <div className="flex flex-col items-center">
            <div className="text-4xl md:text-7xl font-serif text-white mb-2 tabular-nums">
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gold/60 font-sans">
                {label}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-zinc-500 font-sans text-xs tracking-[0.5em] uppercase mb-12">Desde el primer momento</h2>
            <div className="flex justify-center gap-8 md:gap-16">
                <CounterItem label="Días" value={timeLeft.days} />
                <CounterItem label="Horas" value={timeLeft.hours} />
                <CounterItem label="Minutos" value={timeLeft.minutes} />
                <CounterItem label="Segundos" value={timeLeft.seconds} />
            </div>
            <div className="mt-12 text-zinc-600 font-serif italic text-sm">
                Cada segundo a tu lado es una eternidad de felicidad.
            </div>
        </div>
    );
};

export default LiveCounter;

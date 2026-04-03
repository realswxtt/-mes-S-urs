import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    // Mauricio Mesones - La cumbia linda del amor
    const audioSrc = "/la-cumbia-linda.mp3";

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Autoplay blocked or error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="fixed bottom-8 left-8 z-50 flex items-center gap-4">
            <audio
                ref={audioRef}
                src={audioSrc}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <button
                onClick={togglePlay}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 bg-white/10 text-white backdrop-blur-md hover:scale-110 active:scale-95 ${isPlaying ? 'bg-gold/20 text-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]' : ''
                    }`}
            >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>

            {isPlaying && (
                <div className="flex items-center gap-2 overflow-hidden animate-fade-in-right">
                    <div className="text-[10px] font-sans tracking-widest uppercase text-white/60 whitespace-nowrap">
                        La Cumbia Linda del Amor
                    </div>
                    <button onClick={toggleMute} className="text-white/40 hover:text-white transition-colors p-1">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;

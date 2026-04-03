import React, { useState } from 'react';
import { Mail, Unlock, Lock, Eye, Send } from 'lucide-react';
import gsap from 'gsap';

const LetterSystem = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [viewingLetter, setViewingLetter] = useState(null);

    const mockLetters = [
        { id: 1, date: "12 Oct 2023", title: "Para mi persona favorita", excerpt: "Desde el momento en que te vi, supe...", content: "Mi amor,\n\nEscribir esto me llena de una emoción que las palabras apenas pueden capturar. Cada día a tu lado es un regalo que valoro más de lo que imaginas. Gracias por ser mi luz, mi risa y mi hogar.\n\nSiempre tuyo." },
        { id: 2, date: "24 Dic 2023", title: "Nuestra primera Navidad", excerpt: "Bajo las luces y el frío, tu calor fue...", content: "Cariño,\n\nEsta Navidad ha sido la más especial de mi vida. No necesito regalos cuando tengo tu sonrisa frente al árbol. Que esta sea la primera de muchas vidas celebrando juntos.\n\nTe amo infinitamente." },
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "siempre") { // Mock password
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Contraseña incorrecta, amor.");
        }
    };

    const openLetter = (letter) => {
        setViewingLetter(letter);
        gsap.fromTo(".letter-content",
            { rotationX: 90, opacity: 0 },
            { rotationX: 0, opacity: 1, duration: 1, ease: "power4.out" }
        );
    };

    return (
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif mb-4">Cartas Privadas</h2>
                <p className="text-zinc-500 font-sans tracking-widest uppercase text-xs">Solo para nuestros ojos</p>
            </div>

            {!isAuthenticated ? (
                <div className="bg-zinc-900/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10 text-center max-w-md mx-auto shadow-2xl">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-2xl font-serif mb-6 text-white">Espacio Protegido</h3>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Introduce nuestra clave..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-center"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="w-full bg-gold text-black font-sans uppercase tracking-[0.2em] py-3 rounded-lg hover:bg-gold/90 transition-all font-semibold">
                            Desbloquear Tesoro
                        </button>
                        {error && <p className="text-red-400 text-sm mt-4 italic">{error}</p>}
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockLetters.map((letter) => (
                        <div
                            key={letter.id}
                            className="bg-zinc-900 border border-white/5 p-6 rounded-xl hover:border-gold/30 transition-all cursor-pointer group"
                            onClick={() => openLetter(letter)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Mail className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{letter.date}</span>
                            </div>
                            <h4 className="text-xl font-serif mb-2 text-white">{letter.title}</h4>
                            <p className="text-zinc-500 text-sm line-clamp-2">{letter.excerpt}</p>
                            <div className="mt-4 flex items-center text-xs text-gold font-sans uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity">
                                Leer carta <Eye size={12} className="ml-2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Viewing Letter Modal */}
            {viewingLetter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                    <div className="relative w-full max-w-2xl my-8">
                        <div className="letter-content bg-[#f9f5f0] text-[#2c2c2c] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm min-h-[500px] perspective-1000 transform-style-3d">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-red-800 via-blue-800 to-red-800 opacity-20" />
                            <button
                                className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
                                onClick={() => setViewingLetter(null)}
                            >
                                Cerrar
                            </button>

                            <div className="font-serif text-sm italic text-zinc-400 mb-8 border-b border-zinc-200 pb-2">
                                {viewingLetter.date}
                            </div>

                            <h3 className="font-serif text-3xl md:text-4xl mb-8 leading-tight">
                                {viewingLetter.title}
                            </h3>

                            <div className="font-serif text-lg leading-loose whitespace-pre-wrap italic">
                                {viewingLetter.content}
                            </div>

                            <div className="mt-12 text-zinc-400 text-sm font-sans tracking-widest uppercase">
                                Con amor, Siempre.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LetterSystem;

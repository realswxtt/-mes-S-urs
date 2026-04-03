import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Heart, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // 'Iris' or 'Jose'
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('Credenciales incorrectas. ¿Seguro que eres tú? ❤️');
            setLoading(false);
            gsap.to(".login-card", { x: 10, repeat: 5, yoyo: true, duration: 0.1 });
        } else {
            navigate('/');
        }
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        setEmail(user === 'Iris' ? 'iris@abejita.com' : 'jose@abejita.com');
        gsap.to(".portal-choice", {
            opacity: 0, scale: 0.9, duration: 0.5, onComplete: () => {
                gsap.fromTo(".login-form", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
            }
        });
    };

    return (
        <div className="min-h-screen bg-luxury-black flex items-center justify-center p-6 pt-24 overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full animate-pulse-slow delay-1000" />
            </div>

            <div className="login-card w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 relative z-10 shadow-2xl">
                {!selectedUser ? (
                    <div className="portal-choice text-center">
                        <Heart className="mx-auto text-gold mb-8 animate-pulse" size={48} />
                        <h1 className="text-4xl font-serif text-white mb-4 italic">Hola Amor...</h1>
                        <p className="text-white/40 font-sans tracking-widest text-xs uppercase mb-12">Âmes Sœurs • Portal Privado</p>

                        <div className="grid grid-cols-2 gap-6">
                            <button
                                onClick={() => selectUser('Iris')}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-500"
                            >
                                <div className="text-2xl font-serif text-white group-hover:text-gold transition-colors">Iris</div>
                                <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-2 group-hover:text-gold/40">Entrar</div>
                            </button>
                            <button
                                onClick={() => selectUser('Jose')}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-500"
                            >
                                <div className="text-2xl font-serif text-white group-hover:text-gold transition-colors">Jose</div>
                                <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-2 group-hover:text-gold/40">Entrar</div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="login-form">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="text-white/20 hover:text-gold text-xs uppercase tracking-widest mb-8 flex items-center gap-2 transition-colors"
                        >
                            <ArrowRight size={14} className="rotate-180" /> Cambiar Portal
                        </button>
                        <h2 className="text-3xl font-serif text-white mb-2">Bienvenido, {selectedUser}</h2>
                        <p className="text-white/40 text-sm mb-12 italic">Introduce vuestro código secreto</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                <input
                                    type="password"
                                    placeholder="Vuestro código secreto"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-white focus:outline-none focus:border-gold/50 transition-all"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gold text-black font-sans font-bold uppercase tracking-[0.3em] py-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Entrar <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;

import React, { useState, useEffect, useRef } from 'react';
import { Plane, Calendar, MapPin, CheckCircle2, Circle, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const LimaTrip = () => {
    const { user } = useAuth();
    const containerRef = useRef(null);
    const tripDate = new Date("2026-04-24T00:00:00");
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    const calculateTimeLeft = () => {
        const difference = +tripDate - +new Date();
        if (difference > 0) {
            return {
                'Días': Math.floor(difference / (1000 * 60 * 60 * 24)),
                'Horas': Math.floor((difference / (1000 * 60 * 60)) % 24),
                'Minutos': Math.floor((difference / 1000 / 60) % 60),
            };
        }
        return { 'Días': 0, 'Horas': 0, 'Minutos': 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    const fetchTodos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('trip_todos')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) {
            setTodos(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTodos();
        const timer = setInterval(() => {
            git
            setTimeLeft(calculateTimeLeft());
        }, 60000);

        const ctx = gsap.context(() => {
            gsap.from(".trip-fade", {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                clearProps: "all"
            });
        }, containerRef);

        return () => {
            clearInterval(timer);
            ctx.revert();
        };
    }, []);

    const toggleTodo = async (todo) => {
        const newStatus = !todo.completed;

        // Optimistic UI
        setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: newStatus } : t));

        await supabase
            .from('trip_todos')
            .update({ completed: newStatus })
            .eq('id', todo.id);
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const { data, error } = await supabase
            .from('trip_todos')
            .insert([{ text: newTodo.trim(), completed: false }])
            .select();

        if (!error && data) {
            setTodos(prev => [...prev, data[0]]);
            setNewTodo('');
        }
    };

    const deleteTodo = async (id, e) => {
        e.stopPropagation();
        await supabase.from('trip_todos').delete().eq('id', id);
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-luxury-black text-white py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="trip-fade inline-flex items-center gap-2 text-gold/60 hover:text-gold transition-colors mb-12 uppercase tracking-widest text-xs">
                    <ArrowLeft size={16} /> Volver a nuestra historia
                </Link>

                {/* Hero Section */}
                <div className="text-center mb-20 trip-fade">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-6 border border-gold/20">
                        <Plane className="text-gold animate-bounce-slow" size={32} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">Nuestro Primer Viaje</h1>
                    <p className="text-gold/60 font-sans tracking-[0.4em] uppercase text-xs">Destino: Lima, Perú</p>
                </div>

                {/* Countdown Grid */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 mb-20 trip-fade">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                            <div className="text-4xl md:text-6xl font-serif text-white mb-2">{value}</div>
                            <div className="text-gold/40 text-[10px] md:text-xs uppercase tracking-widest">{unit}</div>
                        </div>
                    ))}
                </div>

                {/* Interactive List */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 trip-fade shadow-2xl">
                    <div className="flex items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <MapPin className="text-gold" size={24} />
                            <h2 className="text-2xl md:text-4xl font-serif">Plan para Lima</h2>
                        </div>
                        {loading && <Loader2 className="animate-spin text-gold/40" size={20} />}
                    </div>

                    <form onSubmit={addTodo} className="mb-10 flex gap-4">
                        <input
                            type="text"
                            placeholder="¿Qué más haremos juntos?"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 transition-all font-sans"
                        />
                        <button
                            type="submit"
                            className="bg-gold text-black p-4 rounded-2xl hover:scale-105 transition-transform"
                        >
                            <Plus size={24} />
                        </button>
                    </form>

                    <div className="space-y-4">
                        {todos.map((todo) => (
                            <div
                                key={todo.id}
                                onClick={() => toggleTodo(todo)}
                                className="flex items-center justify-between gap-4 group cursor-pointer bg-white/2 p-4 rounded-2xl border border-transparent hover:border-white/10 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {todo.completed ? (
                                        <CheckCircle2 className="text-gold shrink-0" />
                                    ) : (
                                        <Circle className="text-white/20 group-hover:text-gold/50 shrink-0 transition-colors" />
                                    )}
                                    <span className={`text-lg md:text-xl font-sans transition-all ${todo.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>
                                        {todo.text}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => deleteTodo(todo.id, e)}
                                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {todos.length === 0 && !loading && (
                        <div className="text-center py-10 opacity-20">
                            <p className="italic">Vuestra lista está vacía. ¡Empieza a soñar!</p>
                        </div>
                    )}

                    <div className="mt-12 pt-12 border-t border-white/10 text-center">
                        <p className="text-zinc-500 italic font-serif text-lg">
                            "El mundo es más bonito si lo camino a tu lado."
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full" />
        </div>
    );
};

export default LimaTrip;

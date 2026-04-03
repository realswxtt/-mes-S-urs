import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Camera, Calendar as CalendarIcon, FileText, X, ChevronRight, Share2, Search, Loader2, Utensils, Palette, Mountain, Coffee, Trophy, Heart as HeartIcon, Plane } from 'lucide-react';
import { datesData } from '../data/datesData';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const categoryIcons = {
    'Todas': <HeartIcon size={12} />,
    'Comida': <Utensils size={12} />,
    'Creatividad': <Palette size={12} />,
    'Aventura': <Mountain size={12} />,
    'Relax': <Coffee size={12} />,
    'Juegos': <Trophy size={12} />,
    'Romance': <HeartIcon size={12} />,
    'Lima': <Plane size={12} />
};

const DatesPage = () => {
    const { user } = useAuth();
    const [completedDates, setCompletedDates] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filter, setFilter] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchProgress = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('completed_dates')
            .select('*');

        if (!error && data) {
            const progressMap = {};
            data.forEach(item => {
                progressMap[item.date_id] = item;
            });
            setCompletedDates(progressMap);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const toggleComplete = async (dateId, e) => {
        e.stopPropagation();
        if (!user) return alert("Inicia sesión para guardar tu progreso ❤️");

        const isCurrentlyCompleted = completedDates[dateId]?.completed;
        const newStatus = !isCurrentlyCompleted;

        // Optimistic UI
        setCompletedDates(prev => ({
            ...prev,
            [dateId]: { ...prev[dateId], completed: newStatus }
        }));

        const existingRecord = completedDates[dateId];

        if (existingRecord?.id) {
            await supabase
                .from('completed_dates')
                .update({ completed: newStatus })
                .eq('id', existingRecord.id);
        } else {
            const { data } = await supabase
                .from('completed_dates')
                .insert([{
                    date_id: dateId,
                    completed: newStatus,
                    user_id: user.id
                }])
                .select();

            if (data) {
                setCompletedDates(prev => ({
                    ...prev,
                    [dateId]: data[0]
                }));
            }
        }
    };

    const openDateDetails = (date) => {
        setSelectedDate(date);
        setTimeout(() => {
            gsap.fromTo(".date-modal",
                { scale: 0.9, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
            );
        }, 10);
    };

    const handleSaveDetails = async (dateId, fields) => {
        if (!user) return;

        const existingRecord = completedDates[dateId];
        const updates = {
            ...fields,
            completed: true,
            user_id: user.id,
            date_id: dateId
        };

        if (existingRecord?.id) {
            await supabase
                .from('completed_dates')
                .update(updates)
                .eq('id', existingRecord.id);
        } else {
            await supabase
                .from('completed_dates')
                .insert([updates]);
        }

        fetchProgress();
        setSelectedDate(null);
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user || !selectedDate) {
            if (!user) alert("Inicia sesión para subir fotos ❤️");
            return;
        }

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `date-${selectedDate.id}-${Math.random()}.${fileExt}`;
        const filePath = `dates/${user.id}/${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('galley')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('galley')
                .getPublicUrl(filePath);

            await handleSaveDetails(selectedDate.id, { photo_url: publicUrl });
        } catch (error) {
            console.error('Error uploading date photo:', error);
            alert(`Error al subir la foto: ${error.message || 'Verifica los permisos en Supabase'}`);
        } finally {
            setUploading(false);
        }
    };

    const categories = ['Todas', ...new Set(datesData.map(d => d.category))];
    const filteredDates = datesData.filter(d => {
        const matchesCat = filter === 'Todas' || d.category === filter;
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const progress = Math.round((Object.values(completedDates).filter(d => d.completed).length / datesData.length) * 100);

    return (
        <div className="min-h-screen bg-luxury-black text-white pb-10 pt-24">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-luxury-black/80 backdrop-blur-xl border-b border-white/5 pb-6 pt-4 px-6 mb-8">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div className="flex-1 w-full">
                            <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Nuestras 100 Citas</h1>
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-gold/60 text-[10px] uppercase tracking-[0.3em] font-sans">Vuestro Progreso</span>
                                    <span className="text-gold font-serif italic text-xl">{progress}%</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-linear-to-r from-gold/50 via-gold to-gold/50 transition-all duration-1000 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar aventura..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-gold/50 transition-all placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    {/* Category Scroll */}
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mx-2 px-2 mask-linear-right">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`whitespace-nowrap px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${filter === cat
                                    ? 'bg-gold text-black font-bold shadow-[0_5px_15px_rgba(212,175,55,0.3)]'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                                    }`}
                            >
                                <span className={filter === cat ? 'text-black' : 'text-gold/50'}>
                                    {categoryIcons[cat] || <HeartIcon size={12} />}
                                </span>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 max-w-5xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-40">
                        <Loader2 className="animate-spin text-gold" size={40} />
                        <p className="font-serif italic">Cargando vuestro progreso...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {filteredDates.map((date) => {
                            const isCompleted = completedDates[date.id]?.completed;
                            return (
                                <div
                                    key={date.id}
                                    onClick={() => openDateDetails(date)}
                                    className={`group relative p-4 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${isCompleted
                                        ? 'bg-gold/5 border-gold/20'
                                        : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <button
                                            onClick={(e) => toggleComplete(date.id, e)}
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isCompleted ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white/40'
                                                }`}
                                        >
                                            {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                        </button>
                                        <span className="text-[8px] text-zinc-600 uppercase tracking-widest truncate max-w-[60px]">{date.category}</span>
                                    </div>
                                    <div className={`text-sm md:text-base font-serif leading-tight line-clamp-2 min-h-12 ${isCompleted ? 'text-white' : 'text-white/60'
                                        }`}>
                                        {date.title}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gold font-serif text-lg opacity-20 group-hover:opacity-100 transition-opacity">
                                                #{date.id}
                                            </span>
                                            {completedDates[date.id]?.photo_url && (
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                                                    <img src={completedDates[date.id].photo_url} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            )}
                                        </div>
                                        <ChevronRight size={14} className="text-white/10 group-hover:text-gold/50 transition-colors" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredDates.length === 0 && (
                    <div className="text-center py-20 opacity-40">
                        <p className="font-serif italic text-xl">No hay citas que coincidan...</p>
                    </div>
                )}
            </div>

            {/* Date Details Modal */}
            {selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto pt-20">
                    <div className="date-modal bg-zinc-900 w-full max-w-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-auto">
                        <div className="relative h-40 bg-zinc-800 flex items-center justify-center">
                            {completedDates[selectedDate.id]?.photo_url ? (
                                <div className="relative w-full h-full group">
                                    <img src={completedDates[selectedDate.id].photo_url} className="w-full h-full object-cover opacity-80" />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                                    >
                                        <Camera size={24} className="text-gold" />
                                        <span className="text-[10px] text-white uppercase tracking-widest">Cambiar Foto</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20 transition-all ${uploading ? 'animate-pulse border-gold/50' : ''}`}>
                                        {uploading ? <Loader2 className="animate-spin text-gold" size={24} /> : <Camera size={24} className="text-white/20" />}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="px-6 py-2 rounded-full border border-gold/30 text-[10px] text-gold uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all"
                                    >
                                        {uploading ? 'Subiendo Memoria...' : 'Añadir Foto del momento'}
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-transparent to-zinc-900 pointer-events-none" />
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/50 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            <span className="text-gold/60 text-[10px] tracking-widest uppercase mb-1 block">{selectedDate.category}</span>
                            <h2 className="text-2xl md:text-3xl font-serif text-white mb-6 leading-tight">{selectedDate.title}</h2>

                            <div className="space-y-4">
                                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                                    <CalendarIcon size={18} className="text-gold/40" />
                                    <input
                                        type="date"
                                        className="bg-transparent text-white text-sm focus:outline-none w-full"
                                        defaultValue={completedDates[selectedDate.id]?.date_executed || ""}
                                        id="date-input"
                                    />
                                </div>

                                <div className="bg-white/5 rounded-2xl p-4 flex items-start gap-4 border border-white/5">
                                    <FileText size={18} className="text-gold/40 mt-1" />
                                    <textarea
                                        placeholder="Describe este momento..."
                                        className="bg-transparent text-white text-sm focus:outline-none w-full h-20 resize-none font-sans"
                                        defaultValue={completedDates[selectedDate.id]?.description || ""}
                                        id="desc-input"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const d = document.getElementById('date-input').value;
                                        const ds = document.getElementById('desc-input').value;
                                        handleSaveDetails(selectedDate.id, { date_executed: d, description: ds });
                                    }}
                                    className="w-full bg-gold text-black font-sans font-bold uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                                >
                                    Guardar Memoria
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatesPage;
